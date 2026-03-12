"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Flame, Clock, Award } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import type { SalatStats, SalatRecord } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface ImprovementInsightProps {
  stats: SalatStats;
  records: SalatRecord[];
  t: SalatTrackerTexts;
}

interface Insight {
  type: "success" | "tip" | "streak" | "encouragement";
  icon: typeof TrendingUp;
  message: string;
  color: string;
}

export function ImprovementInsight({ stats, records, t }: ImprovementInsightProps) {
  const insights = generateInsights(stats, records, t);

  if (insights.length === 0) return null;

  // Show at most 2 insights
  const visibleInsights = insights.slice(0, 2);

  return (
    <div className="space-y-2">
      {visibleInsights.map((insight, i) => {
        const Icon = insight.icon;
        return (
          <motion.div
            key={i}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className={`rounded-xl border p-3 ${insight.color}`}
          >
            <div className="flex items-start gap-2">
              <Icon className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{insight.message}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function generateInsights(
  stats: SalatStats,
  records: SalatRecord[],
  t: SalatTrackerTexts
): Insight[] {
  const insights: Insight[] = [];

  // Perfect day
  if (stats.todayFardCompleted >= 5) {
    insights.push({
      type: "success",
      icon: Award,
      message: t.perfectDay,
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    });
  }

  // Streak motivation
  if (stats.currentStreak >= 3) {
    insights.push({
      type: "streak",
      icon: Flame,
      message: `${stats.currentStreak} ${t.dayStreak}! ${t.keepGoing}`,
      color: "border-orange-200 bg-orange-50 text-orange-700",
    });
  }

  // Most missed prayer analysis
  if (records.length > 0) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7Str = last7Days.toISOString().split("T")[0];
    const recentMissed = records.filter(
      (r) => r.date >= last7Str && r.status === "missed" && r.prayer_type === "fard"
    );

    if (recentMissed.length > 0) {
      // Count by prayer name
      const missedCounts: Record<string, number> = {};
      for (const r of recentMissed) {
        missedCounts[r.prayer_name] = (missedCounts[r.prayer_name] || 0) + 1;
      }
      const mostMissed = Object.entries(missedCounts).sort((a, b) => b[1] - a[1])[0];
      if (mostMissed && mostMissed[0] === "fajr" && mostMissed[1] >= 2) {
        insights.push({
          type: "tip",
          icon: Clock,
          message: t.fajrTip,
          color: "border-blue-200 bg-blue-50 text-blue-700",
        });
      }
    }
  }

  // Missed some today
  if (stats.todayFardCompleted > 0 && stats.todayFardCompleted < 5) {
    insights.push({
      type: "encouragement",
      icon: TrendingUp,
      message: t.missedSome,
      color: "border-amber-200 bg-amber-50 text-amber-700",
    });
  }

  // Jamaah encouragement
  if (stats.jamaahRate < 30 && stats.totalFardPrayed > 10) {
    insights.push({
      type: "tip",
      icon: TrendingUp,
      message:
        "The reward of prayer in jamaah is 27 times greater than praying alone. Try to increase your jamaah prayers.",
      color: "border-purple-200 bg-purple-50 text-purple-700",
    });
  }

  return insights;
}
