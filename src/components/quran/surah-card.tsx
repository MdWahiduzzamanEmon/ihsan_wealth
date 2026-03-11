"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import type { Chapter, QURAN_TEXTS } from "@/lib/quran-config";

interface SurahCardProps {
  chapter: Chapter;
  t: (typeof QURAN_TEXTS)[keyof typeof QURAN_TEXTS];
}

export function SurahCard({ chapter, t }: SurahCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Link href={`/quran/${chapter.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5">
          {/* Subtle pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            {/* Surah number circle */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-sm">
              {chapter.id}
            </div>

            {/* Names */}
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
                <span className="text-[11px] text-gray-400">
                  {chapter.translated_name?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-50">
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
