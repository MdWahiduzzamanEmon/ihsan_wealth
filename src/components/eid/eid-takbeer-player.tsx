"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidTakbeerPlayerProps {
  lang: TransLang;
}

const TAKBEER_TEXT = "الله أكبر، الله أكبر، لا إله إلا الله، الله أكبر، الله أكبر، ولله الحمد";

export function EidTakbeerPlayer({ lang }: EidTakbeerPlayerProps) {
  const t = EID_PAGE_TEXTS[lang];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the app's TTS endpoint (GET with query params)
      const params = new URLSearchParams({
        text: TAKBEER_TEXT,
        lang: "ar",
        rate: "-20%", // Slower for recitation feel
      });
      const res = await fetch(`/api/tts?${params.toString()}`);

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      // Cleanup old URL
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      // Stop any existing playback
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Fallback: browser speech synthesis with Arabic voice
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(TAKBEER_TEXT);
          utterance.lang = "ar-SA";
          utterance.rate = 0.7;
          utterance.pitch = 0.9;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      } catch {
        // No audio available
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, stop, play]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-200/80 text-xs font-medium hover:bg-white/20 transition-all disabled:opacity-50"
      title={isPlaying ? t.pauseTakbeer : t.playTakbeer}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <VolumeX className="h-3.5 w-3.5" />
            <div className="flex items-end gap-[2px] h-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-amber-300 rounded-full"
                  animate={{ height: ["4px", "12px", "6px", "10px", "4px"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="paused"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Volume2 className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span>{isPlaying ? t.pauseTakbeer : t.playTakbeer}</span>
    </button>
  );
}
