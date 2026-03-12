"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEFAULT_RECITER_ID } from "@/lib/quran-config";
import type { Verse } from "@/lib/quran-config";
import { getBestVoice, preloadVoices, LANG_TO_SPEECH } from "@/lib/voice-utils";

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

// Strip HTML tags from translation text
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

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
  const fullSurahRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const translationEnabledRef = useRef(translationEnabled);
  const versesRef = useRef(verses);
  const langRef = useRef(lang);

  // Keep refs in sync
  useEffect(() => { translationEnabledRef.current = translationEnabled; }, [translationEnabled]);
  useEffect(() => { versesRef.current = verses; }, [verses]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  // Initialize audio element once and preload voices
  useEffect(() => {
    if (typeof window === "undefined") return;
    preloadVoices();
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
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

  // Speak translation text using Web Speech API
  const speakTranslation = useCallback(
    (verseNumber: number): Promise<void> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          resolve();
          return;
        }

        const verse = versesRef.current.find((v) => v.verse_number === verseNumber);
        const translationText = verse?.translations?.[0]?.text;
        if (!translationText) {
          resolve();
          return;
        }

        const cleanText = stripHtml(translationText);
        if (!cleanText) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const speechLang = LANG_TO_SPEECH[langRef.current] || "en-US";
        utterance.lang = speechLang;
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Use shared voice selection for consistent, high-quality voice
        const voice = getBestVoice(langRef.current);
        if (voice) {
          utterance.voice = voice;
        }

        setIsSpeakingTranslation(true);

        utterance.onend = () => {
          setIsSpeakingTranslation(false);
          resolve();
        };
        utterance.onerror = () => {
          setIsSpeakingTranslation(false);
          resolve();
        };

        // Small pause before speaking translation
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 400);

        // Safety timeout (max 60 seconds per verse translation)
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          setIsSpeakingTranslation(false);
          resolve();
        }, 60000);
      });
    },
    []
  );

  // What happens after Arabic audio ends
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
          // playVerseInternal will be called — we need to reference it but it's not defined yet
          // So we dispatch a custom event
          window.dispatchEvent(new CustomEvent("quran-advance", { detail: { nextNum } }));
        } else {
          fullSurahRef.current = false;
          setIsFullSurahMode(false);
          setIsPlaying(false);
          setCurrentVerseNumber(null);
          setProgress(0);
        }
      } else {
        setIsPlaying(false);
        setProgress(100);
      }
    },
    [totalVerses, speakTranslation]
  );

  // Play a specific verse
  const playVerseInternal = useCallback(
    async (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Cancel any ongoing TTS
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingTranslation(false);

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
      }
    },
    [fetchAudioUrls, startProgressTracking, reciterId]
  );

  // Listen for advance events (from onArabicEnded)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.nextNum) {
        playVerseInternal(detail.nextNum);
      }
    };
    window.addEventListener("quran-advance", handler);
    return () => window.removeEventListener("quran-advance", handler);
  }, [playVerseInternal]);

  // Handle Arabic audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handler = () => {
      if (currentVerseNumber !== null) {
        onArabicEnded(currentVerseNumber);
      }
    };

    audio.onended = handler;
    return () => {
      audio.onended = null;
    };
  }, [currentVerseNumber, onArabicEnded]);

  const playVerse = useCallback(
    (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Cancel any TTS
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingTranslation(false);

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
    [currentVerseNumber, isPlaying, playVerseInternal, startProgressTracking]
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
    if (audio) {
      audio.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    // If TTS was paused, resume it
    if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }
    const audio = audioRef.current;
    if (audio && audio.src) {
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
      audio.src = "";
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    fullSurahRef.current = false;
    setIsFullSurahMode(false);
    setIsPlaying(false);
    setIsSpeakingTranslation(false);
    setCurrentVerseNumber(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

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
