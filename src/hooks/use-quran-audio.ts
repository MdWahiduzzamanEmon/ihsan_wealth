"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEFAULT_RECITER_ID } from "@/lib/quran-config";
import type { Verse } from "@/lib/quran-config";

const AUDIO_CDN_BASE = "https://verses.quran.com/";

interface UseQuranAudioOptions {
  surahId: number;
  totalVerses: number;
  verses: Verse[];
  lang: string;
}

interface UseQuranAudioReturn {
  currentVerseNumber: number | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  reciterId: number;
  playVerse: (verseNumber: number) => void;
  playFullSurah: (startFrom?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setReciter: (id: number) => void;
  nextVerse: () => void;
  prevVerse: () => void;
  isFullSurahMode: boolean;
  audioLoading: boolean;
  translationEnabled: boolean;
  setTranslationEnabled: (v: boolean) => void;
  isSpeakingTranslation: boolean;
}

// Cache audio URLs per reciter+chapter to avoid re-fetching
const audioUrlCache = new Map<string, Map<number, string>>();

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

// Playback phase to prevent any overlap between Arabic and TTS
type PlaybackPhase = "idle" | "arabic" | "translation";

export function useQuranAudio({ surahId, totalVerses, verses, lang }: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullSurahMode, setIsFullSurahMode] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);

  const [translationEnabled, setTranslationEnabledState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quran-translation-audio");
      return saved === "true";
    }
    return false;
  });

  const setTranslationEnabled = useCallback((v: boolean) => {
    setTranslationEnabledState(v);
    try { localStorage.setItem("quran-translation-audio", String(v)); } catch {}
  }, []);

  const [reciterId, setReciterIdState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quran-reciter-id");
      if (saved) return parseInt(saved, 10);
    }
    return DEFAULT_RECITER_ID;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullSurahRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const translationEnabledRef = useRef(translationEnabled);
  const versesRef = useRef(verses);
  const langRef = useRef(lang);
  const phaseRef = useRef<PlaybackPhase>("idle");
  const isSpeakingRef = useRef(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to hold playVerseInternal so onArabicEnded can call it directly
  const playVerseInternalRef = useRef<(verseNumber: number) => void>(() => {});

  // Keep refs in sync
  useEffect(() => { translationEnabledRef.current = translationEnabled; }, [translationEnabled]);
  useEffect(() => { versesRef.current = verses; }, [verses]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  // Initialize audio elements once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const ttsAudio = new Audio();
    ttsAudio.preload = "auto";
    ttsAudioRef.current = ttsAudio;

    return () => {
      audio.pause();
      audio.src = "";
      ttsAudio.pause();
      ttsAudio.src = "";
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  // Fetch all audio URLs for a chapter from the API (batched, cached)
  const fetchAudioUrls = useCallback(
    async (recId: number): Promise<Map<number, string>> => {
      const cacheKey = `${recId}-${surahId}`;
      const cached = audioUrlCache.get(cacheKey);
      if (cached) return cached;

      try {
        const res = await fetch(
          `/api/quran?path=recitations/${recId}/by_chapter/${surahId}`
        );
        const data = await res.json();
        const urlMap = new Map<number, string>();

        if (data.audio_files) {
          for (const file of data.audio_files) {
            const verseNum = parseInt(file.verse_key.split(":")[1], 10);
            const fullUrl = file.url.startsWith("http")
              ? file.url
              : `${AUDIO_CDN_BASE}${file.url}`;
            urlMap.set(verseNum, fullUrl);
          }
        }

        audioUrlCache.set(cacheKey, urlMap);
        return urlMap;
      } catch {
        return new Map();
      }
    },
    [surahId]
  );

  // Progress tracking
  const startProgressTracking = useCallback(() => {
    const update = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
        setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        animFrameRef.current = requestAnimationFrame(update);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(update);
  }, []);

  const langToTtsCode: Record<string, string> = {
    en: "en", bn: "bn", ur: "ur", ar: "ar", tr: "tr", ms: "ms", id: "id",
  };

  // Fully stop TTS audio and clean up
  const stopTts = useCallback(() => {
    const tts = ttsAudioRef.current;
    if (tts) {
      tts.onended = null;
      tts.onerror = null;
      tts.pause();
      tts.removeAttribute("src");
      tts.load(); // Reset the element fully
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    isSpeakingRef.current = false;
    setIsSpeakingTranslation(false);
  }, []);

  // Speak translation using server-side TTS API
  // Returns a promise that resolves ONLY when TTS finishes or fails
  const speakTranslation = useCallback(
    (verseNumber: number): Promise<void> => {
      return new Promise((resolve) => {
        const ttsAudio = ttsAudioRef.current;
        const arabicAudio = audioRef.current;
        if (!ttsAudio) { resolve(); return; }

        const verse = versesRef.current.find((v) => v.verse_number === verseNumber);
        const translationText = verse?.translations?.[0]?.text;
        if (!translationText) { resolve(); return; }

        const cleanText = stripHtml(translationText);
        if (!cleanText) { resolve(); return; }

        // Ensure Arabic audio is fully paused before TTS
        if (arabicAudio && !arabicAudio.paused) {
          arabicAudio.pause();
        }

        // Fully reset TTS element — clear handlers FIRST to prevent stale events
        ttsAudio.onended = null;
        ttsAudio.onerror = null;
        ttsAudio.pause();
        ttsAudio.removeAttribute("src");

        // Clear any previous safety timeout
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }

        const ttsLang = langToTtsCode[langRef.current] || "en";
        const ttsUrl = `/api/tts?lang=${ttsLang}&text=${encodeURIComponent(cleanText)}`;

        phaseRef.current = "translation";
        isSpeakingRef.current = true;
        setIsSpeakingTranslation(true);

        let resolved = false;
        const done = () => {
          if (resolved) return;
          resolved = true;
          ttsAudio.onended = null;
          ttsAudio.onerror = null;
          if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
          }
          isSpeakingRef.current = false;
          setIsSpeakingTranslation(false);
          resolve();
        };

        // Small pause before speaking translation, then set src and play
        setTimeout(() => {
          if (resolved) return; // Already cancelled

          // Set handlers right before setting src — no gap where stale events can fire
          ttsAudio.onended = done;
          ttsAudio.onerror = done;

          ttsAudio.src = ttsUrl;
          ttsAudio.play().catch(done);
        }, 400);

        // Safety timeout (max 60 seconds per verse translation)
        safetyTimeoutRef.current = setTimeout(() => {
          if (!resolved) {
            ttsAudio.pause();
            ttsAudio.removeAttribute("src");
            done();
          }
        }, 60000);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Play a specific verse (Arabic recitation)
  const playVerseInternal = useCallback(
    async (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Fully stop any ongoing TTS before starting Arabic
      stopTts();
      phaseRef.current = "arabic";

      setAudioLoading(true);
      setCurrentVerseNumber(verseNumber);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      try {
        const urlMap = await fetchAudioUrls(reciterId);
        const url = urlMap.get(verseNumber);

        if (!url) {
          setAudioLoading(false);
          // In full surah mode, skip to next verse instead of getting stuck
          if (fullSurahRef.current && verseNumber < totalVerses) {
            setTimeout(() => playVerseInternalRef.current(verseNumber + 1), 100);
          } else {
            setIsPlaying(false);
          }
          return;
        }

        audio.src = url;

        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };

        await audio.play();
        setIsPlaying(true);
        setAudioLoading(false);
        startProgressTracking();
      } catch {
        setAudioLoading(false);
        // On play failure in full surah mode, skip to next verse
        if (fullSurahRef.current && verseNumber < totalVerses) {
          setTimeout(() => playVerseInternalRef.current(verseNumber + 1), 300);
        } else {
          setIsPlaying(false);
        }
      }
    },
    [fetchAudioUrls, startProgressTracking, reciterId, stopTts, totalVerses]
  );

  // Keep the ref in sync so onArabicEnded can always call the latest version
  useEffect(() => {
    playVerseInternalRef.current = playVerseInternal;
  }, [playVerseInternal]);

  // Handle Arabic audio end — speak translation then advance
  const onArabicEnded = useCallback(
    async (verseNumber: number) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      // If translation is enabled, speak it before advancing
      if (translationEnabledRef.current) {
        await speakTranslation(verseNumber);
      }

      // Now advance or stop
      if (fullSurahRef.current) {
        const nextNum = verseNumber + 1;
        if (nextNum <= totalVerses) {
          // Call via ref to always get the latest playVerseInternal
          playVerseInternalRef.current(nextNum);
        } else {
          fullSurahRef.current = false;
          phaseRef.current = "idle";
          setIsFullSurahMode(false);
          setIsPlaying(false);
          setCurrentVerseNumber(null);
          setProgress(0);
        }
      } else {
        phaseRef.current = "idle";
        setIsPlaying(false);
        setProgress(100);
      }
    },
    [totalVerses, speakTranslation]
  );

  // Handle Arabic audio end + error events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentVerseNumber !== null) {
        onArabicEnded(currentVerseNumber);
      }
    };

    // On audio error (network timeout, CDN failure, decode error),
    // skip to next verse in full surah mode instead of getting stuck
    const handleError = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAudioLoading(false);

      if (fullSurahRef.current && currentVerseNumber !== null && currentVerseNumber < totalVerses) {
        setTimeout(() => playVerseInternalRef.current(currentVerseNumber + 1), 300);
      } else {
        setIsPlaying(false);
        phaseRef.current = "idle";
      }
    };

    // Also handle stall — audio has been trying to load but no data is coming
    let stallTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleStalled = () => {
      // Give it 10 seconds to recover, then skip
      if (stallTimeout) clearTimeout(stallTimeout);
      stallTimeout = setTimeout(() => {
        if (audio.readyState < 3 && !audio.paused && fullSurahRef.current) {
          handleError();
        }
      }, 10000);
    };

    const handlePlaying = () => {
      // Audio recovered from stall, cancel the timeout
      if (stallTimeout) {
        clearTimeout(stallTimeout);
        stallTimeout = null;
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("playing", handlePlaying);
      if (stallTimeout) clearTimeout(stallTimeout);
    };
  }, [currentVerseNumber, onArabicEnded, totalVerses]);

  const playVerse = useCallback(
    (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Stop any TTS
      stopTts();

      // If same verse is playing, toggle pause/resume
      if (currentVerseNumber === verseNumber && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        return;
      }

      if (currentVerseNumber === verseNumber && !isPlaying && audio.src) {
        audio.play().then(() => {
          setIsPlaying(true);
          startProgressTracking();
        }).catch(() => {});
        return;
      }

      fullSurahRef.current = false;
      setIsFullSurahMode(false);
      playVerseInternal(verseNumber);
    },
    [currentVerseNumber, isPlaying, playVerseInternal, startProgressTracking, stopTts]
  );

  const playFullSurah = useCallback(
    (startFrom: number = 1) => {
      fullSurahRef.current = true;
      setIsFullSurahMode(true);
      playVerseInternal(startFrom);
    },
    [playVerseInternal]
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
    const tts = ttsAudioRef.current;
    if (tts && !tts.paused) {
      tts.pause();
    }
    setIsPlaying(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    // Use ref to avoid stale closure — check if we're in translation phase
    if (isSpeakingRef.current) {
      const tts = ttsAudioRef.current;
      if (tts && tts.src && tts.paused) {
        tts.play().catch(() => {});
        setIsPlaying(true);
        return;
      }
    }
    const audio = audioRef.current;
    if (audio && audio.src && audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        startProgressTracking();
      }).catch(() => {});
    }
  }, [startProgressTracking]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    stopTts();
    fullSurahRef.current = false;
    phaseRef.current = "idle";
    setIsFullSurahMode(false);
    setIsPlaying(false);
    setCurrentVerseNumber(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, [stopTts]);

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = time;
      setCurrentTime(time);
      setProgress((time / audio.duration) * 100);
    }
  }, []);

  const setReciter = useCallback(
    (id: number) => {
      setReciterIdState(id);
      try {
        localStorage.setItem("quran-reciter-id", String(id));
      } catch {}

      if (currentVerseNumber !== null && isPlaying) {
        const audio = audioRef.current;
        if (audio) audio.pause();
        const fetchAndPlay = async () => {
          const cacheKey = `${id}-${surahId}`;
          let urlMap = audioUrlCache.get(cacheKey);
          if (!urlMap) {
            try {
              const res = await fetch(`/api/quran?path=recitations/${id}/by_chapter/${surahId}`);
              const data = await res.json();
              urlMap = new Map<number, string>();
              if (data.audio_files) {
                for (const file of data.audio_files) {
                  const verseNum = parseInt(file.verse_key.split(":")[1], 10);
                  const fullUrl = file.url.startsWith("http") ? file.url : `${AUDIO_CDN_BASE}${file.url}`;
                  urlMap.set(verseNum, fullUrl);
                }
              }
              audioUrlCache.set(cacheKey, urlMap);
            } catch {
              return;
            }
          }
          const url = urlMap.get(currentVerseNumber!);
          if (url && audio) {
            audio.src = url;
            try {
              await audio.play();
              setIsPlaying(true);
              startProgressTracking();
            } catch {}
          }
        };
        fetchAndPlay();
      }
    },
    [currentVerseNumber, isPlaying, surahId, startProgressTracking]
  );

  const nextVerse = useCallback(() => {
    if (currentVerseNumber !== null && currentVerseNumber < totalVerses) {
      playVerseInternal(currentVerseNumber + 1);
    }
  }, [currentVerseNumber, totalVerses, playVerseInternal]);

  const prevVerse = useCallback(() => {
    if (currentVerseNumber !== null && currentVerseNumber > 1) {
      playVerseInternal(currentVerseNumber - 1);
    }
  }, [currentVerseNumber, playVerseInternal]);

  return {
    currentVerseNumber,
    isPlaying,
    progress,
    duration,
    currentTime,
    reciterId,
    playVerse,
    playFullSurah,
    pause,
    resume,
    stop,
    seekTo,
    setReciter,
    nextVerse,
    prevVerse,
    isFullSurahMode,
    audioLoading,
    translationEnabled,
    setTranslationEnabled,
    isSpeakingTranslation,
  };
}
