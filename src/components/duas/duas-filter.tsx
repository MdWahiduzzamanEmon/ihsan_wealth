"use client";

import { cn } from "@/lib/utils";
import { DUA_CATEGORIES, type DuaCategory } from "@/lib/duas-data";
import { Search, Heart, X } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";

const FILTER_TEXTS: Record<TransLang, {
  searchPlaceholder: string;
  all: string;
  favorites: string;
  categories: Record<DuaCategory, string>;
}> = {
  en: {
    searchPlaceholder: "Search duas by keyword, Arabic, or source...",
    all: "All",
    favorites: "Favorites",
    categories: {
      friday: "Friday / Jummah",
      "morning-evening": "Morning / Evening",
      "daily-life": "Daily Life",
      meals: "Meals",
      prayer: "Prayer",
      travel: "Travel",
      protection: "Protection",
      health: "Health & Healing",
      forgiveness: "Forgiveness",
      gratitude: "Gratitude",
      general: "General",
    },
  },
  bn: {
    searchPlaceholder: "কীওয়ার্ড, আরবি বা উৎস দিয়ে দু'আ খুঁজুন...",
    all: "সব",
    favorites: "পছন্দের",
    categories: {
      friday: "জুমআ",
      "morning-evening": "সকাল / সন্ধ্যা",
      "daily-life": "দৈনন্দিন জীবন",
      meals: "খাবার",
      prayer: "নামায",
      travel: "ভ্রমণ",
      protection: "সুরক্ষা",
      health: "স্বাস্থ্য ও আরোগ্য",
      forgiveness: "ক্ষমা",
      gratitude: "কৃতজ্ঞতা",
      general: "সাধারণ",
    },
  },
  ur: {
    searchPlaceholder: "کلیدی لفظ، عربی یا ماخذ سے دعا تلاش کریں...",
    all: "سب",
    favorites: "پسندیدہ",
    categories: {
      friday: "جمعہ",
      "morning-evening": "صبح / شام",
      "daily-life": "روزمرہ زندگی",
      meals: "کھانا",
      prayer: "نماز",
      travel: "سفر",
      protection: "حفاظت",
      health: "صحت اور شفاء",
      forgiveness: "مغفرت",
      gratitude: "شکر",
      general: "عمومی",
    },
  },
  ar: {
    searchPlaceholder: "ابحث عن الأدعية بالكلمات أو العربية أو المصدر...",
    all: "الكل",
    favorites: "المفضلة",
    categories: {
      friday: "الجمعة",
      "morning-evening": "الصباح والمساء",
      "daily-life": "الحياة اليومية",
      meals: "الطعام",
      prayer: "الصلاة",
      travel: "السفر",
      protection: "الحماية",
      health: "الصحة والشفاء",
      forgiveness: "المغفرة",
      gratitude: "الشكر",
      general: "عامة",
    },
  },
  tr: {
    searchPlaceholder: "Anahtar kelime, Arapca veya kaynak ile dua arayin...",
    all: "Tumü",
    favorites: "Favoriler",
    categories: {
      friday: "Cuma",
      "morning-evening": "Sabah / Aksam",
      "daily-life": "Günlük Hayat",
      meals: "Yemek",
      prayer: "Namaz",
      travel: "Seyahat",
      protection: "Korunma",
      health: "Saglik ve Sifa",
      forgiveness: "Bagislanma",
      gratitude: "Sukur",
      general: "Genel",
    },
  },
  ms: {
    searchPlaceholder: "Cari doa menggunakan kata kunci, Arab, atau sumber...",
    all: "Semua",
    favorites: "Kegemaran",
    categories: {
      friday: "Jumaat",
      "morning-evening": "Pagi / Petang",
      "daily-life": "Kehidupan Harian",
      meals: "Makan",
      prayer: "Solat",
      travel: "Perjalanan",
      protection: "Perlindungan",
      health: "Kesihatan & Penyembuhan",
      forgiveness: "Keampunan",
      gratitude: "Kesyukuran",
      general: "Umum",
    },
  },
  id: {
    searchPlaceholder: "Cari doa dengan kata kunci, Arab, atau sumber...",
    all: "Semua",
    favorites: "Favorit",
    categories: {
      friday: "Jumat",
      "morning-evening": "Pagi / Sore",
      "daily-life": "Kehidupan Sehari-hari",
      meals: "Makan",
      prayer: "Sholat",
      travel: "Perjalanan",
      protection: "Perlindungan",
      health: "Kesehatan & Penyembuhan",
      forgiveness: "Ampunan",
      gratitude: "Syukur",
      general: "Umum",
    },
  },
};

interface DuasFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: DuaCategory | "all";
  onCategoryChange: (category: DuaCategory | "all") => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
  lang?: TransLang;
}

export function DuasFilter({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  showFavorites,
  onToggleFavorites,
  favoriteCount,
  lang = "en",
}: DuasFilterProps) {
  const t = FILTER_TEXTS[lang] || FILTER_TEXTS.en;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-xl border border-emerald-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills - horizontal scroll on mobile, wrap on desktop */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
        {/* All pill */}
        <button
          onClick={() => onCategoryChange("all")}
          className={cn(
            "rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0",
            activeCategory === "all"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          )}
        >
          {t.all}
        </button>

        {/* Category pills */}
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0",
              activeCategory === cat.id
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
            )}
          >
            <span>{cat.emoji}</span>
            <span>{t.categories[cat.id] || cat.label}</span>
          </button>
        ))}

        {/* Favorites toggle */}
        <button
          onClick={onToggleFavorites}
          className={cn(
            "rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 sm:ml-auto",
            showFavorites
              ? "bg-rose-500 text-white shadow-md shadow-rose-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:bg-rose-50"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", showFavorites && "fill-white")} />
          <span>{t.favorites}</span>
          {favoriteCount > 0 && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs leading-none",
                showFavorites ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"
              )}
            >
              {favoriteCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
