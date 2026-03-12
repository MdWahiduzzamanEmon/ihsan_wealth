"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import type { Chapter, QURAN_TEXTS } from "@/lib/quran-config";
import { prefetchVerses } from "@/hooks/use-quran";
import type { TransLang } from "@/lib/islamic-content";

interface SurahCardProps {
  chapter: Chapter;
  t: (typeof QURAN_TEXTS)[keyof typeof QURAN_TEXTS];
  lang: TransLang;
}

export function SurahCard({ chapter, t, lang }: SurahCardProps) {
  const prefetched = useRef(false);

  const handleHover = useCallback(() => {
    if (!prefetched.current) {
      prefetched.current = true;
      prefetchVerses(chapter.id, lang);
    }
  }, [chapter.id, lang]);

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/quran/${chapter.id}`} onMouseEnter={handleHover} onTouchStart={handleHover}>
        <div className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-white px-4 py-3.5 transition-all hover:shadow-md hover:border-emerald-300">
          <div className="flex items-center gap-3.5">
            {/* Surah number */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-sm">
              {chapter.id}
            </div>

            {/* Names + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-emerald-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                  {chapter.name_simple}
                </h3>
                <span className="font-arabic text-lg text-amber-600/80 shrink-0" dir="rtl">
                  {chapter.name_arabic}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  chapter.revelation_place === "makkah"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}>
                  {chapter.revelation_place === "makkah" ? t.meccan : t.medinan}
                </span>
                <span className="text-[11px] text-gray-400">
                  {chapter.verses_count} {t.verses}
                </span>
                {chapter.translated_name?.name && (
                  <span className="text-[11px] text-gray-400 truncate">
                    · {chapter.translated_name.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
