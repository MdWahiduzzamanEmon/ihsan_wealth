"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFavoriteHadiths } from "@/hooks/use-favorite-hadiths";
import { HADITHS, HADITH_TEXTS } from "@/lib/hadith-data";
import { HadithCard } from "@/components/hadith/hadith-card";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookHeart, Star } from "lucide-react";

// Deterministic daily hadith — everyone sees the same one per day
function getTodaysHadithIndex(): number {
  const now = new Date();
  const epoch = new Date(2024, 0, 1);
  const daysSinceEpoch = Math.floor((now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % HADITHS.length;
}

export default function HadithPage() {
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggleFavorite } = useFavoriteHadiths();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = HADITH_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const todaysIndex = getTodaysHadithIndex();
  const todaysHadith = HADITHS[todaysIndex];

  const displayedHadiths = useMemo(() => {
    if (showFavorites) {
      return HADITHS.filter((h) => favorites.includes(h.id));
    }
    return HADITHS;
  }, [showFavorites, favorites]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20" dir={isRtl ? "rtl" : "ltr"}>
      <Header countryCode={formData.country} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Page Title */}
          <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
              <BookHeart className="h-8 w-8 text-emerald-600" />
              {t.title}
              <span className="font-arabic text-xl text-emerald-600/50">حديث اليوم</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </motion.div>

          {/* Today's Hadith - Highlighted */}
          <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">{t.todaysHadith}</h2>
            </div>
            <HadithCard
              hadith={todaysHadith}
              isFavorite={favorites.includes(todaysHadith.id)}
              onToggleFavorite={toggleFavorite}
              lang={lang}
              isHighlighted
            />
          </motion.div>

          {/* Filter tabs */}
          <motion.div className="flex items-center gap-2 mb-6" variants={fadeIn} initial="initial" animate="animate">
            <button
              onClick={() => setShowFavorites(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !showFavorites
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.allHadiths} ({HADITHS.length})
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                showFavorites
                  ? "bg-rose-100 text-rose-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.favorites} ({favorites.length})
            </button>
          </motion.div>

          {/* Hadith List */}
          {showFavorites && displayedHadiths.length === 0 ? (
            <motion.p className="text-center py-12 text-gray-400 text-sm" variants={fadeIn} initial="initial" animate="animate">
              {t.noFavorites}
            </motion.p>
          ) : (
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {displayedHadiths.map((hadith) => (
                <HadithCard
                  key={hadith.id}
                  hadith={hadith}
                  isFavorite={favorites.includes(hadith.id)}
                  onToggleFavorite={toggleFavorite}
                  lang={lang}
                  isHighlighted={hadith.id === todaysHadith.id && !showFavorites}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
