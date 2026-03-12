"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { gregorianToHijri, getHijriAdjustment, getRamadanDayNumber } from "@/lib/hijri-utils";
import type { RamadanDayData } from "@/components/salat-tracker/ramadan-section";

export interface RamadanRecord {
  id: string;
  user_id: string;
  hijri_year: number;
  date: string;
  day_number: number;
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
  notes: string | null;
}

const DEFAULT_DAY_DATA: RamadanDayData = {
  fasted: false,
  suhoor: false,
  iftar: false,
  taraweeh: false,
  taraweeh_rakats: null,
  quran_pages: 0,
  sadaqah_given: false,
  dua_before_iftar: false,
  itikaf: false,
  laylatul_qadr_worship: false,
};

export function useRamadanTracker(countryCode?: string) {
  const { user, isAuthenticated, supabase } = useAuth();
  const [records, setRecords] = useState<RamadanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  // Current Hijri date
  const adjustment = countryCode ? getHijriAdjustment(countryCode) : 0;
  const today = new Date();
  const hijri = gregorianToHijri(today, adjustment);
  const isRamadan = hijri.month === 9;
  const currentHijriYear = hijri.year;
  const ramadanDayNumber = isRamadan ? hijri.day : null;

  // Allow viewing previous Ramadans
  const [viewYear, setViewYear] = useState(currentHijriYear);

  const fetchRecords = useCallback(async () => {
    const id = ++fetchId.current;
    setIsLoading(true);
    try {
      await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("ramadan_tracker")
        .select("*")
        .eq("hijri_year", viewYear)
        .order("day_number", { ascending: true });

      if (id !== fetchId.current) return;
      if (error) {
        console.error("Failed to fetch ramadan records:", error.message);
      } else {
        setRecords((data || []) as RamadanRecord[]);
      }
    } catch (err) {
      console.error("Failed to fetch ramadan records:", err);
    } finally {
      if (id === fetchId.current) setIsLoading(false);
    }
  }, [supabase, viewYear]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRecords([]);
      setIsLoading(false);
      return;
    }
    fetchRecords();
  }, [isAuthenticated, user, fetchRecords]);

  // Today's entry
  const todayStr = today.toISOString().split("T")[0];
  const todayEntry = useMemo(
    () => records.find((r) => r.date === todayStr),
    [records, todayStr]
  );

  const todayData: RamadanDayData = useMemo(() => {
    if (!todayEntry) return DEFAULT_DAY_DATA;
    return {
      fasted: todayEntry.fasted,
      suhoor: todayEntry.suhoor,
      iftar: todayEntry.iftar,
      taraweeh: todayEntry.taraweeh,
      taraweeh_rakats: todayEntry.taraweeh_rakats,
      quran_pages: todayEntry.quran_pages,
      sadaqah_given: todayEntry.sadaqah_given,
      dua_before_iftar: todayEntry.dua_before_iftar,
      itikaf: todayEntry.itikaf,
      laylatul_qadr_worship: todayEntry.laylatul_qadr_worship,
    };
  }, [todayEntry]);

  // Toggle a field for today
  const toggleField = useCallback(
    async (field: keyof RamadanDayData, value: boolean | number) => {
      if (!user || !isRamadan || !ramadanDayNumber) return;
      try {
        await supabase.auth.getSession();
        const upsertData = {
          user_id: user.id,
          hijri_year: currentHijriYear,
          date: todayStr,
          day_number: ramadanDayNumber,
          [field]: value,
        };
        const { error } = await supabase
          .from("ramadan_tracker")
          .upsert(upsertData, { onConflict: "user_id,date" });
        if (error) {
          console.error("Failed to update ramadan field:", error.message);
        } else {
          await fetchRecords();
        }
      } catch (err) {
        console.error("Failed to update ramadan field:", err);
      }
    },
    [supabase, user, isRamadan, ramadanDayNumber, currentHijriYear, todayStr, fetchRecords]
  );

  const updateQuranPages = useCallback(
    (pages: number) => toggleField("quran_pages", pages),
    [toggleField]
  );

  // Stats
  const stats = useMemo(() => {
    const totalFasted = records.filter((r) => r.fasted).length;
    const totalTaraweeh = records.filter((r) => r.taraweeh).length;
    const quranPagesTotal = records.reduce((sum, r) => sum + r.quran_pages, 0);
    const sadaqahDays = records.filter((r) => r.sadaqah_given).length;
    const itikaafDays = records.filter((r) => r.itikaf).length;
    return { totalFasted, totalTaraweeh, quranPagesTotal, sadaqahDays, itikaafDays };
  }, [records]);

  return {
    records,
    todayData,
    todayEntry,
    isRamadan,
    ramadanDayNumber,
    currentHijriYear,
    viewYear,
    setViewYear,
    toggleField,
    updateQuranPages,
    stats,
    isLoading,
  };
}
