"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Loader2, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { Verse, QURAN_TEXTS } from "@/lib/quran-config";
import { HAS_MAUDUDI_FOOTNOTES, TAFSIR_IDS } from "@/lib/quran-config";
import type { TransLang } from "@/lib/islamic-content";

interface VerseDisplayProps {
  verse: Verse;
  lang: TransLang;
  t: (typeof QURAN_TEXTS)[keyof typeof QURAN_TEXTS];
  isCurrentlyPlaying?: boolean;
  onPlayVerse?: (verseNumber: number) => void;
}

function extractFootnoteIds(text: string): string[] {
  const matches = text.matchAll(/foot_note="(\d+)"/g);
  return [...matches].map((m) => m[1]);
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

function formatPlainText(text: string): string {
  if (text.includes("<p>") || text.includes("<div>")) {
    return text;
  }

  const cleaned = text.trim();
  if (!cleaned) return "";

  const sentences = cleaned.split(/(?<=[.!?।])\s+/);

  if (sentences.length <= 3) {
    return `<p>${cleaned}</p>`;
  }

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    const group = sentences.slice(i, i + 3).join(" ");
    paragraphs.push(group);
  }

  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

const LANG_TO_TTS: Record<string, string> = {
  en: "en", bn: "bn", ur: "ur", ar: "ar", tr: "tr", ms: "ms", id: "id",
};

// Split text into chunks that fit within the TTS API limit (2000 chars)
function splitIntoChunks(texts: string[]): string[] {
  const MAX_LEN = 1800;
  const chunks: string[] = [];
  for (const raw of texts) {
    const clean = stripHtml(raw).trim();
    if (!clean) continue;
    if (clean.length <= MAX_LEN) {
      chunks.push(clean);
    } else {
      const sentences = clean.split(/(?<=[.!?।])\s+/);
      let current = "";
      for (const sentence of sentences) {
        if (current.length + sentence.length + 1 > MAX_LEN) {
          if (current) chunks.push(current.trim());
          current = sentence;
        } else {
          current += (current ? " " : "") + sentence;
        }
      }
      if (current) chunks.push(current.trim());
    }
  }
  return chunks;
}

export function VerseDisplay({ verse, lang, t, isCurrentlyPlaying, onPlayVerse }: VerseDisplayProps) {
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [tafsirTexts, setTafsirTexts] = useState<string[]>([]);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirFetched, setTafsirFetched] = useState(false);
  const [tafsirPlaying, setTafsirPlaying] = useState(false);
  const [tafsirAudioLoading, setTafsirAudioLoading] = useState(false);
  const tafsirAudioRef = useRef<HTMLAudioElement | null>(null);
  const cancelledRef = useRef(false);

  const rawTranslation = verse.translations?.[0]?.text || "";
  const cleanTranslation = stripHtml(rawTranslation);
  const hasMaududiFootnotes = HAS_MAUDUDI_FOOTNOTES.includes(lang);
  const footnoteIds = hasMaududiFootnotes ? extractFootnoteIds(rawTranslation) : [];
  const tafsirId = TAFSIR_IDS[lang];
  const hasTafsir = footnoteIds.length > 0 || (!hasMaududiFootnotes && tafsirId);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      const audio = tafsirAudioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
      }
    };
  }, []);

  const fetchTafsir = useCallback(async () => {
    if (tafsirFetched) {
      setTafsirOpen(!tafsirOpen);
      return;
    }

    setTafsirOpen(true);
    setTafsirLoading(true);

    try {
      if (hasMaududiFootnotes && footnoteIds.length > 0) {
        const results = await Promise.all(
          footnoteIds.map(async (id) => {
            const res = await fetch(`/api/quran?path=foot_notes/${id}`);
            const data = await res.json();
            return data.foot_note?.text || "";
          })
        );
        setTafsirTexts(results.filter(Boolean));
      } else if (tafsirId) {
        const res = await fetch(
          `/api/quran?path=tafsirs/${tafsirId}/by_ayah/${verse.verse_key}`
        );
        const data = await res.json();
        const text = data.tafsir?.text || "";
        if (text) setTafsirTexts([text]);
      }
    } catch {
      setTafsirTexts(["Failed to load tafsir."]);
    } finally {
      setTafsirLoading(false);
      setTafsirFetched(true);
    }
  }, [tafsirFetched, tafsirOpen, hasMaududiFootnotes, footnoteIds, tafsirId, verse.verse_key]);

  const stopTafsirAudio = useCallback(() => {
    cancelledRef.current = true;
    const audio = tafsirAudioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setTafsirPlaying(false);
    setTafsirAudioLoading(false);
  }, []);

  // Play a single TTS chunk, returns promise that resolves when done
  const playChunk = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!tafsirAudioRef.current) {
        tafsirAudioRef.current = new Audio();
      }
      const audio = tafsirAudioRef.current;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();

      const ttsLang = LANG_TO_TTS[lang] || "en";
      const url = `/api/tts?lang=${ttsLang}&text=${encodeURIComponent(text)}&rate=-5%`;

      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("TTS failed"));
      audio.src = url;
      audio.play().catch(reject);
    });
  }, [lang]);

  const handleListenTafsir = useCallback(async () => {
    if (tafsirPlaying) {
      stopTafsirAudio();
      return;
    }

    if (tafsirTexts.length === 0) return;

    const chunks = splitIntoChunks(tafsirTexts);
    if (chunks.length === 0) return;

    cancelledRef.current = false;
    setTafsirPlaying(true);
    setTafsirAudioLoading(true);

    try {
      for (let i = 0; i < chunks.length; i++) {
        if (cancelledRef.current) break;
        await playChunk(chunks[i]);
        if (i === 0) setTafsirAudioLoading(false);
      }
    } catch {
      // Playback error or cancelled
    } finally {
      if (!cancelledRef.current) {
        setTafsirPlaying(false);
      }
      setTafsirAudioLoading(false);
    }
  }, [tafsirPlaying, tafsirTexts, playChunk, stopTafsirAudio]);

  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-xl border p-5 shadow-sm transition-all duration-300 ${
        isCurrentlyPlaying
          ? "border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-400/20 border-l-4 border-l-emerald-500"
          : "border-emerald-100 bg-white"
      }`}
    >
      {/* Verse number badge + key + audio */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
          {verse.verse_number}
        </span>
        <span className="text-[11px] text-gray-400">{verse.verse_key}</span>
        {onPlayVerse && (
          <button
            onClick={() => onPlayVerse(verse.verse_number)}
            className={`ml-auto rounded-full p-2 transition-all ${
              isCurrentlyPlaying
                ? "text-emerald-600 bg-emerald-100 shadow-sm"
                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
            aria-label={isCurrentlyPlaying ? t.pause : t.play}
            title={isCurrentlyPlaying ? t.pause : t.play}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>
        )}
      </div>

      {/* Arabic text */}
      <div className="mb-4">
        <p
          className="font-arabic text-2xl leading-[2.2] text-emerald-950"
          dir="rtl"
          lang="ar"
        >
          {verse.text_uthmani}
        </p>
      </div>

      {/* Translation */}
      {cleanTranslation && (
        <div className="pt-4 border-t border-emerald-50">
          <p className="text-sm text-gray-600 leading-relaxed">
            {cleanTranslation}
          </p>
        </div>
      )}

      {/* Tafsir toggle button */}
      {hasTafsir && (
        <div className="mt-4">
          <button
            onClick={fetchTafsir}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {tafsirOpen ? t.hideTafsir : t.showTafsir}
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-300 ${tafsirOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {tafsirOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl bg-gradient-to-b from-amber-50/60 to-emerald-50/40 border border-amber-200/40 p-5">
                  {/* Tafsir header with listen button */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-200/30">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100">
                      <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-amber-800 tracking-wide">
                      {t.tafsir}
                    </span>
                    {hasMaududiFootnotes && (
                      <span className="text-[10px] text-amber-600/70 ml-1">
                        — Tafhimul Quran
                      </span>
                    )}

                    {/* Listen to tafsir button */}
                    {!tafsirLoading && tafsirTexts.length > 0 && (
                      <button
                        onClick={handleListenTafsir}
                        className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                          tafsirPlaying
                            ? "text-amber-800 bg-amber-200/80 border border-amber-300 shadow-sm"
                            : "text-amber-700 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-200/60"
                        }`}
                      >
                        {tafsirAudioLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : tafsirPlaying ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                        {tafsirPlaying ? t.stopTafsir : t.listenTafsir}
                      </button>
                    )}
                  </div>

                  {tafsirLoading ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.loading}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {tafsirTexts.map((text, i) => (
                        <div key={i}>
                          {/* Numbered footnote badge */}
                          {footnoteIds.length > 1 && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-200/80 text-amber-800 text-[10px] font-bold">
                                {i + 1}
                              </span>
                              <div className="h-px flex-1 bg-amber-200/40" />
                            </div>
                          )}

                          {/* Tafsir content */}
                          <div
                            className="tafsir-content text-[13px] text-gray-700 leading-[1.85] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_h1]:text-sm [&_h1]:font-bold [&_h1]:text-emerald-800 [&_h1]:mb-2 [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:text-emerald-700 [&_h2]:mb-2"
                            dangerouslySetInnerHTML={{
                              __html: formatPlainText(text),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
