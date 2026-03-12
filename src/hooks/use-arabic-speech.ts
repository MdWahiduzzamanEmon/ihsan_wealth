"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseArabicSpeechOptions {
  lang?: string;
}

/**
 * Reusable hook for text-to-speech using server-side TTS API.
 * Provides consistent, high-quality voice across the app (same voice for Duas & Quran translation).
 */
export function useArabicSpeech(options: UseArabicSpeechOptions = {}) {
  const { lang = "ar" } = options;
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element and clean up on unmount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      // If already speaking, stop
      if (speaking) {
        audio.pause();
        audio.src = "";
        setSpeaking(false);
        return;
      }

      setLoading(true);

      const ttsUrl = `/api/tts?lang=${lang}&text=${encodeURIComponent(text)}`;
      audio.src = ttsUrl;

      audio.oncanplaythrough = () => {
        setLoading(false);
        setSpeaking(true);
      };
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => {
        setLoading(false);
        setSpeaking(false);
      };

      audio.play().catch(() => {
        setLoading(false);
        setSpeaking(false);
      });

      // Fallback timeout in case oncanplaythrough doesn't fire
      setTimeout(() => setLoading(false), 3000);
    },
    [speaking, lang]
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
      setSpeaking(false);
    }
  }, []);

  return { speak, stop, speaking, loading };
}
