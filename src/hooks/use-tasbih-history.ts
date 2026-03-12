"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/components/providers/auth-provider";

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
  const { user, session: authSession, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<TasbihSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    if (!isAuthenticated || !user || !authSession) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function fetchSessions() {
      try {
        // Force the Supabase client to resolve its auth session from cookies
        // before querying — without this, RLS may see auth.uid() as NULL
        const { data: { session: resolvedSession } } = await supabase.auth.getSession();
        if (!resolvedSession) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("tasbih_sessions")
          .select("*")
          .order("completed_at", { ascending: false })
          .limit(100);

        if (cancelled) return;
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
        if (cancelled) return;
        console.error("Failed to fetch tasbih sessions:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSessions();
    return () => { cancelled = true; };
  }, [isAuthenticated, user, authSession, supabase]);

  const addSession = useCallback(
    async (session: Omit<TasbihSession, "id" | "completed_at" | "date">) => {
      const now = new Date();
      const newSession: TasbihSession = {
        id: crypto.randomUUID(),
        ...session,
        completed_at: now.toISOString(),
        date: now.toISOString().split("T")[0],
      };

      // Optimistic update
      setSessions((prev) => [newSession, ...prev]);

      try {
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (!sess?.user) return newSession;

        const { error } = await supabase.from("tasbih_sessions").insert({
          id: newSession.id,
          user_id: sess.user.id,
          dhikr_type: newSession.dhikr_type,
          custom_text: newSession.custom_text || null,
          target_count: newSession.target_count,
          completed_count: newSession.completed_count,
          completed_at: newSession.completed_at,
          date: newSession.date,
        });
        if (error) console.error("Failed to save tasbih session:", error.message);
      } catch (err) {
        console.error("Failed to save tasbih session:", err);
      }

      return newSession;
    },
    [isAuthenticated, user, supabase]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      try {
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (!sess?.user) return;

        const { error } = await supabase
          .from("tasbih_sessions")
          .delete()
          .eq("id", id)
          .eq("user_id", sess.user.id);
        if (error) console.error("Failed to delete tasbih session:", error.message);
      } catch (err) {
        console.error("Failed to delete tasbih session:", err);
      }
    },
    [isAuthenticated, user, supabase]
  );

  // Today's stats
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((s) => s.date === today);
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.completed_count, 0);

  return { sessions, todaySessions, todayTotal, addSession, deleteSession, isLoading };
}
