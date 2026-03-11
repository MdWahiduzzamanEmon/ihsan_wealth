"use client";

import { useRef, useEffect } from "react";
import { Bot, Trash2, AlertTriangle } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "./chat-message";
import { ChatFeatureTabs } from "./chat-feature-tabs";
import { ChatInput } from "./chat-input";
import type { TransLang } from "@/lib/islamic-content";
import { CHAT_TEXTS } from "@/lib/chat/constants";

interface ChatPanelProps {
  lang: TransLang;
  zakatSummary?: string;
  /** Full-page mode (taller) vs widget mode */
  fullPage?: boolean;
}

export function ChatPanel({ lang, zakatSummary, fullPage = false }: ChatPanelProps) {
  const { messages, isStreaming, feature, setFeature, sendMessage, stopStreaming, clearChat } =
    useChat({ language: lang, zakatSummary });
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = CHAT_TEXTS[lang];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col ${fullPage ? "h-[calc(100vh-200px)] min-h-[500px]" : "h-[520px]"}`}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
            <p className="text-[10px] text-emerald-300/60">Powered by IhsanWealth</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-emerald-300/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            title={t.clearChat}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Feature tabs */}
      <div className="shrink-0 px-3 py-2 border-b bg-white">
        <ChatFeatureTabs active={feature} onChange={setFeature} lang={lang} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <Bot className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{t.title}</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[250px]">
                {t.disclaimer}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
            />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="shrink-0 px-4 py-1.5 bg-amber-50 border-t border-amber-200/50 flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
        <p className="text-[10px] text-amber-600 leading-tight">{t.disclaimer}</p>
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 py-3 border-t bg-white rounded-b-2xl">
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          feature={feature}
          lang={lang}
          showSuggestions={messages.length === 0}
        />
      </div>
    </div>
  );
}
