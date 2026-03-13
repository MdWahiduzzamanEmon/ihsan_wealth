"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getSalatDateContext } from "@/lib/hijri-utils";
import { getLocalDateStr } from "@/lib/date-utils";

// ─── Types ───

export type FardPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type SpecialPrayer = "jummah" | "eid_al_fitr" | "eid_al_adha";
export type SunnahPrayer =
  | "sunnah_fajr"
  | "sunnah_dhuhr_before"
  | "sunnah_dhuhr_after"
  | "sunnah_maghrib"
  | "sunnah_isha";
export type NaflPrayer = "tahajjud" | "duha" | "ishraq" | "awwabin";
export type RamadanPrayer = "taraweeh" | "witr_ramadan";
export type PrayerName =
  | FardPrayer
  | SpecialPrayer
  | SunnahPrayer
  | NaflPrayer
  | RamadanPrayer;
export type PrayerType = "fard" | "sunnah" | "nafl" | "wajib" | "ramadan";
export type PrayerStatus = "prayed" | "missed" | "late" | "qaza";

export interface SalatRecord {
  id: string;
  user_id: string;
  date: string;
  prayer_name: PrayerName;
  prayer_type: PrayerType;
  status: PrayerStatus;
  in_jamaah: boolean;
  on_time: boolean;
  created_at: string;
}

// ─── Prayer metadata ───

const PRAYER_TYPE_MAP: Record<PrayerName, PrayerType> = {
  fajr: "fard",
  dhuhr: "fard",
  asr: "fard",
  maghrib: "fard",
  isha: "fard",
  jummah: "fard",
  eid_al_fitr: "wajib",
  eid_al_adha: "wajib",
  sunnah_fajr: "sunnah",
  sunnah_dhuhr_before: "sunnah",
  sunnah_dhuhr_after: "sunnah",
  sunnah_maghrib: "sunnah",
  sunnah_isha: "sunnah",
  tahajjud: "nafl",
  duha: "nafl",
  ishraq: "nafl",
  awwabin: "nafl",
  taraweeh: "ramadan",
  witr_ramadan: "ramadan",
};

export const FARD_PRAYERS: FardPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

// ─── Stats interface ───

export interface SalatStats {
  todayFardCompleted: number;
  todayFardTotal: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  onTimeRate: number;
  jamaahRate: number;
  totalFardPrayed: number;
  totalOnTime: number;
  totalJamaah: number;
  totalSunnah: number;
  // Weekly stats (actual last 7 days counts)
  weeklyAllFardDays: number;
  weeklyOnTimePrayers: number;
  weeklyJamaahDays: number;
  weeklySunnahCount: number;
}

// ─── Qaza entry ───

export interface QazaEntry {
  prayer_name: FardPrayer;
  count: number;
}

// ─── Hook ───

export function useSalatTracker(countryCode?: string) {
  const { user, isAuthenticated, supabase } = useAuth();
  const [records, setRecords] = useState<SalatRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  // Sunnah visibility toggle — persisted in localStorage
  const [sunnahEnabled, setSunnahEnabled] = useLocalStorage("salat-sunnah-enabled", false);

  // Selected date for navigation (default today in local timezone)
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr());

  // ─── Day context ───
  const dateContext = useMemo(() => {
    const date = new Date(selectedDate + "T12:00:00");
    return getSalatDateContext(date, countryCode);
  }, [selectedDate, countryCode]);

  // ─── Fetch records ───
  const fetchRecords = useCallback(async (): Promise<SalatRecord[]> => {
    const id = ++fetchId.current;
    setIsLoading(true);
    try {
      await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("salat_records")
        .select("*")
        .order("date", { ascending: false })
        .limit(500);

      if (id !== fetchId.current) return [];
      if (error) {
        console.error("Failed to fetch salat records:", error.message);
        return [];
      } else {
        const mapped = (data || []).map((row) => ({
          id: row.id,
          user_id: row.user_id,
          date: row.date,
          prayer_name: row.prayer_name as PrayerName,
          prayer_type: row.prayer_type as PrayerType,
          status: row.status as PrayerStatus,
          in_jamaah: row.in_jamaah,
          on_time: row.on_time,
          created_at: row.created_at,
        }));
        setRecords(mapped);
        return mapped;
      }
    } catch (err) {
      console.error("Failed to fetch salat records:", err);
      return [];
    } finally {
      if (id === fetchId.current) setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRecords([]);
      setIsLoading(false);
      return;
    }
    // Fetch records and refresh streak cache on load
    fetchRecords().then((fresh) => {
      if (fresh.length > 0) updateStreakCache(fresh);
    });
  }, [isAuthenticated, user, fetchRecords]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Toggle prayer (upsert) ───
  const togglePrayer = useCallback(
    async (
      prayerName: PrayerName,
      status: PrayerStatus = "prayed",
      options?: { in_jamaah?: boolean; on_time?: boolean; date?: string }
    ) => {
      if (!user) return;
      const date = options?.date || selectedDate;
      const prayerType = PRAYER_TYPE_MAP[prayerName];
      const in_jamaah = options?.in_jamaah ?? false;
      const on_time = options?.on_time ?? (status === "prayed");

      try {
        await supabase.auth.getSession();
        const { error } = await supabase.from("salat_records").upsert(
          {
            user_id: user.id,
            date,
            prayer_name: prayerName,
            prayer_type: prayerType,
            status,
            in_jamaah,
            on_time,
          },
          { onConflict: "user_id,date,prayer_name" }
        );
        if (error) {
          console.error("Failed to toggle prayer:", error.message);
        } else {
          const freshRecords = await fetchRecords();
          // Update streak cache with fresh records
          updateStreakCache(freshRecords);
        }
      } catch (err) {
        console.error("Failed to toggle prayer:", err);
      }
    },
    [supabase, user, selectedDate, fetchRecords]
  );

  // ─── Remove prayer record ───
  const removePrayer = useCallback(
    async (prayerName: PrayerName, date?: string) => {
      if (!user) return;
      const targetDate = date || selectedDate;
      try {
        await supabase.auth.getSession();
        const { error } = await supabase
          .from("salat_records")
          .delete()
          .eq("user_id", user.id)
          .eq("date", targetDate)
          .eq("prayer_name", prayerName);
        if (error) {
          console.error("Failed to remove prayer:", error.message);
        } else {
          const freshRecords = await fetchRecords();
          updateStreakCache(freshRecords);
        }
      } catch (err) {
        console.error("Failed to remove prayer:", err);
      }
    },
    [supabase, user, selectedDate, fetchRecords]
  );

  // ─── Log qaza prayer ───
  const logQaza = useCallback(
    async (prayerName: FardPrayer, count: number = 1) => {
      if (!user) return;
      const today = getLocalDateStr();
      const timestamp = Date.now();
      // Insert qaza records with unique prayer_name suffix to avoid duplicate key conflicts
      for (let i = 0; i < count; i++) {
        const qazaName = `${prayerName}_qaza_${timestamp}_${i}` as PrayerName;
        try {
          await supabase.auth.getSession();
          const { error } = await supabase.from("salat_records").insert({
            user_id: user.id,
            date: today,
            prayer_name: qazaName,
            prayer_type: "fard",
            status: "qaza" as PrayerStatus,
            in_jamaah: false,
            on_time: false,
          });
          if (error) {
            console.error("Failed to log qaza:", error.message);
          }
        } catch (err) {
          console.error("Failed to log qaza:", err);
        }
      }
      const freshRecords = await fetchRecords();
      updateStreakCache(freshRecords);
    },
    [supabase, user, fetchRecords]
  );

  // ─── Update streak cache ───
  const updateStreakCache = useCallback(async (freshRecords?: SalatRecord[]) => {
    if (!user) return;
    try {
      const recs = freshRecords || records;
      const streak = computeStreak(recs);
      const fardRecords = recs.filter((r) => r.prayer_type === "fard" && r.status !== "missed" && !r.prayer_name.includes("_qaza_"));
      const onTimeRecords = fardRecords.filter((r) => r.on_time);
      const jamaahRecords = fardRecords.filter((r) => r.in_jamaah);
      const sunnahRecords = recs.filter((r) => r.prayer_type === "sunnah");

      const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "";

      await supabase.auth.getSession();
      await supabase.from("salat_streaks").upsert(
        {
          user_id: user.id,
          display_name: displayName,
          current_streak: streak.current,
          longest_streak: streak.longest,
          total_fard_prayed: fardRecords.length,
          total_on_time: onTimeRecords.length,
          total_jamaah: jamaahRecords.length,
          total_sunnah: sunnahRecords.length,
          last_updated: getLocalDateStr(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("Failed to update streak cache:", err);
    }
  }, [supabase, user, records]);

  // ─── Computed values ───

  // Records for selected date
  const selectedDateRecords = useMemo(
    () => records.filter((r) => r.date === selectedDate),
    [records, selectedDate]
  );

  // Today's records
  const today = getLocalDateStr();
  const todayRecords = useMemo(
    () => records.filter((r) => r.date === today),
    [records, today]
  );

  // Stats
  const stats: SalatStats = useMemo(() => {
    // Today's fard (exclude qaza records which have suffixed names)
    const todayFard = selectedDateRecords.filter(
      (r) => r.prayer_type === "fard" && r.status !== "missed" && !r.prayer_name.includes("_qaza_")
    );
    const todayFardCompleted = todayFard.length;

    // Streak
    const streak = computeStreak(records);

    // Overall rates (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysStr = getLocalDateStr(thirtyDaysAgo);
    const recentRecords = records.filter(
      (r) => r.date >= thirtyDaysStr && r.prayer_type === "fard" && !r.prayer_name.includes("_qaza_")
    );

    const totalFardPrayed = recentRecords.filter(
      (r) => r.status === "prayed" || r.status === "late"
    ).length;
    const totalOnTime = recentRecords.filter((r) => r.on_time && r.status !== "missed").length;
    const totalJamaah = recentRecords.filter((r) => r.in_jamaah && r.status !== "missed").length;
    const totalSunnah = records.filter(
      (r) => r.date >= thirtyDaysStr && r.prayer_type === "sunnah"
    ).length;

    // Unique days in last 30 days that have records
    const uniqueDays = new Set(recentRecords.map((r) => r.date)).size;
    const expectedFard = uniqueDays * 5;

    // Weekly stats (last 7 days — actual counts, not percentages)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = getLocalDateStr(sevenDaysAgo);
    const weeklyRecords = records.filter(
      (r) => r.date > sevenDaysStr && !r.prayer_name.includes("_qaza_")
    );

    // Days with all 5 fard completed (count jummah as valid fard on Fridays)
    const weeklyDateMap = new Map<string, Set<string>>();
    for (const r of weeklyRecords) {
      if (r.prayer_type === "fard" && (r.status === "prayed" || r.status === "late")) {
        if (!weeklyDateMap.has(r.date)) weeklyDateMap.set(r.date, new Set());
        weeklyDateMap.get(r.date)!.add(r.prayer_name);
      }
    }
    const weeklyAllFardDays = Array.from(weeklyDateMap.values()).filter((s) => s.size >= 5).length;

    // On-time fard prayers this week
    const weeklyOnTimePrayers = weeklyRecords.filter(
      (r) => r.prayer_type === "fard" && r.on_time && (r.status === "prayed" || r.status === "late")
    ).length;

    // Days with at least one jamaah prayer
    const weeklyJamaahDays = new Set(
      weeklyRecords.filter((r) => r.in_jamaah && (r.status === "prayed" || r.status === "late")).map((r) => r.date)
    ).size;

    // Sunnah prayers this week
    const weeklySunnahCount = weeklyRecords.filter((r) => r.prayer_type === "sunnah").length;

    return {
      todayFardCompleted,
      todayFardTotal: 5,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      completionRate: expectedFard > 0 ? Math.round((totalFardPrayed / expectedFard) * 100) : 0,
      onTimeRate: totalFardPrayed > 0 ? Math.round((totalOnTime / totalFardPrayed) * 100) : 0,
      jamaahRate: totalFardPrayed > 0 ? Math.round((totalJamaah / totalFardPrayed) * 100) : 0,
      totalFardPrayed,
      totalOnTime,
      totalJamaah,
      totalSunnah,
      weeklyAllFardDays,
      weeklyOnTimePrayers,
      weeklyJamaahDays,
      weeklySunnahCount,
    };
  }, [records, selectedDateRecords]);

  // Qaza log: accumulated missed fard that haven't been made up + made-up counts
  const { qazaLog, qazaMadeUp } = useMemo(() => {
    const missed: Record<string, number> = {};
    const madeUp: Record<string, number> = {};

    for (const r of records) {
      if (r.prayer_type === "fard") {
        // Check if this is a qaza record (prayer_name like "fajr_qaza_..." or old-style same name with qaza status)
        if (r.status === "qaza") {
          const baseName = r.prayer_name.includes("_qaza_")
            ? r.prayer_name.split("_qaza_")[0]
            : r.prayer_name;
          if (FARD_PRAYERS.includes(baseName as FardPrayer)) {
            madeUp[baseName] = (madeUp[baseName] || 0) + 1;
          }
        } else if (r.status === "missed" && FARD_PRAYERS.includes(r.prayer_name as FardPrayer)) {
          missed[r.prayer_name] = (missed[r.prayer_name] || 0) + 1;
        }
      }
    }

    const log: QazaEntry[] = FARD_PRAYERS.map((prayer) => ({
      prayer_name: prayer,
      count: Math.max(0, (missed[prayer] || 0) - (madeUp[prayer] || 0)),
    })).filter((e) => e.count > 0);

    const madeUpEntries: QazaEntry[] = FARD_PRAYERS.map((prayer) => ({
      prayer_name: prayer,
      count: madeUp[prayer] || 0,
    }));

    return { qazaLog: log, qazaMadeUp: madeUpEntries };
  }, [records]);

  const totalQazaRemaining = useMemo(
    () => qazaLog.reduce((sum, e) => sum + e.count, 0),
    [qazaLog]
  );

  const totalQazaMadeUp = useMemo(
    () => qazaMadeUp.reduce((sum, e) => sum + e.count, 0),
    [qazaMadeUp]
  );

  // ─── Date navigation ───
  const goToPreviousDay = useCallback(() => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    setSelectedDate(getLocalDateStr(d));
  }, [selectedDate]);

  const goToNextDay = useCallback(() => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const todayStr = getLocalDateStr();
    const nextStr = getLocalDateStr(d);
    if (nextStr <= todayStr) {
      setSelectedDate(nextStr);
    }
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(getLocalDateStr());
  }, []);

  // ─── Records for a date range (for reports) ───
  const getRecordsForRange = useCallback(
    (startDate: string, endDate: string) => {
      return records.filter((r) => r.date >= startDate && r.date <= endDate);
    },
    [records]
  );

  return {
    // Records
    records,
    selectedDateRecords,
    todayRecords,

    // Actions
    togglePrayer,
    removePrayer,
    logQaza,

    // Stats
    stats,

    // Qaza
    qazaLog,
    qazaMadeUp,
    totalQazaRemaining,
    totalQazaMadeUp,

    // Day context
    dateContext,

    // Date navigation
    selectedDate,
    setSelectedDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    isToday: selectedDate === today,

    // Settings
    sunnahEnabled,
    setSunnahEnabled,

    // Reports helper
    getRecordsForRange,

    // Loading
    isLoading,
  };
}

// ─── Streak computation ───

function computeStreak(records: SalatRecord[]): { current: number; longest: number } {
  // Group fard records by date
  const dateMap = new Map<string, Set<string>>();
  for (const r of records) {
    if (r.prayer_type === "fard" && (r.status === "prayed" || r.status === "late")) {
      if (!dateMap.has(r.date)) dateMap.set(r.date, new Set());
      dateMap.get(r.date)!.add(r.prayer_name);
    }
  }

  // Get sorted unique dates
  const dates = Array.from(dateMap.keys()).sort().reverse();

  // A day counts for streak if all 5 fard prayers are marked
  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const dateStr = dates[i];
    const prayers = dateMap.get(dateStr);
    const allFard = prayers && prayers.size >= 5;

    if (i === 0) {
      // Check if most recent date is today or yesterday
      const d = new Date(dateStr + "T12:00:00");
      const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
      if (diff > 1) break; // Gap too large, no current streak
      if (!allFard) break;
      streak = 1;
    } else {
      // Check consecutive days
      const prev = new Date(dates[i - 1] + "T12:00:00");
      const curr = new Date(dateStr + "T12:00:00");
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
      if (diff !== 1 || !allFard) break;
      streak++;
    }
  }
  current = streak;

  // Longest streak: scan all dates
  streak = 0;
  const allDates = Array.from(dateMap.keys()).sort();
  for (let i = 0; i < allDates.length; i++) {
    const prayers = dateMap.get(allDates[i]);
    const allFard = prayers && prayers.size >= 5;
    if (!allFard) {
      longest = Math.max(longest, streak);
      streak = 0;
      continue;
    }
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(allDates[i - 1] + "T12:00:00");
      const curr = new Date(allDates[i] + "T12:00:00");
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) {
        streak++;
      } else {
        longest = Math.max(longest, streak);
        streak = 1;
      }
    }
  }
  longest = Math.max(longest, streak, current);

  return { current, longest };
}
