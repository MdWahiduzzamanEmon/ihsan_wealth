"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Plus, Minus } from "lucide-react";
import { staggerItem, staggerContainer } from "@/lib/animations";
import { FARD_PRAYERS, type QazaEntry, type FardPrayer } from "@/hooks/use-salat-tracker";
import { getPrayerDisplayName, type SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface QazaLogProps {
  qazaLog: QazaEntry[];
  totalQazaRemaining: number;
  t: SalatTrackerTexts;
  onLogQaza: (prayerName: FardPrayer, count: number) => void;
}

export function QazaLog({ qazaLog, totalQazaRemaining, t, onLogQaza }: QazaLogProps) {
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
      {/* Overview */}
      <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h3 className="font-bold text-amber-800">{t.qazaOverview}</h3>
        </div>
        <p className="text-2xl font-bold text-amber-700">{totalQazaRemaining}</p>
        <p className="text-xs text-amber-600">{t.totalOwed}</p>
      </div>

      {/* Per-prayer breakdown */}
      <motion.div
        className="space-y-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {FARD_PRAYERS.map((prayer) => {
          const entry = qazaLog.find((e) => e.prayer_name === prayer);
          const remaining = entry?.count || 0;
          const toLog = qazaCounts[prayer] || 0;

          return (
            <motion.div
              key={prayer}
              variants={staggerItem}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">
                    {getPrayerDisplayName(prayer, t)}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {remaining} {t.qazaRemaining}
                  </span>
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
