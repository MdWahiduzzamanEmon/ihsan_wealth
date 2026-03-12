"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, X, ChevronDown, Mic2, Loader2 } from "lucide-react";
import { RECITERS } from "@/lib/quran-config";
import { useState, useRef, useCallback } from "react";

interface SurahAudioPlayerProps {
  surahName: string;
  currentVerseNumber: number | null;
  totalVerses: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  reciterId: number;
  isFullSurahMode: boolean;
  audioLoading: boolean;
  onPlayFullSurah: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSeekTo: (time: number) => void;
  onSetReciter: (id: number) => void;
  onNextVerse: () => void;
  onPrevVerse: () => void;
  t: {
    play?: string;
    pause?: string;
    playing?: string;
    reciter?: string;
    selectReciter?: string;
    playFullSurah?: string;
    nowPlaying?: string;
    verse?: string;
  };
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SurahAudioPlayer({
  surahName,
  currentVerseNumber,
  totalVerses,
  isPlaying,
  progress,
  duration,
  currentTime,
  reciterId,
  isFullSurahMode,
  audioLoading,
  onPlayFullSurah,
  onPause,
  onResume,
  onStop,
  onSeekTo,
  onSetReciter,
  onNextVerse,
  onPrevVerse,
  t,
}: SurahAudioPlayerProps) {
  const [reciterOpen, setReciterOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isActive = currentVerseNumber !== null;

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !duration) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      onSeekTo(pct * duration);
    },
    [duration, onSeekTo]
  );

  const currentReciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0];

  // Only render the sticky player bar (the Play Surah button is now inline in the page)
  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-50"
        >
          {/* Reciter dropdown */}
          <AnimatePresence>
            {reciterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-auto max-w-2xl px-4 pb-2"
              >
                <div className="rounded-xl border border-emerald-200 bg-white shadow-xl p-2 space-y-0.5">
                  {RECITERS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSetReciter(r.id);
                        setReciterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                        r.id === reciterId
                          ? "bg-emerald-50 text-emerald-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div>
                        <span className="text-sm font-medium">{r.name}</span>
                        <span className="font-arabic text-xs text-gray-400 ml-2">{r.nameAr}</span>
                      </div>
                      {r.id === reciterId && (
                        <span className="text-xs font-medium text-emerald-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player bar */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border-t border-emerald-700/50 shadow-2xl">
            {/* Progress bar */}
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="h-1.5 bg-emerald-950 cursor-pointer group relative"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-amber-300 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, marginLeft: "-6px" }}
              />
            </div>

            {/* Controls */}
            <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
              {/* Play/Pause + Nav */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onPrevVerse}
                  className="rounded-full p-1.5 text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous verse"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={isPlaying ? onPause : onResume}
                  disabled={audioLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-800 shadow-lg hover:bg-emerald-50 transition-colors active:scale-95 disabled:opacity-70"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {audioLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onNextVerse}
                  className="rounded-full p-1.5 text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next verse"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Surah info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {surahName}
                  <span className="text-emerald-300 font-normal ml-1.5">
                    · {t.verse || "Verse"} {currentVerseNumber}/{totalVerses}
                  </span>
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                  {isFullSurahMode && (
                    <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300 font-medium">
                      {t.playing || "Playing"} Full
                    </span>
                  )}
                </div>
              </div>

              {/* Reciter selector */}
              <button
                onClick={() => setReciterOpen(!reciterOpen)}
                className="hidden sm:flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 hover:text-white hover:bg-white/10 transition-colors border border-emerald-600/50"
              >
                <Mic2 className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">{currentReciter.name.split(" ")[0]}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${reciterOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Close */}
              <button
                onClick={onStop}
                className="rounded-full p-1.5 text-emerald-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
