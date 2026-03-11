"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import type { ChatFeature } from "@/types/chat";
import type { TransLang } from "@/lib/islamic-content";
import { CHAT_TEXTS } from "@/lib/chat/constants";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  feature: ChatFeature;
  lang: TransLang;
  showSuggestions: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, feature, lang, showSuggestions }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = CHAT_TEXTS[lang];

  useEffect(() => {
    inputRef.current?.focus();
  }, [feature]);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestions = t.suggestedPrompts[feature];

  return (
    <div className="space-y-2">
      {/* Suggested prompts */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSend(s)}
              disabled={isStreaming}
              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 text-left"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 max-h-24 min-h-[36px] py-1.5 px-2"
          style={{ height: "auto", overflow: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
          }}
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 h-9 w-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Square className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="shrink-0 h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:hover:bg-emerald-600"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
