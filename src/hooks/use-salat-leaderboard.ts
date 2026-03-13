"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  current_streak: number;
  longest_streak: number;
  total_fard_prayed: number;
  total_on_time: number;
  total_jamaah: number;
  total_sunnah: number;
}

export type LeaderboardCategory = "streak" | "consistent" | "jamaah" | "on_time";

export function useSalatLeaderboard() {
  const { user, isAuthenticated, supabase } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  const fetchLeaderboard = useCallback(async () => {
    const id = ++fetchId.current;
    setIsLoading(true);
    try {
      await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("salat_streaks")
        .select("*")
        .order("current_streak", { ascending: false })
        .limit(50);

      if (id !== fetchId.current) return;
      if (error) {
        console.error("Failed to fetch leaderboard:", error.message);
      } else {
        setEntries(
          (data || []).map((row) => ({
            user_id: row.user_id,
            display_name: row.display_name || maskUserId(row.user_id),
            current_streak: row.current_streak,
            longest_streak: row.longest_streak,
            total_fard_prayed: row.total_fard_prayed,
            total_on_time: row.total_on_time,
            total_jamaah: row.total_jamaah,
            total_sunnah: row.total_sunnah,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      if (id === fetchId.current) setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLeaderboard();
  }, [isAuthenticated, fetchLeaderboard]);

  const getRanking = (category: LeaderboardCategory): LeaderboardEntry[] => {
    const sorted = [...entries];
    switch (category) {
      case "streak":
        sorted.sort((a, b) => b.current_streak - a.current_streak);
        break;
      case "consistent":
        sorted.sort((a, b) => b.total_fard_prayed - a.total_fard_prayed);
        break;
      case "jamaah":
        sorted.sort((a, b) => b.total_jamaah - a.total_jamaah);
        break;
      case "on_time":
        sorted.sort((a, b) => b.total_on_time - a.total_on_time);
        break;
    }
    return sorted.slice(0, 10);
  };

  const getUserRank = (category: LeaderboardCategory): number => {
    if (!user) return 0;
    const sorted = getRanking(category);
    const idx = sorted.findIndex((e) => e.user_id === user.id);
    return idx >= 0 ? idx + 1 : entries.length + 1;
  };

  return {
    entries,
    getRanking,
    getUserRank,
    currentUserId: user?.id,
    isLoading,
  };
}

function maskUserId(id: string): string {
  if (id.length < 4) return "***";
  return id.slice(0, 2) + "***" + id.slice(-2);
}
