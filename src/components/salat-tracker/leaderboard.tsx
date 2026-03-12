"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Users, Clock } from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import {
  useSalatLeaderboard,
  type LeaderboardCategory,
  type LeaderboardEntry,
} from "@/hooks/use-salat-leaderboard";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface LeaderboardProps {
  t: SalatTrackerTexts;
}

const CATEGORIES: {
  id: LeaderboardCategory;
  labelKey: keyof SalatTrackerTexts;
  icon: typeof Flame;
  getValue: (e: LeaderboardEntry) => number;
  unit: string;
}[] = [
  { id: "streak", labelKey: "topStreaks", icon: Flame, getValue: (e) => e.current_streak, unit: "days" },
  { id: "consistent", labelKey: "mostConsistent", icon: Target, getValue: (e) => e.total_fard_prayed, unit: "prayers" },
  { id: "jamaah", labelKey: "jamaahChampion", icon: Users, getValue: (e) => e.total_jamaah, unit: "prayers" },
  { id: "on_time", labelKey: "onTimeChampion", icon: Clock, getValue: (e) => e.total_on_time, unit: "prayers" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ t }: LeaderboardProps) {
  const { getRanking, getUserRank, currentUserId, isLoading } = useSalatLeaderboard();
  const [category, setCategory] = useState<LeaderboardCategory>("streak");

  const catConfig = CATEGORIES.find((c) => c.id === category)!;
  const ranking = getRanking(category);
  const myRank = getUserRank(category);

  return (
    <motion.div
      className="space-y-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      {/* Category tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 gap-0.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-medium transition-all ${
                category === cat.id
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{t[cat.labelKey] as string}</span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">{t[catConfig.labelKey] as string}</h3>
      </div>

      {/* Ranking list */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">{t.noData}</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {ranking.map((entry, i) => {
            const isMe = entry.user_id === currentUserId;
            const value = catConfig.getValue(entry);

            return (
              <motion.div
                key={entry.user_id}
                variants={staggerItem}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  isMe
                    ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200"
                    : "border-gray-100 bg-white"
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {i < 3 ? (
                    <span className="text-lg">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                  )}
                </div>

                {/* User */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isMe ? "text-emerald-700" : "text-gray-700"}`}>
                    {isMe ? "You" : entry.display_name}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-emerald-700">{value}</span>
                  <span className="text-[10px] text-gray-400 ml-1">{catConfig.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Your rank card */}
      {currentUserId && myRank > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700">{t.yourRank}</span>
            <span className="text-lg font-bold text-emerald-800">#{myRank}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
