"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidBackgroundMusicProps {
  lang: TransLang;
}

export function EidBackgroundMusic({ lang }: EidBackgroundMusicProps) {
  const t = EID_PAGE_TEXTS[lang];
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; gain: GainNode } | null>(null);

  const startMusic = useCallback(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1);
    masterGain.connect(ctx.destination);

    // Gentle ambient pad — C4 + E4 + G4 (major chord)
    const frequencies = [261.63, 329.63, 392.0];
    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(i === 0 ? 0.4 : 0.25, ctx.currentTime);

      // Gentle LFO for breathing effect
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.15 + i * 0.05, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    nodesRef.current = { oscillators, gain: masterGain };
    setIsPlaying(true);
  }, []);

  const stopMusic = useCallback(() => {
    if (nodesRef.current && audioCtxRef.current) {
      const { gain, oscillators } = nodesRef.current;
      const ctx = audioCtxRef.current;
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        oscillators.forEach((o) => { try { o.stop(); } catch { /* */ } });
        ctx.close();
        audioCtxRef.current = null;
        nodesRef.current = null;
      }, 600);
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stopMusic();
    else startMusic();
  }, [isPlaying, startMusic, stopMusic]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-200/80 text-xs font-medium hover:bg-white/20 transition-all"
      title={isPlaying ? t.musicOff : t.musicOn}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
            <VolumeX className="h-3.5 w-3.5" />
            {/* Animated bars */}
            <div className="flex items-end gap-[2px] h-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-emerald-300 rounded-full"
                  animate={{ height: ["3px", "10px", "5px", "8px", "3px"] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Music className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span>{isPlaying ? t.musicOff : t.musicOn}</span>
    </button>
  );
}
