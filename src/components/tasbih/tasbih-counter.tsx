"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, ChevronDown, ChevronUp } from "lucide-react";
import { DHIKR_PRESETS, type DhikrPreset } from "@/lib/tasbih-data";
import type { TasbihSession } from "@/hooks/use-tasbih-history";
import type { TransLang } from "@/lib/islamic-content";
import { TASBIH_TEXTS } from "@/lib/tasbih-data";

interface TasbihCounterProps {
  lang: TransLang;
  onSessionComplete: (session: Omit<TasbihSession, "id" | "completed_at" | "date">) => void;
}

const TARGET_OPTIONS = [33, 34, 50, 99, 100, 500, 1000];

export function TasbihCounter({ lang, onSessionComplete }: TasbihCounterProps) {
  const t = TASBIH_TEXTS[lang];
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(DHIKR_PRESETS[0].defaultTarget);
  const [showPresets, setShowPresets] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pulse, setPulse] = useState(false);

  const progress = target > 0 ? (count / target) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const vibrate = useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      try { navigator.vibrate(pattern); } catch {}
    }
  }, []);

  const handleTap = useCallback(() => {
    if (completed) return;

    const newCount = count + 1;
    setCount(newCount);
    setPulse(true);
    vibrate(30);

    if (newCount >= target) {
      setCompleted(true);
      vibrate([200, 100, 200, 100, 200]);
      onSessionComplete({
        dhikr_type: selectedPreset.id,
        custom_text: selectedPreset.id === "custom" ? selectedPreset.arabic : undefined,
        target_count: target,
        completed_count: newCount,
      });
    }
  }, [count, target, completed, vibrate, onSessionComplete, selectedPreset]);

  const handleReset = useCallback(() => {
    // If partially done, save the partial session
    if (count > 0 && !completed) {
      onSessionComplete({
        dhikr_type: selectedPreset.id,
        custom_text: selectedPreset.id === "custom" ? selectedPreset.arabic : undefined,
        target_count: target,
        completed_count: count,
      });
    }
    setCount(0);
    setCompleted(false);
  }, [count, completed, target, selectedPreset, onSessionComplete]);

  const selectPreset = useCallback((preset: DhikrPreset) => {
    if (count > 0) handleReset();
    setSelectedPreset(preset);
    setTarget(preset.defaultTarget);
    setCount(0);
    setCompleted(false);
    setShowPresets(false);
  }, [count, handleReset]);

  // Clear pulse animation
  useEffect(() => {
    if (pulse) {
      const t = setTimeout(() => setPulse(false), 150);
      return () => clearTimeout(t);
    }
  }, [pulse]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dhikr Selector */}
      <div className="w-full max-w-sm">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-sm hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${selectedPreset.iconBg} text-sm font-bold`}>
              ☽
            </span>
            <div className="text-left">
              <p className="font-arabic text-lg text-gray-800">{selectedPreset.arabic}</p>
              <p className="text-xs text-gray-500">{selectedPreset.transliteration}</p>
            </div>
          </div>
          {showPresets ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>

        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-emerald-100 bg-white shadow-lg p-2 space-y-1">
                {DHIKR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      preset.id === selectedPreset.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${preset.iconBg} text-xs`}>☽</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic text-base truncate">{preset.arabic}</p>
                      <p className="text-xs text-gray-500">{preset.translations[lang]}</p>
                    </div>
                    <span className="text-xs text-gray-400">{preset.defaultTarget}x</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Counter Circle */}
      <div className="relative">
        <button
          onClick={handleTap}
          disabled={completed}
          className="relative flex items-center justify-center focus:outline-none active:scale-[0.97] transition-transform"
          aria-label={t.tapToCount}
        >
          {/* SVG Ring */}
          <svg width="272" height="272" className="transform -rotate-90">
            {/* Background ring */}
            <circle cx="136" cy="136" r="120" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            {/* Progress ring */}
            <circle
              cx="136" cy="136" r="120"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-200"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="completed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-emerald-600">{t.completed}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="counting"
                  className="flex flex-col items-center"
                  animate={pulse ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-5xl font-bold text-gray-800 tabular-nums">{count}</span>
                  <span className="text-sm text-gray-400 mt-1">/ {target}</span>
                  <span className="text-xs text-gray-400 mt-2">{t.tapToCount}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>

      {/* Target selector + Reset */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowTargets(!showTargets)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-emerald-300 transition-colors"
          >
            {t.target}: {target}
            {showTargets ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          <AnimatePresence>
            {showTargets && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute bottom-full mb-2 left-0 rounded-lg border border-gray-200 bg-white shadow-lg p-1 z-10"
              >
                {TARGET_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTarget(t); setShowTargets(false); }}
                    className={`block w-full text-left rounded px-3 py-1.5 text-sm transition-colors ${
                      t === target ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t.reset}
        </button>
      </div>

      {/* Translation */}
      <p className="text-center text-sm text-gray-500 italic max-w-xs">
        &ldquo;{selectedPreset.translations[lang]}&rdquo;
      </p>
    </div>
  );
}
