"use client";

import { useState, useCallback, useEffect } from "react";
import { getBestVoice, preloadVoices } from "@/lib/voice-utils";

interface UseArabicSpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

/**
 * Reusable hook for Arabic text-to-speech.
 * Works for Quran verses, duas, or any Arabic text.
 * Uses shared voice selection for consistent quality across the app.
 */
export function useArabicSpeech(options: UseArabicSpeechOptions = {}) {
  const { rate = 0.8, pitch = 1, lang = "ar" } = options;
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preload voices and cancel speech on unmount
  useEffect(() => {
    preloadVoices();
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
      utterance.lang = lang === "ar" ? "ar-SA" : lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Use shared voice selection for consistent quality
      const voice = getBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
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
