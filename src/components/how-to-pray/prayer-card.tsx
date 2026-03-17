"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, BookOpen, Star, AlertCircle } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import type { PrayerInfo } from "@/lib/how-to-pray-data";
import { HOW_TO_PRAY_TEXTS } from "@/lib/how-to-pray-texts";
import { staggerItem } from "@/lib/animations";
import { PrayerStepCard } from "./prayer-step-card";

interface PrayerCardProps {
  prayer: PrayerInfo;
  lang: TransLang;
  isRtl: boolean;
}

const TYPE_CONFIG = {
  fard: { key: "fard" as const, color: "bg-emerald-100 text-emerald-700" },
  sunnah: { key: "sunnah" as const, color: "bg-amber-100 text-amber-700" },
  wajib: { key: "wajib" as const, color: "bg-blue-100 text-blue-700" },
  nafl: { key: "nafl" as const, color: "bg-purple-100 text-purple-700" },
  special: { key: "fard" as const, color: "bg-emerald-100 text-emerald-700" },
} as const;

export function PrayerCard({ prayer, lang, isRtl }: PrayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = TYPE_CONFIG[prayer.type];
  const typeLabel = HOW_TO_PRAY_TEXTS[config.key][lang];

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-emerald-200/60 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.color}`}>
              {typeLabel}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-emerald-900">{prayer.name[lang]}</h3>
              <span className="font-arabic text-sm text-emerald-600/70">{prayer.arabicName}</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-3 w-3" /> {prayer.rakatBreakdown[lang]}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" /> {prayer.time[lang]}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{prayer.description[lang]}</p>
          </div>

          <div className="shrink-0">
            {isExpanded ? <ChevronUp className="h-5 w-5 text-emerald-400" /> : <ChevronDown className="h-5 w-5 text-emerald-400" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-emerald-100"
        >
          <div className="px-5 py-5 sm:px-6 space-y-4">
            {prayer.steps.map((step) => (
              <PrayerStepCard key={step.stepNumber} step={step} lang={lang} isRtl={isRtl} />
            ))}
          </div>

          {prayer.specialNotes?.[lang] && (
            <div className="mx-5 mb-5 sm:mx-6 rounded-xl bg-amber-50 border border-amber-200/60 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">{HOW_TO_PRAY_TEXTS.notes[lang]}</h4>
                  <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">{prayer.specialNotes[lang]}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
