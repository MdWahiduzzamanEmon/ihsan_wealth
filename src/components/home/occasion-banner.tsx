"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { getActiveOccasions, THEMES } from "@/lib/occasions";
import type { TransLang } from "@/lib/islamic-content";
import type { RecommendedSurah } from "@/lib/occasions";

interface OccasionBannerProps {
  lang: TransLang;
  countryCode: string;
}

const SURAH_LABEL: Record<TransLang, string> = {
  en: "Recommended Surahs",
  bn: "পঠনীয় সূরাসমূহ",
  ur: "تلاوت کے لیے سورتیں",
  ar: "السور المستحبة",
  tr: "Önerilen Sureler",
  ms: "Surah yang Disyorkan",
  id: "Surah yang Dianjurkan",
};

function SurahChip({
  surah,
  lang,
  theme,
}: {
  surah: RecommendedSurah;
  lang: TransLang;
  theme: keyof typeof THEMES;
}) {
  const t = THEMES[theme];
  return (
    <Link
      href={`/quran/${surah.id}`}
      className={`group/s shrink-0 flex items-center gap-2 rounded-lg border ${t.border} bg-white/60 backdrop-blur-sm pl-2 pr-2.5 py-1.5 hover:bg-white/90 hover:shadow-sm transition-all`}
    >
      <span className={`font-arabic text-sm ${t.heading} opacity-40 leading-none`}>
        {surah.nameAr}
      </span>
      <div className="min-w-0">
        <span className={`text-[11px] font-semibold ${t.heading} block leading-tight`}>
          {surah.nameLocal[lang]}
        </span>
        <span className={`text-[9px] ${t.ref} block leading-tight line-clamp-1`}>
          {surah.reason[lang]}
        </span>
      </div>
      <ChevronRight className={`h-3 w-3 ${t.heading} opacity-30 shrink-0 group-hover/s:opacity-60 transition-opacity`} />
    </Link>
  );
}

function ScrollableSurahStrip({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: keyof typeof THEMES;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const t = THEMES[theme];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [checkScroll]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm border ${t.border} shadow-sm hover:bg-white/90 transition-all`}
          aria-label="Scroll left"
        >
          <ChevronLeft className={`h-3.5 w-3.5 ${t.heading} opacity-60`} />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm border ${t.border} shadow-sm hover:bg-white/90 transition-all`}
          aria-label="Scroll right"
        >
          <ChevronRight className={`h-3.5 w-3.5 ${t.heading} opacity-60`} />
        </button>
      )}
    </div>
  );
}

export function OccasionBanner({ lang, countryCode }: OccasionBannerProps) {
  const occasions = useMemo(
    () => getActiveOccasions(countryCode),
    [countryCode],
  );

  if (occasions.length === 0) return null;

  const isRTL = lang === "ar" || lang === "ur";

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-5xl px-4 mt-3"
      dir={isRTL ? "rtl" : undefined}
    >
      <div className="space-y-2.5">
        {/* Occasion cards grid */}
        <div
          className={`grid gap-2.5 ${occasions.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
        >
          {occasions.map((occasion) => {
            const t = THEMES[occasion.theme];
            return (
              <div
                key={occasion.id}
                className={`relative overflow-hidden rounded-xl border ${t.border} ${t.bg} p-4`}
              >
                {/* Decorative Islamic geometric pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id={`occ-pat-${occasion.id}`}
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M20 0L40 20L20 40L0 20Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#occ-pat-${occasion.id})`}
                    />
                  </svg>
                </div>

                <div className="relative">
                  {/* Arabic text */}
                  <p
                    className={`font-arabic text-base ${t.arabicText} leading-relaxed mb-1`}
                    dir="rtl"
                  >
                    {occasion.arabic}
                  </p>

                  {/* Greeting */}
                  <h3 className={`text-base font-bold ${t.heading} mb-1.5`}>
                    {occasion.greeting[lang]}
                  </h3>

                  {/* Separator dot line */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`h-1 w-1 rounded-full ${t.dot} opacity-40`} />
                    <div className={`h-px flex-1 ${t.dot} opacity-15`} />
                    <div className={`h-1 w-1 rounded-full ${t.dot} opacity-40`} />
                  </div>

                  {/* Reference */}
                  <p className={`text-xs ${t.ref} leading-relaxed`}>
                    &ldquo;{occasion.reference[lang]}&rdquo;
                  </p>
                  <p className={`text-[10px] ${t.source} mt-1 font-medium`}>
                    — {occasion.source}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Surahs section — separate full-width rows per occasion */}
        {occasions.map((occasion) => {
          if (!occasion.recommendedSurahs?.length) return null;
          const t = THEMES[occasion.theme];
          return (
            <div
              key={`surahs-${occasion.id}`}
              className={`rounded-xl border ${t.border} ${t.bg} px-3.5 py-3`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className={`h-3.5 w-3.5 ${t.heading} opacity-50`} />
                <span className={`text-[11px] font-semibold ${t.heading} opacity-60`}>
                  {SURAH_LABEL[lang]}
                  <span className="opacity-50"> · {occasion.greeting[lang]}</span>
                </span>
              </div>
              <ScrollableSurahStrip theme={occasion.theme}>
                {occasion.recommendedSurahs.map((surah) => (
                  <SurahChip
                    key={surah.id}
                    surah={surah}
                    lang={lang}
                    theme={occasion.theme}
                  />
                ))}
              </ScrollableSurahStrip>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
