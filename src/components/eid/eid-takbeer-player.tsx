"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidTakbeerPlayerProps {
  lang: TransLang;
}

const TAKBEER_TEXT = "الله أكبر الله أكبر لا إله إلا الله، الله أكبر الله أكبر ولله الحمد";

export function EidTakbeerPlayer({ lang }: EidTakbeerPlayerProps) {
  const t = EID_PAGE_TEXTS[lang];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = useCallback(async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      // Use the app's TTS endpoint
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: TAKBEER_TEXT, lang: "ar" }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlaying(false);
      };
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Fallback: use browser speech synthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(TAKBEER_TEXT);
        utterance.lang = "ar";
        utterance.rate = 0.8;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying]);

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
            {/* Animated waveform bars */}
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
