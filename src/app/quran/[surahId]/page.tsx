"use client";

import { use, useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Loader2, Play, Mic2 } from "lucide-react";
import { useChapters, useVerses, getChapterFromCache } from "@/hooks/use-quran";
import { useQuranAudio } from "@/hooks/use-quran-audio";
import { VerseDisplay } from "@/components/quran/verse-display";
import { SurahAudioPlayer } from "@/components/quran/surah-audio-player";
import { QURAN_TEXTS, RECITERS } from "@/lib/quran-config";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { staggerContainer } from "@/lib/animations";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function SurahPage({ params }: { params: Promise<{ surahId: string }> }) {
  const { surahId } = use(params);
  const surahNum = parseInt(surahId, 10);

  const [formData, , isFormLoaded] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = QURAN_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  // Instant chapter info from localStorage (no network wait)
  const [cachedChapter] = useState(() => getChapterFromCache(surahNum));
  const { chapters } = useChapters();
  const { verses, loading, loadingMore, hasMore, loadMore, currentPage, totalPages } = useVerses(surahNum, lang, isFormLoaded);

  // Use cached chapter immediately, upgrade to fresh data when available
  const chapter = useMemo(
    () => chapters.find((c) => c.id === surahNum) || cachedChapter,
    [chapters, surahNum, cachedChapter]
  );

  const showBismillah = surahNum !== 9 && chapter?.bismillah_pre !== false;

  // Audio hook
  const audio = useQuranAudio({
    surahId: surahNum,
    totalVerses: chapter?.verses_count || 0,
    verses,
    lang,
  });

  // Auto-scroll to currently playing verse
  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const setVerseRef = useCallback((verseNumber: number, el: HTMLDivElement | null) => {
    if (el) verseRefs.current.set(verseNumber, el);
    else verseRefs.current.delete(verseNumber);
  }, []);

  useEffect(() => {
    if (audio.currentVerseNumber && audio.isPlaying) {
      const el = verseRefs.current.get(audio.currentVerseNumber);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [audio.currentVerseNumber, audio.isPlaying]);

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header countryCode={formData.country} />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 pb-32">
          {/* Back link */}
          <Link
            href="/quran"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToList}
          </Link>

          {/* Surah header — shows instantly from cache */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 mb-4">
              <BookOpenText className="h-7 w-7 text-white" />
            </div>

            {chapter ? (
              <>
                <h1 className="text-2xl font-bold text-emerald-900 mb-1">
                  {chapter.name_simple}
                </h1>
                <p className="font-arabic text-2xl text-amber-600/80 mb-2" dir="rtl">
                  {chapter.name_arabic}
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                    chapter.revelation_place === "makkah"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {chapter.revelation_place === "makkah" ? t.meccan : t.medinan}
                  </span>
                  <span>{chapter.verses_count} {t.verses}</span>
                </div>

                {/* Play Surah + Reciter — inline buttons */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => audio.playFullSurah(audio.currentVerseNumber || 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-white text-sm font-semibold shadow-lg shadow-emerald-900/20 hover:from-emerald-700 hover:to-emerald-800 transition-all active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {t.playFullSurah}
                  </button>
                  <button
                    onClick={() => {
                      const idx = RECITERS.findIndex((r) => r.id === audio.reciterId);
                      const next = RECITERS[(idx + 1) % RECITERS.length];
                      audio.setReciter(next.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title={t.selectReciter}
                  >
                    <Mic2 className="h-3.5 w-3.5" />
                    {RECITERS.find((r) => r.id === audio.reciterId)?.name?.split(" ")[0] || "Alafasy"}
                  </button>
                </div>
              </>
            ) : (
              <h1 className="text-2xl font-bold text-emerald-900">
                Surah {surahNum}
              </h1>
            )}
          </div>

          {/* Bismillah — show immediately if chapter is known */}
          {showBismillah && (
            <div className="text-center mb-8 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="font-arabic text-2xl text-emerald-800" dir="rtl">
                {t.bismillah}
              </p>
            </div>
          )}

          {/* Loading state with spinner + skeleton */}
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t.loading}</span>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 animate-pulse" />
                    <div className="h-3 w-12 rounded bg-gray-100 animate-pulse" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-6 w-full rounded bg-emerald-50 animate-pulse" />
                    <div className="h-6 w-3/4 rounded bg-emerald-50 animate-pulse ml-auto" />
                  </div>
                  <div className="pt-4 border-t border-emerald-50 space-y-2">
                    <div className="h-3 w-full rounded bg-gray-50 animate-pulse" />
                    <div className="h-3 w-5/6 rounded bg-gray-50 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verses */}
          {!loading && verses.length > 0 && (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  ref={(el) => setVerseRef(verse.verse_number, el)}
                >
                  <VerseDisplay
                    verse={verse}
                    lang={lang}
                    t={t}
                    isCurrentlyPlaying={audio.currentVerseNumber === verse.verse_number && audio.isPlaying}
                    onPlayVerse={audio.playVerse}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && (hasMore || totalPages > 1) && (
            <div className="mt-8 text-center space-y-3">
              <p className="text-xs text-gray-400">
                {t.page} {currentPage} {t.of} {totalPages}
              </p>
              {hasMore && (
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t.loading}
                    </>
                  ) : (
                    t.loadMore
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer countryCode={formData.country} />

      {/* Audio Player */}
      {chapter && (
        <SurahAudioPlayer
          surahName={chapter.name_simple}
          currentVerseNumber={audio.currentVerseNumber}
          totalVerses={chapter.verses_count}
          isPlaying={audio.isPlaying}
          progress={audio.progress}
          duration={audio.duration}
          currentTime={audio.currentTime}
          reciterId={audio.reciterId}
          isFullSurahMode={audio.isFullSurahMode}
          audioLoading={audio.audioLoading}
          onPlayFullSurah={() => audio.playFullSurah(audio.currentVerseNumber || 1)}
          onPause={audio.pause}
          onResume={audio.resume}
          onStop={audio.stop}
          onSeekTo={audio.seekTo}
          onSetReciter={audio.setReciter}
          onNextVerse={audio.nextVerse}
          onPrevVerse={audio.prevVerse}
          translationEnabled={audio.translationEnabled}
          isSpeakingTranslation={audio.isSpeakingTranslation}
          onToggleTranslation={() => audio.setTranslationEnabled(!audio.translationEnabled)}
          t={t}
        />
      )}
    </div>
  );
}
