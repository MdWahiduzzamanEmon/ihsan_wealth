"use client";

import { motion } from "framer-motion";
import { Target, Check } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { SalatStats } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface WeeklyGoalsProps {
  stats: SalatStats;
  t: SalatTrackerTexts;
}

interface GoalDef {
  id: string;
  labelKey: keyof SalatTrackerTexts;
  getCurrent: (stats: SalatStats) => number;
  target: number;
  unit: string;
}

const GOALS: GoalDef[] = [
  {
    id: "all_fard",
    labelKey: "allFardGoal",
    getCurrent: (s) => Math.min(7, Math.round((s.completionRate / 100) * 7)),
    target: 7,
    unit: "days",
  },
  {
    id: "on_time",
    labelKey: "allOnTimeGoal",
    getCurrent: (s) => Math.min(35, Math.round((s.onTimeRate / 100) * 35)),
    target: 35,
    unit: "prayers",
  },
  {
    id: "jamaah",
    labelKey: "jamaahGoal",
    getCurrent: (s) => Math.min(7, Math.round((s.jamaahRate / 100) * 7)),
    target: 3,
    unit: "days",
  },
  {
    id: "sunnah",
    labelKey: "sunnahGoal",
    getCurrent: (s) => s.totalSunnah,
    target: 10,
    unit: "prayers",
  },
];

export function WeeklyGoals({ stats, t }: WeeklyGoalsProps) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-emerald-600" />
        <h3 className="font-semibold text-emerald-800 text-sm">{t.weeklyGoals}</h3>
      </div>

      <div className="space-y-3">
        {GOALS.map((goal) => {
          const current = goal.getCurrent(stats);
          const progress = Math.min(100, (current / goal.target) * 100);
          const isCompleted = current >= goal.target;

          return (
            <motion.div key={goal.id} variants={staggerItem}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={isCompleted ? "text-emerald-700 font-medium" : "text-gray-600"}>
                  {isCompleted && <Check className="inline h-3 w-3 mr-1" />}
                  {t[goal.labelKey] as string}
                </span>
                <span className="text-gray-400">
                  {current}/{goal.target}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    isCompleted
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : "bg-gradient-to-r from-emerald-400 to-emerald-300"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
