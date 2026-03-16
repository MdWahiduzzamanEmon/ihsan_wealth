"use client";

import { useRef, useEffect } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { IhsanLogo } from "./ihsan-logo";
import { ChatEmptyState } from "./chat-empty-state";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import type { TransLang } from "@/lib/islamic-content";
import type { ChatFeature } from "@/types/chat";
import { CHAT_TEXTS } from "@/lib/chat/constants";
import type { MetalPrices } from "@/hooks/use-metal-prices";

interface ChatPanelProps {
  lang: TransLang;
  zakatSummary?: string;
  metalPrices?: MetalPrices | null;
  /** Full-page mode (taller) vs widget mode */
  fullPage?: boolean;
  /** Close callback for floating widget */
  onClose?: () => void;
  /** External feature state for sidebar integration */
  externalFeature?: ChatFeature;
  onFeatureChange?: (f: ChatFeature) => void;
}

export function ChatPanel({ lang, zakatSummary, metalPrices, fullPage = false, onClose, externalFeature, onFeatureChange }: ChatPanelProps) {
  const { messages, isStreaming, feature: internalFeature, setFeature: setInternalFeature, sendMessage, stopStreaming, clearChat } =
    useChat({ language: lang, zakatSummary, metalPrices });
  const feature = externalFeature ?? internalFeature;
  const setFeature = onFeatureChange ?? setInternalFeature;
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
      {/* Header — compact */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-emerald-700/30 bg-gradient-to-r from-emerald-900 to-emerald-950">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center p-0.5">
            <IhsanLogo size={20} />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-white leading-tight">{t.title}</h3>
            <p className="text-[9px] text-emerald-400/50">Powered by IhsanWealth</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-emerald-400/40 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              title={t.clearChat}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-emerald-400/40 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              title="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-white">
        {messages.length === 0 ? (
          <ChatEmptyState lang={lang} feature={feature} onSend={sendMessage} onFeatureChange={setFeature} />
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

      {/* Disclaimer — minimal */}
      <div className="shrink-0 px-3 py-1 bg-amber-50/50 border-t border-amber-100/50 flex items-center gap-1">
        <AlertTriangle className="h-2.5 w-2.5 text-amber-400 shrink-0" />
        <p className="text-[9px] text-amber-500/80 leading-tight truncate">{t.disclaimer}</p>
      </div>

      {/* Input — tighter */}
      <div className="shrink-0 px-2.5 py-2 border-t border-gray-100 bg-white">
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          feature={feature}
          lang={lang}
          showSuggestions={false}
        />
      </div>
    </div>
  );
}
