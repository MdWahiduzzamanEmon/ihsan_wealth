"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import type { ChatMessage, ChatFeature } from "@/types/chat";
import type { MetalPrices } from "@/hooks/use-metal-prices";
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/constants";

interface UseChatOptions {
  language: string;
  zakatSummary?: string;
  metalPrices?: MetalPrices | null;
}

function formatMetalPricesContext(prices: MetalPrices): string {
  const goldNisab = prices.goldPricePerGram * NISAB_GOLD_GRAMS;
  const silverNisab = prices.silverPricePerGram * NISAB_SILVER_GRAMS;
  return [
    `Live Metal Prices (${prices.currency}):`,
    `  Gold: ${prices.goldPricePerGram.toFixed(2)} per gram | ${prices.goldPricePerOunce.toFixed(2)} per troy ounce`,
    `  Silver: ${prices.silverPricePerGram.toFixed(2)} per gram | ${prices.silverPricePerOunce.toFixed(2)} per troy ounce`,
    ``,
    `Nisab Thresholds (${prices.currency}):`,
    `  Gold Nisab (${NISAB_GOLD_GRAMS}g): ${goldNisab.toFixed(2)}`,
    `  Silver Nisab (${NISAB_SILVER_GRAMS}g): ${silverNisab.toFixed(2)}`,
    ``,
    `Source: ${prices.live ? "Live market data" : "Estimated (offline fallback)"}`,
    `Updated: ${prices.timestamp}`,
  ].join("\n");
}

export function useChat({ language, zakatSummary, metalPrices }: UseChatOptions) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [feature, setFeature] = useState<ChatFeature>("islamic-qa");
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
        feature,
      };

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        feature,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            messages: apiMessages,
            feature,
            language,
            zakatSummary,
            metalPricesContext: metalPrices ? formatMetalPricesContext(metalPrices) : undefined,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: `Error: ${err.error || "Something went wrong"}` }
                : m,
            ),
          );
          setIsStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id
                      ? { ...m, content: m.content + parsed.content }
                      : m,
                  ),
                );
              }
            } catch {
              // skip
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: "Error: Connection failed. Please try again." }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, feature, language, zakatSummary, metalPrices, session],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    feature,
    setFeature,
    sendMessage,
    stopStreaming,
    clearChat,
  };
}
