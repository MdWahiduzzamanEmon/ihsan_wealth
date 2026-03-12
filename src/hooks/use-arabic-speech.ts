"use client";

import { useState, useCallback, useEffect } from "react";

interface UseArabicSpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

/**
 * Reusable hook for Arabic text-to-speech.
 * Works for Quran verses, duas, or any Arabic text.
 */
export function useArabicSpeech(options: UseArabicSpeechOptions = {}) {
  const { rate = 0.8, pitch = 1, lang = "ar-SA" } = options;
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      // If already speaking, stop
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      setLoading(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Try to find an Arabic voice
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith("ar") || v.name.toLowerCase().includes("arabic")
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        setLoading(false);
        setSpeaking(true);
      };
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => {
        setLoading(false);
        setSpeaking(false);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      // Fallback timeout in case onstart doesn't fire
      setTimeout(() => setLoading(false), 1000);
    },
    [speaking, lang, rate, pitch]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return { speak, stop, speaking, loading };
}
