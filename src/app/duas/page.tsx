"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFavoriteDuas } from "@/hooks/use-favorite-duas";
import { DUAS, type DuaCategory } from "@/lib/duas-data";
import { DuaCard } from "@/components/duas/dua-card";
import { DuasFilter } from "@/components/duas/duas-filter";
import { staggerContainer } from "@/lib/animations";
import { getLangFromCountry, DUAS_PAGE_TEXTS, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookOpen } from "lucide-react";

export default function DuasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<DuaCategory | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites: favoriteDuas, toggleFavorite } = useFavoriteDuas();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = DUAS_PAGE_TEXTS[lang];

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

  const isRtl = lang === "ar" || lang === "ur";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20" dir={isRtl ? "rtl" : "ltr"}>
      <Header countryCode={formData.country} />

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Page title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 mb-4">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-1">
              {t.pageTitle}
            </h1>
            <p className="font-arabic text-xl text-amber-600/70 mb-2" dir="rtl">
              مجموعة الأدعية
            </p>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              {t.subtitle}
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
              lang={lang}
            />
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">
            {t.showing} {filteredDuas.length} {t.of} {DUAS.length} {t.duas}
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
              <p className="font-arabic text-4xl text-emerald-200 mb-3">{lang === "ar" ? "لا نتائج" : t.noResultsTitle}</p>
              <p className="text-gray-400 text-sm">
                {showFavorites ? t.noFavorites : t.noSearchResults}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer countryCode={formData.country} />
    </div>
  );
}
