"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Square, Mic, MicOff } from "lucide-react";
import type { ChatFeature } from "@/types/chat";
import type { TransLang } from "@/lib/islamic-content";
import { CHAT_TEXTS } from "@/lib/chat/constants";

// Map TransLang to BCP-47 speech recognition locale
const LANG_TO_SPEECH: Record<TransLang, string> = {
  en: "en-US",
  bn: "bn-BD",
  ur: "ur-PK",
  ar: "ar-SA",
  tr: "tr-TR",
  ms: "ms-MY",
  id: "id-ID",
};

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
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const t = CHAT_TEXTS[lang];

  // Check speech recognition support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [feature]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = LANG_TO_SPEECH[lang] || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = input;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim = transcript;
        }
      }
      setInput(finalTranscript + (interim ? " " + interim : ""));
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      // Auto-resize textarea
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 96)}px`;
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        console.warn("Speech recognition error:", event.error);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, lang, input]);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    recognitionRef.current?.abort();
    setIsListening(false);
    onSend(input);
    setInput("");
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
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
      <div className={`flex items-end gap-1.5 rounded-2xl border p-2 transition-colors ${
        isListening ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"
      }`}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : t.placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 max-h-24 min-h-[36px] py-1.5 px-2"
          style={{ height: "auto", overflow: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
          }}
        />

        {/* Voice button */}
        {speechSupported && !isStreaming && (
          <button
            onClick={toggleVoice}
            className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700"
            }`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}

        {/* Send / Stop button */}
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
