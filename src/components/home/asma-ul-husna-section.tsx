"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Volume2, Loader2 } from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import { ASMA_UL_HUSNA } from "@/lib/asma-ul-husna-data";
import { useArabicSpeech } from "@/hooks/use-arabic-speech";
import type { TransLang } from "@/lib/islamic-content";

const TEXTS: Record<TransLang, {
  sectionTitle: string;
  spotlightLabel: string;
  exploreAll: string;
}> = {
  en: { sectionTitle: "99 Names of Allah", spotlightLabel: "Name", exploreAll: "Explore All 99 Names" },
  bn: { sectionTitle: "আল্লাহর ৯৯ নাম", spotlightLabel: "নাম", exploreAll: "সকল ৯৯ নাম দেখুন" },
  ur: { sectionTitle: "اللہ کے ۹۹ نام", spotlightLabel: "نام", exploreAll: "تمام ۹۹ نام دیکھیں" },
  ar: { sectionTitle: "أسماء الله الحسنى", spotlightLabel: "اسم", exploreAll: "استعرض الأسماء الحسنى كاملة" },
  tr: { sectionTitle: "Allah'ın 99 İsmi", spotlightLabel: "İsim", exploreAll: "Tüm 99 İsmi Keşfedin" },
  ms: { sectionTitle: "99 Nama Allah", spotlightLabel: "Nama", exploreAll: "Terokai Semua 99 Nama" },
  id: { sectionTitle: "99 Nama Allah", spotlightLabel: "Nama", exploreAll: "Jelajahi Semua 99 Nama" },
};

const GRID_NAMES = ASMA_UL_HUSNA.slice(0, 20);

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function AsmaUlHusnaSection({ lang }: { lang: TransLang }) {
  const t = TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const { speak, speaking, loading } = useArabicSpeech({ lang: "ar" });

  // Carousel state - starts from "name of the day" and auto-rotates
  const [currentIndex, setCurrentIndex] = useState(() => getDayOfYear() % 99);
  const [paused, setPaused] = useState(false);
  const currentName = ASMA_UL_HUSNA[currentIndex];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 99);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const handleSpeak = useCallback((arabic: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    speak(arabic);
  }, [speak]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-6" dir={isRTL ? "rtl" : undefined}>
      {/* Section Header */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 mb-3">
          <span className="font-arabic text-emerald-700 text-xs">أسماء الله الحسنى</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t.sectionTitle}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-300/50" />
          <Star className="h-3 w-3 text-emerald-400" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-300/50" />
        </div>
      </motion.div>

      {/* Carousel Spotlight Card */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mb-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 p-5 sm:p-7 shadow-sm">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="asma-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <path d="M0 10h20M10 0v20" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
              <rect width="100" height="100" fill="url(#asma-pattern)" />
            </svg>
          </div>

          <div className="relative text-center">
            <span className="inline-block text-[10px] font-medium text-emerald-600 bg-emerald-100/60 rounded-full px-2.5 py-0.5 mb-3">
              {t.spotlightLabel} #{currentName.id} / 99
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Arabic name - large calligraphy */}
                <button
                  onClick={(e) => handleSpeak(currentName.arabic, e)}
                  className="group mx-auto block cursor-pointer"
                >
                  <div className="font-arabic text-4xl sm:text-5xl text-emerald-800 mb-2 leading-relaxed group-hover:text-emerald-600 transition-colors">
                    {currentName.arabic}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {loading ? (
                      <Loader2 className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                    ) : (
                      <Volume2 className={`h-3.5 w-3.5 transition-colors ${speaking ? "text-emerald-500" : "text-amber-500 opacity-60 group-hover:opacity-100"}`} />
                    )}
                    <span className="text-lg sm:text-xl font-semibold text-amber-700">
                      {currentName.transliteration}
                    </span>
                  </div>
                </button>

                {/* Meaning */}
                <div className="text-sm font-medium text-gray-700 mb-3">
                  {currentName.meaning[lang]}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
                  {currentName.shortDescription[lang]}
                </p>

                {currentName.quranReference && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
                    <span>📖</span>
                    <span>Quran {currentName.quranReference}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel dots indicator */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const dotIndex = (currentIndex - 2 + i + 99) % 99;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(dotIndex)}
                    className={`rounded-full transition-all ${
                      dotIndex === currentIndex
                        ? "h-2 w-2 bg-emerald-500"
                        : "h-1.5 w-1.5 bg-emerald-200 hover:bg-emerald-300"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of 20 Names */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-2.5"
      >
        {GRID_NAMES.map((name) => (
          <motion.div key={name.id} variants={staggerItem}>
            <button
              onClick={() => handleSpeak(name.arabic)}
              className="group w-full rounded-xl border border-gray-100 bg-white p-2.5 sm:p-3 text-center hover:border-emerald-200 hover:shadow-md hover:scale-[1.03] transition-all duration-200 cursor-pointer"
            >
              {/* Number badge */}
              <div className="mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-700">
                {name.id}
              </div>

              {/* Arabic name */}
              <div className="font-arabic text-base sm:text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight">
                {name.arabic}
              </div>

              {/* Transliteration */}
              <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">
                {name.transliteration}
              </div>

              {/* Meaning - hidden on mobile */}
              <div className="hidden sm:block text-[9px] text-gray-400 mt-0.5 truncate">
                {name.meaning[lang]}
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Explore All Button */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="text-center mt-5"
      >
        <Link
          href="/99-names"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-emerald-800 transition-all active:scale-[0.98]"
        >
          {t.exploreAll}
          <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
      </motion.div>
    </section>
  );
}
