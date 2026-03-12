"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEFAULT_RECITER_ID } from "@/lib/quran-config";

const AUDIO_CDN_BASE = "https://verses.quran.com/";

interface UseQuranAudioOptions {
  surahId: number;
  totalVerses: number;
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
}

// Cache audio URLs per reciter+chapter to avoid re-fetching
const audioUrlCache = new Map<string, Map<number, string>>();

export function useQuranAudio({ surahId, totalVerses }: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullSurahMode, setIsFullSurahMode] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

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

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
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
            // verse_key is like "2:3" — extract verse number
            const verseNum = parseInt(file.verse_key.split(":")[1], 10);
            // The API returns relative URLs like "Alafasy/mp3/002003.mp3"
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

  // Play a specific verse
  const playVerseInternal = useCallback(
    async (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

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

  // Handle verse end — auto-advance in full surah mode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      if (fullSurahRef.current && currentVerseNumber !== null) {
        const nextNum = currentVerseNumber + 1;
        if (nextNum <= totalVerses) {
          playVerseInternal(nextNum);
        } else {
          // Surah complete
          fullSurahRef.current = false;
          setIsFullSurahMode(false);
          setIsPlaying(false);
          setCurrentVerseNumber(null);
          setProgress(0);
        }
      } else {
        // Single verse mode — just stop
        setIsPlaying(false);
        setProgress(100);
      }
    };

    audio.onended = onEnded;
    return () => {
      audio.onended = null;
    };
  }, [currentVerseNumber, totalVerses, playVerseInternal]);

  const playVerse = useCallback(
    (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

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
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const resume = useCallback(() => {
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
    fullSurahRef.current = false;
    setIsFullSurahMode(false);
    setIsPlaying(false);
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

      // If currently playing, restart with new reciter
      if (currentVerseNumber !== null && isPlaying) {
        const audio = audioRef.current;
        if (audio) audio.pause();
        // Need to use the new ID directly since state hasn't updated yet
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
  };
}
