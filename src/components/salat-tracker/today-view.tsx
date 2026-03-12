"use client";

import { motion } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight, CalendarDays, Settings2 } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { PrayerCheckCard } from "./prayer-check-card";
import { JummahCard } from "./jummah-card";
import { EidCard } from "./eid-card";
import { SunnahSection } from "./sunnah-section";
import { RamadanSection, type RamadanDayData } from "./ramadan-section";
import { WeeklyGoals } from "./weekly-goals";
import { ImprovementInsight } from "./improvement-insight";
import {
  FARD_PRAYERS,
  type SalatRecord,
  type SalatStats,
  type PrayerName,
  type PrayerStatus,
  type FardPrayer,
} from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface TodayViewProps {
  selectedDate: string;
  selectedDateRecords: SalatRecord[];
  allRecords: SalatRecord[];
  stats: SalatStats;
  dateContext: {
    hijri: { year: number; month: number; day: number };
    isFriday: boolean;
    isRamadan: boolean;
    ramadanDayNumber: number | null;
    isLaylatalQadr: boolean;
    isLastTenNights: boolean;
    eidDay: "eid_al_fitr" | "eid_al_adha" | null;
  };
  t: SalatTrackerTexts;
  isToday: boolean;
  sunnahEnabled: boolean;
  prayerTimes?: Record<string, string>;

  // Ramadan data
  ramadanData?: RamadanDayData;
  ramadanStats?: {
    totalFasted: number;
    totalTaraweeh: number;
    quranPagesTotal: number;
    sadaqahDays: number;
    itikaafDays: number;
  };

  // Actions
  onToggleStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  onToggleJamaah: (prayerName: PrayerName, inJamaah: boolean) => void;
  onRemove: (prayerName: PrayerName) => void;
  onToggleSunnah: () => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  onRamadanToggle?: (field: keyof RamadanDayData, value: boolean | number) => void;
  onRamadanQuranPages?: (pages: number) => void;
}

export function TodayView({
  selectedDate,
  selectedDateRecords,
  allRecords,
  stats,
  dateContext,
  t,
  isToday,
  sunnahEnabled,
  prayerTimes,
  ramadanData,
  onToggleStatus,
  onToggleJamaah,
  onRemove,
  onToggleSunnah,
  onPreviousDay,
  onNextDay,
  onGoToToday,
  onRamadanToggle,
  onRamadanQuranPages,
}: TodayViewProps) {
  const getRecord = (name: string) =>
    selectedDateRecords.find((r) => r.prayer_name === name);

  const handleToggleJamaah = (prayerName: PrayerName, inJamaah: boolean) => {
    onToggleJamaah(prayerName, inJamaah);
  };

  // Split fard prayers into columns for grid layout
  const fardPrayers = FARD_PRAYERS.filter(
    (prayer) => !(prayer === "dhuhr" && dateContext.isFriday)
  );

  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Top bar: Date nav + Progress + Streak — all in one row on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Date navigation */}
        <div className="flex items-center justify-between rounded-xl bg-white border border-emerald-100 px-4 py-3 shadow-sm">
          <button
            onClick={onPreviousDay}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {isToday
                ? t.today
                : new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
            </p>
            <p className="text-[10px] text-gray-400 font-arabic" dir="rtl">
              {dateContext.hijri.day}/{dateContext.hijri.month}/{dateContext.hijri.year}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {!isToday && (
              <button
                onClick={onGoToToday}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
                title={t.goToToday}
              >
                <CalendarDays className="h-4 w-4 text-emerald-600" />
              </button>
            )}
            <button
              onClick={onNextDay}
              disabled={isToday}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors active:scale-95 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress ring */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-4 rounded-xl bg-white border border-emerald-100 px-5 py-3 shadow-sm"
        >
          <div className="relative h-14 w-14 shrink-0">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="5" />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={stats.todayFardCompleted >= 5 ? "#10b981" : "#f59e0b"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(stats.todayFardCompleted / 5) * 175.93} 175.93`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-gray-900">
                {stats.todayFardCompleted}
                <span className="text-xs text-gray-400">/5</span>
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{t.todayProgress}</p>
            <p className="text-xs text-gray-400">{t.fardCompleted}</p>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={staggerItem}
          className="flex items-center justify-between rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 px-5 py-3 shadow-sm"
        >
          <div>
            <p className="text-xs text-orange-500 font-medium">{t.dayStreak}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {t.longestStreak}: {stats.longestStreak}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-3xl font-bold text-orange-600">{stats.currentStreak}</span>
          </div>
        </motion.div>
      </div>

      {/* Eid card — full width banner */}
      {dateContext.eidDay && (
        <EidCard
          eidType={dateContext.eidDay}
          record={getRecord(dateContext.eidDay)}
          t={t}
          onToggleStatus={onToggleStatus}
          onToggleJamaah={handleToggleJamaah}
          onRemove={onRemove}
        />
      )}

      {/* Main content: 2-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Fard prayers */}
        <div className="space-y-3">
          {/* Jummah card (replaces Dhuhr on Friday) */}
          {dateContext.isFriday && (
            <JummahCard
              record={getRecord("jummah")}
              t={t}
              onToggleStatus={onToggleStatus}
              onToggleJamaah={handleToggleJamaah}
              onRemove={onRemove}
            />
          )}

          {/* Fard prayer cards */}
          {fardPrayers.map((prayer) => (
            <PrayerCheckCard
              key={prayer}
              prayerName={prayer}
              prayerTime={prayerTimes?.[prayer]}
              record={getRecord(prayer)}
              t={t}
              onToggleStatus={onToggleStatus}
              onToggleJamaah={handleToggleJamaah}
              onRemove={onRemove}
            />
          ))}
        </div>

        {/* RIGHT: Stats, Goals, Insights, Sunnah toggle */}
        <div className="space-y-3">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-emerald-100 bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-emerald-700">{stats.completionRate}%</p>
              <p className="text-[10px] text-gray-400">{t.completionRate}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-emerald-700">{stats.onTimeRate}%</p>
              <p className="text-[10px] text-gray-400">{t.onTimeRate}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-emerald-700">{stats.jamaahRate}%</p>
              <p className="text-[10px] text-gray-400">{t.jamaahRate}</p>
            </div>
          </div>

          {/* Weekly Goals */}
          <WeeklyGoals stats={stats} t={t} />

          {/* Improvement Insights */}
          <ImprovementInsight stats={stats} records={allRecords} t={t} />

          {/* Sunnah toggle */}
          <button
            onClick={onToggleSunnah}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50/50 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            {sunnahEnabled ? t.hideSunnah : t.showSunnah}
          </button>
        </div>
      </div>

      {/* Ramadan section — full width below */}
      {dateContext.isRamadan && dateContext.ramadanDayNumber && ramadanData && onRamadanToggle && onRamadanQuranPages && (
        <RamadanSection
          dayNumber={dateContext.ramadanDayNumber}
          data={ramadanData}
          isLastTenNights={dateContext.isLastTenNights}
          isLaylatalQadr={dateContext.isLaylatalQadr}
          t={t}
          onToggle={onRamadanToggle}
          onUpdateQuranPages={onRamadanQuranPages}
        />
      )}

      {/* Sunnah/Nafl section — full width */}
      {sunnahEnabled && (
        <SunnahSection
          records={selectedDateRecords}
          t={t}
          onToggleStatus={onToggleStatus}
          onRemove={onRemove}
          isRamadan={dateContext.isRamadan}
        />
      )}
    </motion.div>
  );
}
