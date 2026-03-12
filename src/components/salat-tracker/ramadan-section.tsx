"use client";

import { motion } from "framer-motion";
import { Check, Moon, BookOpen, Heart, Sparkles } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

export interface RamadanDayData {
  fasted: boolean;
  suhoor: boolean;
  iftar: boolean;
  taraweeh: boolean;
  taraweeh_rakats: number | null;
  quran_pages: number;
  sadaqah_given: boolean;
  dua_before_iftar: boolean;
  itikaf: boolean;
  laylatul_qadr_worship: boolean;
}

interface RamadanSectionProps {
  dayNumber: number;
  data: RamadanDayData;
  isLastTenNights: boolean;
  isLaylatalQadr: boolean;
  t: SalatTrackerTexts;
  onToggle: (field: keyof RamadanDayData, value: boolean | number) => void;
  onUpdateQuranPages: (pages: number) => void;
}

export function RamadanSection({
  dayNumber,
  data,
  isLastTenNights,
  isLaylatalQadr,
  t,
  onToggle,
  onUpdateQuranPages,
}: RamadanSectionProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50/30 p-4 shadow-sm"
    >
      {/* Ramadan header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 shadow-sm">
          <Moon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-800 text-sm">{t.ramadanMubarak}</h3>
          <p className="text-[10px] text-emerald-600">
            {t.ramadanDay} {dayNumber} {t.of} 30
          </p>
        </div>
        {isLaylatalQadr && (
          <div className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
            <Sparkles className="h-3 w-3" />
            {t.laylatalQadr}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-emerald-600 mb-1">
          <span>{t.ramadanDay} {dayNumber}</span>
          <span>{30 - dayNumber} {t.daysRemaining}</span>
        </div>
        <div className="h-2 rounded-full bg-emerald-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
            style={{ width: `${(dayNumber / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Toggle items */}
      <div className="grid grid-cols-2 gap-2">
        <ToggleItem
          label={t.fastedToday}
          active={data.fasted}
          onToggle={() => onToggle("fasted", !data.fasted)}
        />
        <ToggleItem
          label={t.suhoor}
          active={data.suhoor}
          onToggle={() => onToggle("suhoor", !data.suhoor)}
        />
        <ToggleItem
          label={t.iftar}
          active={data.iftar}
          onToggle={() => onToggle("iftar", !data.iftar)}
        />
        <ToggleItem
          label={t.taraweeh}
          active={data.taraweeh}
          onToggle={() => onToggle("taraweeh", !data.taraweeh)}
        />
        <ToggleItem
          label={t.sadaqah}
          icon={<Heart className="h-3 w-3" />}
          active={data.sadaqah_given}
          onToggle={() => onToggle("sadaqah_given", !data.sadaqah_given)}
        />
        <ToggleItem
          label={t.duaBeforeIftar}
          active={data.dua_before_iftar}
          onToggle={() => onToggle("dua_before_iftar", !data.dua_before_iftar)}
        />
      </div>

      {/* Quran pages */}
      <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2">
        <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
        <span className="text-sm text-emerald-700">{t.quranPages}</span>
        <input
          type="number"
          min={0}
          max={50}
          value={data.quran_pages}
          onChange={(e) => onUpdateQuranPages(Math.max(0, parseInt(e.target.value) || 0))}
          className="ml-auto w-16 rounded-md border border-emerald-200 bg-white px-2 py-1 text-center text-sm text-emerald-800 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      {/* Khatam progress */}
      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
        <span>{t.khatamProgress}:</span>
        <span className="font-medium">{data.quran_pages} / 604</span>
      </div>

      {/* Last 10 nights */}
      {isLastTenNights && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
          <h4 className="text-xs font-bold text-amber-700 mb-2">{t.lastTenNights}</h4>
          {isLaylatalQadr && (
            <p className="text-[10px] text-amber-600 mb-2">{t.seekLaylatalQadr}</p>
          )}
          <div className="flex gap-2">
            <ToggleItem
              label={t.itikaf}
              active={data.itikaf}
              onToggle={() => onToggle("itikaf", !data.itikaf)}
            />
            {isLaylatalQadr && (
              <ToggleItem
                label={t.laylatalQadr}
                icon={<Sparkles className="h-3 w-3" />}
                active={data.laylatul_qadr_worship}
                onToggle={() => onToggle("laylatul_qadr_worship", !data.laylatul_qadr_worship)}
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ToggleItem({
  label,
  icon,
  active,
  onToggle,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
        active
          ? "bg-emerald-500 text-white shadow-sm"
          : "bg-white/60 text-gray-600 hover:bg-white"
      }`}
    >
      {icon || (active ? <Check className="h-3 w-3" /> : <span className="h-3 w-3" />)}
      <span className="truncate">{label}</span>
    </button>
  );
}
