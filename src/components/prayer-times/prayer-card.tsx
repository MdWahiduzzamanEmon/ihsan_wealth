"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  CloudSun,
  Clock,
  Star,
  type LucideIcon,
} from "lucide-react";
import { staggerItem } from "@/lib/animations";
import { isFriday } from "@/lib/hijri-utils";
import type { PrayerName } from "@/hooks/use-prayer-times";

interface PrayerInfo {
  english: string;
  arabic: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

const PRAYER_INFO: Record<PrayerName, PrayerInfo> = {
  fajr: {
    english: "Fajr",
    arabic: "الفجر",
    icon: Sunrise,
    gradient: "from-indigo-500/10 to-purple-500/10",
    iconColor: "text-indigo-500",
  },
  sunrise: {
    english: "Sunrise",
    arabic: "الشروق",
    icon: Sunrise,
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-500",
  },
  dhuhr: {
    english: "Dhuhr",
    arabic: "الظهر",
    icon: Sun,
    gradient: "from-yellow-500/10 to-amber-500/10",
    iconColor: "text-yellow-600",
  },
  asr: {
    english: "Asr",
    arabic: "العصر",
    icon: CloudSun,
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
  maghrib: {
    english: "Maghrib",
    arabic: "المغرب",
    icon: Sunset,
    gradient: "from-rose-500/10 to-orange-500/10",
    iconColor: "text-rose-500",
  },
  isha: {
    english: "Isha",
    arabic: "العشاء",
    icon: Moon,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600",
  },
  tahajjud: {
    english: "Tahajjud",
    arabic: "التهجد",
    icon: Star,
    gradient: "from-violet-500/10 to-indigo-500/10",
    iconColor: "text-violet-600",
  },
};

interface PrayerCardProps {
  prayer: PrayerName;
  time: string;
  isCurrent: boolean;
  isNext: boolean;
  countdown?: string;
  currentPrayerLabel?: string;
}

export function PrayerCard({
  prayer,
  time,
  isCurrent,
  isNext,
  countdown,
  currentPrayerLabel,
}: PrayerCardProps) {
  const info = PRAYER_INFO[prayer];
  const Icon = info.icon;

  // On Friday, show "Jummah" instead of "Dhuhr"
  const displayEnglish = prayer === "dhuhr" && isFriday() ? "Jummah" : info.english;
  const displayArabic = prayer === "dhuhr" && isFriday() ? "الجمعة" : info.arabic;

  return (
    <motion.div
      variants={staggerItem}
      className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-300
        ${isCurrent
          ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100/60 shadow-lg shadow-emerald-200/40 ring-2 ring-emerald-400/30"
          : isNext
            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/40 shadow-md shadow-amber-200/30 ring-2 ring-amber-400/30"
            : `border-gray-200 bg-gradient-to-br ${info.gradient} hover:shadow-md`
        }
      `}
    >
      {/* Pulsing indicator for current prayer */}
      {isCurrent && (
        <motion.div
          className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Next prayer indicator */}
      {isNext && (
        <motion.div
          className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-amber-500"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
            ${isCurrent ? "bg-emerald-200/60" : isNext ? "bg-amber-200/50" : "bg-white/60"}
          `}
        >
          <Icon
            className={`h-5 w-5 ${isCurrent ? "text-emerald-700" : isNext ? "text-amber-700" : info.iconColor}`}
          />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold text-sm ${isCurrent ? "text-emerald-800" : isNext ? "text-amber-800" : "text-gray-800"}`}
            >
              {displayEnglish}
            </span>
            <span className="font-arabic text-xs text-gray-400">{displayArabic}</span>
          </div>

          {/* Status label */}
          {isCurrent && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600">
              {currentPrayerLabel || "Current Prayer"}
            </span>
          )}
          {isNext && countdown && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
              <Clock className="h-3 w-3" />
              <span>{countdown}</span>
            </div>
          )}
        </div>

        {/* Time */}
        <div
          className={`
            text-right font-mono text-base font-bold tracking-tight
            ${isCurrent ? "text-emerald-700" : isNext ? "text-amber-700" : "text-gray-700"}
          `}
        >
          {time}
        </div>
      </div>
    </motion.div>
  );
}
