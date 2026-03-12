"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { getLocalDateStr } from "@/lib/date-utils";

export interface TasbihSession {
  id: string;
  dhikr_type: string;
  custom_text?: string;
  target_count: number;
  completed_count: number;
  completed_at: string;
  date: string;
}

export function useTasbihHistory() {
  const { user, isAuthenticated, supabase } = useAuth();
  const [sessions, setSessions] = useState<TasbihSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  const fetchSessions = useCallback(async () => {
    const id = ++fetchId.current;
    setIsLoading(true);
    try {
      await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("tasbih_sessions")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(100);

      if (id !== fetchId.current) return;
      if (error) {
        console.error("Failed to fetch tasbih sessions:", error.message);
      } else {
        setSessions(
          (data || []).map((row) => ({
            id: row.id,
            dhikr_type: row.dhikr_type,
            custom_text: row.custom_text || undefined,
            target_count: row.target_count,
            completed_count: row.completed_count,
            completed_at: row.completed_at,
            date: row.date,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch tasbih sessions:", err);
    } finally {
      if (id === fetchId.current) setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSessions([]);
      setIsLoading(false);
      return;
    }
    fetchSessions();
  }, [isAuthenticated, user, fetchSessions]);

  const addSession = useCallback(
    async (session: Omit<TasbihSession, "id" | "completed_at" | "date">) => {
      const now = new Date();
      const newSession: TasbihSession = {
        id: crypto.randomUUID(),
        ...session,
        completed_at: now.toISOString(),
        date: getLocalDateStr(now),
      };

      try {
        await supabase.auth.getSession();
        const { error } = await supabase.from("tasbih_sessions").insert({
          id: newSession.id,
          user_id: user!.id,
          dhikr_type: newSession.dhikr_type,
          custom_text: newSession.custom_text || null,
          target_count: newSession.target_count,
          completed_count: newSession.completed_count,
          completed_at: newSession.completed_at,
          date: newSession.date,
        });
        if (error) {
          console.error("Failed to save tasbih session:", error.message);
        } else {
          await fetchSessions();
        }
      } catch (err) {
        console.error("Failed to save tasbih session:", err);
      }

      return newSession;
    },
    [supabase, user, fetchSessions]
  );

  const deleteSession = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await supabase.auth.getSession();
        const { error } = await supabase
          .from("tasbih_sessions")
          .delete()
          .eq("id", id);
        if (error) {
          console.error("Failed to delete tasbih session:", error.message);
          return false;
        }
        await fetchSessions();
        return true;
      } catch (err) {
        console.error("Failed to delete tasbih session:", err);
        return false;
      }
    },
    [supabase, fetchSessions]
  );

  const today = getLocalDateStr();
  const todaySessions = sessions.filter((s) => s.date === today);
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.completed_count, 0);

  return { sessions, todaySessions, todayTotal, addSession, deleteSession, isLoading };
}
