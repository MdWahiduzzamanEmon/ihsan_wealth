"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Star, Volume2, Loader2 } from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import { ASMA_UL_HUSNA } from "@/lib/asma-ul-husna-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import type { ZakatFormData } from "@/types/zakat";
import { DEFAULT_FORM_DATA } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BismillahBanner } from "@/components/islamic/bismillah-banner";
import { useArabicSpeech } from "@/hooks/use-arabic-speech";

const PAGE_TEXTS: Record<TransLang, {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  meaning: string;
  noResults: string;
  quranRef: string;
}> = {
  en: { title: "99 Names of Allah", subtitle: "أسماء الله الحسنى — The Most Beautiful Names", searchPlaceholder: "Search by name or meaning...", meaning: "Meaning", noResults: "No names found matching your search.", quranRef: "Quran Reference" },
  bn: { title: "আল্লাহর ৯৯ নাম", subtitle: "أسماء الله الحسنى — সর্বোত্তম নামসমূহ", searchPlaceholder: "নাম বা অর্থ দিয়ে খুঁজুন...", meaning: "অর্থ", noResults: "আপনার অনুসন্ধানের সাথে কোনো নাম মেলেনি।", quranRef: "কুরআন রেফারেন্স" },
  ur: { title: "اللہ کے ۹۹ نام", subtitle: "أسماء الله الحسنى — خوبصورت ترین نام", searchPlaceholder: "نام یا معنی سے تلاش کریں...", meaning: "معنی", noResults: "آپ کی تلاش سے کوئی نام نہیں ملا۔", quranRef: "قرآنی حوالہ" },
  ar: { title: "أسماء الله الحسنى", subtitle: "الأسماء الحسنى — تسعة وتسعون اسمًا", searchPlaceholder: "ابحث بالاسم أو المعنى...", meaning: "المعنى", noResults: "لم يتم العثور على أسماء مطابقة لبحثك.", quranRef: "المرجع القرآني" },
  tr: { title: "Allah'ın 99 İsmi", subtitle: "أسماء الله الحسنى — En Güzel İsimler", searchPlaceholder: "İsim veya anlam ile arayın...", meaning: "Anlam", noResults: "Aramanızla eşleşen isim bulunamadı.", quranRef: "Kur'an Referansı" },
  ms: { title: "99 Nama Allah", subtitle: "أسماء الله الحسنى — Nama-Nama Terindah", searchPlaceholder: "Cari mengikut nama atau makna...", meaning: "Makna", noResults: "Tiada nama ditemui sepadan dengan carian anda.", quranRef: "Rujukan Al-Quran" },
  id: { title: "99 Nama Allah", subtitle: "أسماء الله الحسنى — Nama-Nama Terindah", searchPlaceholder: "Cari berdasarkan nama atau makna...", meaning: "Makna", noResults: "Tidak ada nama yang cocok dengan pencarian Anda.", quranRef: "Referensi Al-Quran" },
};

export default function NinetyNineNamesPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode) as TransLang;
  const isRTL = lang === "ar" || lang === "ur";
  const t = PAGE_TEXTS[lang];

  const [search, setSearch] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const { speak, speaking, loading } = useArabicSpeech({ lang: "ar" });

  const handleSpeak = useCallback((id: number, arabic: string) => {
    if (activeId === id && speaking) {
      speak(arabic); // toggles off
      setActiveId(null);
    } else {
      setActiveId(id);
      speak(arabic);
    }
  }, [speak, speaking, activeId]);

  // Clear activeId when audio finishes
  useEffect(() => {
    if (!speaking && !loading && activeId !== null) {
      setActiveId(null);
    }
  }, [speaking, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle hash-based scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#name-")) {
      const id = parseInt(hash.replace("#name-", ""), 10);
      if (!isNaN(id)) {
        setHighlightId(id);
        setTimeout(() => {
          document.getElementById(`name-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, []);

  const filtered = search.trim()
    ? ASMA_UL_HUSNA.filter((n) => {
        const q = search.toLowerCase();
        return (
          n.transliteration.toLowerCase().includes(q) ||
          n.meaning[lang].toLowerCase().includes(q) ||
          n.meaning.en.toLowerCase().includes(q) ||
          n.arabic.includes(search)
        );
      })
    : ASMA_UL_HUSNA;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20" dir={isRTL ? "rtl" : undefined}>
      <BismillahBanner countryCode={countryCode} />
      <Header countryCode={countryCode} />
      <main className="flex-1">
        {/* Hero */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-5xl px-4 pt-6 pb-4 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 mb-3">
            <Star className="h-3 w-3 text-emerald-600" />
            <span className="font-arabic text-emerald-700 text-xs">أسماء الله الحسنى</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{t.title}</h1>
          <p className="text-sm text-gray-500 font-arabic">{t.subtitle}</p>
        </motion.div>

        {/* Search */}
        <div className="mx-auto max-w-5xl px-4 mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>
        </div>

        {/* Names Grid */}
        <div className="mx-auto max-w-5xl px-4 pb-8">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">{t.noResults}</p>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {filtered.map((name) => {
                const isActive = activeId === name.id;
                const isLoading = isActive && loading;
                const isSpeaking = isActive && speaking;
                return (
                <motion.div
                  key={name.id}
                  id={`name-${name.id}`}
                  variants={staggerItem}
                  onClick={() => handleSpeak(name.id, name.arabic)}
                  className={`group rounded-xl border bg-white p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-emerald-200 ${
                    highlightId === name.id
                      ? "border-emerald-400 ring-2 ring-emerald-100 shadow-md"
                      : isActive
                      ? "border-emerald-300 ring-2 ring-emerald-100 shadow-sm"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Number badge */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                      isActive ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {name.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Arabic name + speak button */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-arabic text-2xl transition-colors leading-tight ${isActive ? "text-emerald-700" : "text-gray-800 group-hover:text-emerald-700"}`}
                          dir="rtl"
                        >
                          {name.arabic}
                        </span>
                        <span className="shrink-0 p-1 rounded-full">
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 text-emerald-500 animate-spin" />
                          ) : (
                            <Volume2 className={`h-3.5 w-3.5 transition-all ${isSpeaking ? "text-emerald-600 opacity-100" : "text-emerald-500 opacity-60 group-hover:opacity-100"}`} />
                          )}
                        </span>
                      </div>

                      {/* Transliteration */}
                      <div className="text-sm font-semibold text-amber-700 mt-0.5">
                        {name.transliteration}
                      </div>

                      {/* Meaning */}
                      <div className="text-xs font-medium text-gray-600 mt-1">
                        {name.meaning[lang]}
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                        {name.shortDescription[lang]}
                      </p>

                      {/* Quran reference */}
                      {name.quranReference && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
                          <BookOpen className="h-2.5 w-2.5" />
                          <span>{t.quranRef}: {name.quranReference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </motion.div>
          )}
        </div>
      </main>
      <Footer countryCode={countryCode} />
    </div>
  );
}
