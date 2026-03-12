"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpenText, Search } from "lucide-react";
import { useChapters } from "@/hooks/use-quran";
import { SurahCard } from "@/components/quran/surah-card";
import { QURAN_TEXTS } from "@/lib/quran-config";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { staggerContainer } from "@/lib/animations";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { chapters, loading } = useChapters();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = QURAN_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (ch) =>
        ch.name_simple.toLowerCase().includes(q) ||
        ch.name_arabic.includes(searchQuery) ||
        ch.translated_name?.name?.toLowerCase().includes(q) ||
        String(ch.id) === q
    );
  }, [chapters, searchQuery]);

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header countryCode={formData.country} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 mb-4">
              <BookOpenText className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-1">{t.pageTitle}</h1>
            <p className="font-arabic text-xl text-amber-600/70 mb-2" dir="rtl">
              القرآن الكريم
            </p>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">{t.subtitle}</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-emerald-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-emerald-50/50 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Surah grid */}
          {!loading && filteredChapters.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              key={searchQuery}
            >
              {filteredChapters.map((chapter) => (
                <SurahCard key={chapter.id} chapter={chapter} t={t} lang={lang} />
              ))}
            </motion.div>
          )}

          {/* No results */}
          {!loading && filteredChapters.length === 0 && (
            <div className="text-center py-16">
              <p className="font-arabic text-4xl text-emerald-200 mb-3">لا نتائج</p>
              <p className="text-gray-400 text-sm">{t.noResults}</p>
            </div>
          )}
        </div>
      </main>

      <Footer countryCode={formData.country} />
    </div>
  );
}
