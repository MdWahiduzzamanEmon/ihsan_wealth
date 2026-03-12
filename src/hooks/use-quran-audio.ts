"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEFAULT_RECITER_ID } from "@/lib/quran-config";

interface UseQuranAudioOptions {
  surahId: number;
  totalVerses: number;
  verses: { verse_number: number; verse_key: string; audio_url?: string }[];
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
}

export function useQuranAudio({ surahId, totalVerses, verses }: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullSurahMode, setIsFullSurahMode] = useState(false);

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

  // Build audio URL for a verse
  const getAudioUrl = useCallback(
    (verseNumber: number) => {
      // Check if verse object has audio_url from API
      const verse = verses.find((v) => v.verse_number === verseNumber);
      if (verse?.audio_url) return verse.audio_url;

      // Fallback: construct CDN URL
      // quran.com CDN pattern: https://cdn.islamic.network/quran/audio/{bitrate}/{reciter_folder}/{surah_verse}.mp3
      // Or use verses.quran.com CDN
      const paddedSurah = String(surahId).padStart(3, "0");
      const paddedVerse = String(verseNumber).padStart(3, "0");

      // Map reciter IDs to CDN folder names
      const reciterFolders: Record<number, string> = {
        7: "Alafasy_128kbps",
        1: "AbdulBaset/Murattal_192kbps",
        2: "AbdulBaset/Mujawwad_128kbps",
        5: "Abu_Bakr_Ash-Shaatree_128kbps",
      };

      const folder = reciterFolders[reciterId] || "Alafasy_128kbps";
      return `https://cdn.islamic.network/quran/audio/128/${folder}/${paddedSurah}${paddedVerse}.mp3`;
    },
    [surahId, verses, reciterId]
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
    (verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const url = getAudioUrl(verseNumber);
      audio.src = url;
      setCurrentVerseNumber(verseNumber);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.play().then(() => {
        setIsPlaying(true);
        startProgressTracking();
      }).catch(() => {
        // Try alternative CDN if first fails
        const altUrl = `/api/quran?path=recitations/${reciterId}/by_ayah/${surahId}:${verseNumber}`;
        fetch(altUrl)
          .then((r) => r.json())
          .then((data) => {
            if (data.audio_files?.[0]?.url) {
              audio.src = data.audio_files[0].url;
              audio.play().then(() => {
                setIsPlaying(true);
                startProgressTracking();
              }).catch(() => {});
            }
          })
          .catch(() => {});
      });
    },
    [getAudioUrl, startProgressTracking, reciterId, surahId]
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
      const audio = audioRef.current;
      if (audio && currentVerseNumber !== null && isPlaying) {
        audio.pause();
        // Will re-trigger with new reciterId on next render
        setTimeout(() => {
          if (currentVerseNumber) playVerseInternal(currentVerseNumber);
        }, 100);
      }
    },
    [currentVerseNumber, isPlaying, playVerseInternal]
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
  };
}
