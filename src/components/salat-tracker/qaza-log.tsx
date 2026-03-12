"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Plus, Minus, CheckCircle2 } from "lucide-react";
import { staggerItem, staggerContainer } from "@/lib/animations";
import { FARD_PRAYERS, type QazaEntry, type FardPrayer } from "@/hooks/use-salat-tracker";
import { getPrayerDisplayName, type SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface QazaLogProps {
  qazaLog: QazaEntry[];
  qazaMadeUp: QazaEntry[];
  totalQazaRemaining: number;
  totalQazaMadeUp: number;
  t: SalatTrackerTexts;
  onLogQaza: (prayerName: FardPrayer, count: number) => void;
}

export function QazaLog({ qazaLog, qazaMadeUp, totalQazaRemaining, totalQazaMadeUp, t, onLogQaza }: QazaLogProps) {
  const [qazaCounts, setQazaCounts] = useState<Record<string, number>>({});

  const handleIncrement = (prayer: FardPrayer) => {
    setQazaCounts((prev) => ({ ...prev, [prayer]: (prev[prayer] || 0) + 1 }));
  };

  const handleDecrement = (prayer: FardPrayer) => {
    setQazaCounts((prev) => ({
      ...prev,
      [prayer]: Math.max(0, (prev[prayer] || 0) - 1),
    }));
  };

  const handleSubmit = (prayer: FardPrayer) => {
    const count = qazaCounts[prayer] || 0;
    if (count > 0) {
      onLogQaza(prayer, count);
      setQazaCounts((prev) => ({ ...prev, [prayer]: 0 }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/30 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-amber-800 text-sm">{t.qazaOverview}</h3>
          </div>
          <p className="text-2xl font-bold text-amber-700">{totalQazaRemaining}</p>
          <p className="text-[10px] text-amber-600/70">{t.totalOwed}</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50/30 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800 text-sm">{t.qazaMadeUp}</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{totalQazaMadeUp}</p>
          <p className="text-[10px] text-emerald-600/70">{t.qazaCompleted}</p>
        </div>
      </div>

      {/* Per-prayer breakdown */}
      <motion.div
        className="space-y-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {FARD_PRAYERS.map((prayer) => {
          const remainingEntry = qazaLog.find((e) => e.prayer_name === prayer);
          const madeUpEntry = qazaMadeUp.find((e) => e.prayer_name === prayer);
          const remaining = remainingEntry?.count || 0;
          const madeUp = madeUpEntry?.count || 0;
          const toLog = qazaCounts[prayer] || 0;

          return (
            <motion.div
              key={prayer}
              variants={staggerItem}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="font-medium text-gray-900 text-sm">
                    {getPrayerDisplayName(prayer, t)}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    {remaining > 0 && (
                      <span className="text-[10px] text-amber-600 font-medium">
                        {remaining} {t.qazaRemaining}
                      </span>
                    )}
                    {madeUp > 0 && (
                      <span className="text-[10px] text-emerald-600 font-medium">
                        {madeUp} {t.qazaCompleted}
                      </span>
                    )}
                    {remaining === 0 && madeUp === 0 && (
                      <span className="text-[10px] text-gray-400">—</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(prayer)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{toLog}</span>
                  <button
                    onClick={() => handleIncrement(prayer)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  {toLog > 0 && (
                    <button
                      onClick={() => handleSubmit(prayer)}
                      className="ml-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 active:scale-95"
                    >
                      {t.logQaza}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
