"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ZAKAT_HADITH,
  ZAKAT_DUAS,
  UI_TEXTS,
  getLangFromCountry,
  getLangLabel,
  getTranslation,
  type IslamicQuote,
  type TransLang,
} from "@/lib/islamic-content";
import { cn } from "@/lib/utils";
import { BookOpen, Heart, Star, Globe } from "lucide-react";

type TabType = "hadith" | "quran" | "dua";

function QuoteCard({ quote, lang }: { quote: IslamicQuote; lang: TransLang }) {
  const translation = getTranslation(quote, lang);

  const borderColor =
    quote.type === "quran"
      ? "border-l-emerald-500"
      : quote.type === "hadith"
      ? "border-l-amber-500"
      : "border-l-sky-500";

  const bgColor =
    quote.type === "quran"
      ? "bg-emerald-50/50"
      : quote.type === "hadith"
      ? "bg-amber-50/50"
      : "bg-sky-50/50";

  const badgeColor =
    quote.type === "quran"
      ? "bg-emerald-100 text-emerald-700"
      : quote.type === "hadith"
      ? "bg-amber-100 text-amber-700"
      : "bg-sky-100 text-sky-700";

  // RTL languages
  const isRtl = lang === "ar" || lang === "ur";

  return (
    <Card className={cn("border-l-4 overflow-hidden", borderColor, bgColor)}>
      <CardContent className="py-5 px-5">
        {/* Arabic text */}
        <p className="font-arabic text-xl md:text-2xl leading-[2.2] text-right text-gray-800 mb-4" dir="rtl">
          {quote.arabic}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          <Star className="h-3 w-3 text-amber-400" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        </div>

        {/* Translation */}
        <p
          className={cn(
            "text-sm leading-relaxed",
            isRtl ? "font-arabic text-base text-right text-gray-700" : "text-gray-600 italic"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          &ldquo;{translation}&rdquo;
        </p>

        {/* Language badge + Source */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", badgeColor)}>
              {quote.type === "quran" ? "Al-Quran" : quote.type === "hadith" ? "Hadith" : "Dua"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              <Globe className="h-2.5 w-2.5" />
              {getLangLabel(lang)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{quote.source}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface HadithDuasSectionProps {
  countryCode?: string;
}

export function HadithDuasSection({ countryCode = "US" }: HadithDuasSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("quran");
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];

  const tabs: { id: TabType; label: string; labelAr: string; icon: React.ElementType }[] = [
    { id: "quran", label: "Quran", labelAr: "القرآن", icon: BookOpen },
    { id: "hadith", label: "Hadith", labelAr: "الحديث", icon: Star },
    { id: "dua", label: "Duas", labelAr: "الدعاء", icon: Heart },
  ];

  const allQuotes = [...ZAKAT_HADITH, ...ZAKAT_DUAS];
  const filtered = allQuotes.filter((q) => q.type === activeTab);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {/* Section Header */}
      <div className="text-center mb-8">
        <p className="font-arabic text-2xl text-amber-600/80 mb-1">
          العلم والحكمة
        </p>
        <h2 className="text-2xl font-bold text-emerald-900">
          {texts.knowledgeTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          {texts.knowledgeSubtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className="font-arabic text-xs opacity-70">{tab.labelAr}</span>
            </button>
          );
        })}
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((quote, i) => (
          <QuoteCard key={i} quote={quote} lang={lang} />
        ))}
      </div>
    </section>
  );
}
