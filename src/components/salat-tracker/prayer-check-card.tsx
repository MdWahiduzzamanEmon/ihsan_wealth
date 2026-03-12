"use client";

import { motion } from "framer-motion";
import { Check, X, Clock, Users, RotateCcw } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { PrayerName, PrayerStatus, SalatRecord } from "@/hooks/use-salat-tracker";
import { getPrayerArabicName, type SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface PrayerCheckCardProps {
  prayerName: PrayerName;
  prayerTime?: string;
  record?: SalatRecord;
  t: SalatTrackerTexts;
  onToggleStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  onToggleJamaah: (prayerName: PrayerName, inJamaah: boolean) => void;
  onRemove: (prayerName: PrayerName) => void;
  isHighlighted?: boolean;
  compact?: boolean;
}

const DISPLAY_NAME_KEYS: Record<string, keyof SalatTrackerTexts> = {
  fajr: "fajr",
  dhuhr: "dhuhr",
  asr: "asr",
  maghrib: "maghrib",
  isha: "isha",
};

export function PrayerCheckCard({
  prayerName,
  prayerTime,
  record,
  t,
  onToggleStatus,
  onToggleJamaah,
  onRemove,
  isHighlighted,
  compact,
}: PrayerCheckCardProps) {
  const status = record?.status;
  const inJamaah = record?.in_jamaah ?? false;
  const arabicName = getPrayerArabicName(prayerName, t);
  const displayKey = DISPLAY_NAME_KEYS[prayerName];
  const displayName = displayKey ? (t[displayKey] as string) : prayerName;

  return (
    <motion.div
      variants={staggerItem}
      className={`relative rounded-xl border shadow-sm transition-all ${
        status === "prayed"
          ? "bg-emerald-50 border-emerald-200"
          : status === "late"
          ? "bg-amber-50 border-amber-200"
          : status === "missed"
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200"
      } ${isHighlighted ? "ring-2 ring-emerald-400 ring-offset-1" : ""} ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}
    >
      <div className="flex items-center gap-3">
        {/* Prayer name + time */}
        <div className={`min-w-0 ${compact ? "w-20" : "w-24 sm:w-28"} shrink-0`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold text-gray-900 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
              {displayName}
            </span>
            {!compact && arabicName && (
              <span className="font-arabic text-xs text-gray-400 hidden sm:inline" dir="rtl">
                {arabicName}
              </span>
            )}
          </div>
          {prayerTime && (
            <p className="text-[10px] text-gray-400 mt-0.5">{prayerTime}</p>
          )}
        </div>

        {/* 3 status buttons */}
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => onToggleStatus(prayerName, "prayed")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
              status === "prayed"
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
            }`}
          >
            <Check className="h-3 w-3" />
            <span className="hidden sm:inline">{t.prayed}</span>
          </button>

          <button
            onClick={() => onToggleStatus(prayerName, "late")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
              status === "late"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span className="hidden sm:inline">{t.late}</span>
          </button>

          <button
            onClick={() => onToggleStatus(prayerName, "missed")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
              status === "missed"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600"
            }`}
          >
            <X className="h-3 w-3" />
            <span className="hidden sm:inline">{t.missed}</span>
          </button>
        </div>

        {/* Jamaah + Clear */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(status === "prayed" || status === "late") && (
            <button
              onClick={() => onToggleJamaah(prayerName, !inJamaah)}
              title={t.inJamaah}
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                inJamaah
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">{t.jamaah}</span>
            </button>
          )}

          {status && (
            <button
              onClick={() => onRemove(prayerName)}
              title="Clear"
              className="flex items-center justify-center h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
