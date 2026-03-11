"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Loader2 } from "lucide-react";
import { useChapters, useVerses } from "@/hooks/use-quran";
import { VerseDisplay } from "@/components/quran/verse-display";
import { QURAN_TEXTS } from "@/lib/quran-config";
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

  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = QURAN_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const { chapters } = useChapters();
  const { verses, loading, loadingMore, hasMore, loadMore, currentPage, totalPages } = useVerses(surahNum, lang);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === surahNum),
    [chapters, surahNum]
  );

  const showBismillah = chapter?.bismillah_pre !== false && surahNum !== 9;

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header countryCode={formData.country} />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Back link */}
          <Link
            href="/quran"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToList}
          </Link>

          {/* Surah header */}
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
              </>
            ) : (
              <h1 className="text-2xl font-bold text-emerald-900">
                Surah {surahNum}
              </h1>
            )}
          </div>

          {/* Bismillah */}
          {showBismillah && !loading && (
            <div className="text-center mb-8 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="font-arabic text-2xl text-emerald-800" dir="rtl">
                {t.bismillah}
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-emerald-50/50 animate-pulse"
                />
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
                <VerseDisplay key={verse.id} verse={verse} lang={lang} t={t} />
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
    </div>
  );
}
