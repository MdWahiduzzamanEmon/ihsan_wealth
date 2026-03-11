"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useFavoriteDuas } from "@/hooks/use-favorite-duas";
import { DUAS, type DuaCategory } from "@/lib/duas-data";
import { DuaCard } from "@/components/duas/dua-card";
import { DuasFilter } from "@/components/duas/duas-filter";
import { AnimatedPattern } from "@/components/ui/animated-pattern";
import { staggerContainer } from "@/lib/animations";
import { getLangFromCountry } from "@/lib/islamic-content";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function DuasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<DuaCategory | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites: favoriteDuas, toggleFavorite } = useFavoriteDuas();
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("zakat-calculator-data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.country) {
          setLang(getLangFromCountry(data.country));
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const filteredDuas = useMemo(() => {
    let result = DUAS;

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((d) => d.category === activeCategory);
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((d) => favoriteDuas.includes(d.id));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.arabic.includes(searchQuery) ||
          d.transliteration.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q) ||
          d.source.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, showFavorites, searchQuery, favoriteDuas]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      {/* Header */}
      <header className="relative overflow-hidden border-b bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900">
        {/* Islamic geometric pattern overlay */}
        <AnimatedPattern color="emerald" opacity={0.1} density="normal" />

        <div className="relative mx-auto max-w-5xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-emerald-100 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/favicon.svg"
                  alt="IhsanWealth"
                  width={36}
                  height={36}
                  className="rounded-lg shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform"
                />
                <span className="text-lg font-bold text-white hidden sm:inline">
                  <span className="text-amber-400">Ihsan</span>Wealth
                </span>
              </Link>
            </div>

            <div className="text-right">
              <p className="font-arabic text-lg text-amber-300/70">الدعاء</p>
              <p className="text-xs text-emerald-300/60">Duas Collection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Page title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 mb-4">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-1">
              Duas Collection
            </h1>
            <p className="font-arabic text-xl text-amber-600/70 mb-2">
              مجموعة الأدعية
            </p>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              A curated collection of essential daily supplications from the Quran and Sunnah.
              Memorize, practice, and keep these duas close to your heart.
            </p>
          </div>

          {/* Filter bar */}
          <div className="mb-8">
            <DuasFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              showFavorites={showFavorites}
              onToggleFavorites={() => setShowFavorites(!showFavorites)}
              favoriteCount={favoriteDuas.length}
            />
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">
            Showing {filteredDuas.length} of {DUAS.length} duas
          </p>

          {/* Duas grid */}
          {filteredDuas.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              key={`${activeCategory}-${showFavorites}-${searchQuery}`}
            >
              {filteredDuas.map((dua) => (
                <DuaCard
                  key={dua.id}
                  dua={dua}
                  isFavorite={favoriteDuas.includes(dua.id)}
                  onToggleFavorite={toggleFavorite}
                  lang={lang}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="font-arabic text-4xl text-emerald-200 mb-3">لا نتائج</p>
              <p className="text-gray-400 text-sm">
                {showFavorites
                  ? "No favorite duas yet. Tap the heart icon on any dua to save it."
                  : "No duas found matching your search. Try a different keyword."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-emerald-950 px-4 py-6 text-center">
        <p className="font-arabic text-sm text-amber-300/50 mb-1" dir="rtl">
          وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ
        </p>
        <p className="text-xs text-emerald-300/40 italic">
          &ldquo;And your Lord says, Call upon Me; I will respond to you.&rdquo; — Quran 40:60
        </p>
      </footer>
    </div>
  );
}
