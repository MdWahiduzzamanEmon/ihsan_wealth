"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ZAKAT_HADITH,
  ZAKAT_DUAS,
  UI_TEXTS,
  getLangFromCountry,
  getTranslation,
  type IslamicQuote,
  type TransLang,
} from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { BookOpen, Heart, ScrollText } from "lucide-react";

type TabType = "quran" | "hadith" | "dua";

const TAB_LABELS: Record<TransLang, Record<TabType, string>> = {
  en: { quran: "Quran", hadith: "Hadith", dua: "Duas" },
  bn: { quran: "কুরআন", hadith: "হাদিস", dua: "দু'আ" },
  ur: { quran: "قرآن", hadith: "حدیث", dua: "دعائیں" },
  ar: { quran: "القرآن", hadith: "الحديث", dua: "الدعاء" },
  tr: { quran: "Kur'an", hadith: "Hadis", dua: "Dualar" },
  ms: { quran: "Al-Quran", hadith: "Hadis", dua: "Doa" },
  id: { quran: "Al-Quran", hadith: "Hadis", dua: "Doa" },
};

const TAB_CONFIG: { key: TabType; icon: typeof BookOpen; arabicLabel: string }[] = [
  { key: "quran", icon: BookOpen, arabicLabel: "القرآن" },
  { key: "hadith", icon: ScrollText, arabicLabel: "الحديث" },
  { key: "dua", icon: Heart, arabicLabel: "الدعاء" },
];

function QuoteCard({ quote, lang }: { quote: IslamicQuote; lang: TransLang }) {
  const translation = getTranslation(quote, lang);
  const isRtl = lang === "ar" || lang === "ur";

  const accentColor =
    quote.type === "quran"
      ? "border-emerald-200 from-emerald-50/60 to-white"
      : quote.type === "hadith"
      ? "border-amber-200 from-amber-50/60 to-white"
      : "border-sky-200 from-sky-50/60 to-white";

  const badgeStyle =
    quote.type === "quran"
      ? "bg-emerald-100 text-emerald-700"
      : quote.type === "hadith"
      ? "bg-amber-100 text-amber-700"
      : "bg-sky-100 text-sky-700";

  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-xl border bg-gradient-to-br ${accentColor} p-4 sm:p-5 shadow-sm`}
    >
      {/* Arabic text */}
      <p
        className="font-arabic text-base sm:text-lg text-amber-800/80 leading-loose text-center mb-3"
        dir="rtl"
      >
        {quote.arabic}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="font-arabic text-gray-300 text-xs">✦</div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Translation */}
      <p
        className={`text-xs sm:text-sm leading-relaxed text-center ${
          isRtl ? "font-arabic text-sm text-gray-700" : "text-gray-600 italic"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        &ldquo;{translation}&rdquo;
      </p>

      {/* Source */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeStyle}`}>
          {quote.type === "quran" ? "Al-Quran" : quote.type === "hadith" ? "Hadith" : "Dua"}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">— {quote.source}</span>
      </div>
    </motion.div>
  );
}

interface HadithDuasSectionProps {
  countryCode?: string;
}

export function HadithDuasSection({ countryCode = "BD" }: HadithDuasSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("quran");
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const allQuotes = [...ZAKAT_HADITH, ...ZAKAT_DUAS];
  const filtered = allQuotes.filter((q) => q.type === activeTab);

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="mx-auto max-w-5xl px-4 py-6"
      dir={isRtl ? "rtl" : undefined}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <p className="font-arabic text-amber-600/60 text-base mb-0.5" dir="rtl">
          العلم والحكمة
        </p>
        <h2 className="text-lg font-bold text-gray-900">{texts.knowledgeTitle}</h2>
        <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
          {texts.knowledgeSubtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-1.5 mb-5">
        {TAB_CONFIG.map(({ key, icon: Icon, arabicLabel }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
              activeTab === key
                ? "bg-emerald-700 text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {TAB_LABELS[lang][key]}
            <span className="font-arabic text-[10px] opacity-60 hidden sm:inline">
              {arabicLabel}
            </span>
          </button>
        ))}
      </div>

      {/* Quotes Grid */}
      <motion.div
        key={activeTab}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {filtered.map((quote, i) => (
          <QuoteCard key={i} quote={quote} lang={lang} />
        ))}
      </motion.div>
    </motion.section>
  );
}
