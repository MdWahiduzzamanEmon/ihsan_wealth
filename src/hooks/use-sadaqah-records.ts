"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/components/providers/auth-provider";
import type { SadaqahRecord } from "@/components/sadaqah/sadaqah-form";

export function useSadaqahRecords() {
  const { user, isAuthenticated } = useAuth();
  const [records, setRecords] = useState<SadaqahRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase();

  // Fetch records from Supabase when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function fetchRecords() {
      try {
        // Force the Supabase client to resolve its auth session from cookies
        const { data: { session: resolvedSession } } = await supabase.auth.getSession();
        if (!resolvedSession) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("sadaqah_records")
          .select("*")
          .order("date", { ascending: false });

        if (cancelled) return;
        if (error) {
          console.error("Failed to fetch sadaqah records:", error.message);
        } else {
          setRecords(
            (data || []).map((row) => ({
              id: row.id,
              amount: Number(row.amount),
              currency: row.currency || "USD",
              category: row.category,
              date: row.date,
              notes: row.notes || "",
            }))
          );
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch sadaqah records:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchRecords();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, supabase]);

  const addRecord = useCallback(
    async (record: SadaqahRecord) => {
      // Optimistic update
      setRecords((prev) => [record, ...prev]);

      if (isAuthenticated && user) {
        try {
          const { error } = await supabase.from("sadaqah_records").insert({
            id: record.id,
            user_id: user.id,
            amount: record.amount,
            currency: record.currency,
            category: record.category,
            date: record.date,
            notes: record.notes || null,
          });
          if (error) console.error("Failed to save sadaqah:", error.message);
        } catch (err) {
          console.error("Failed to save sadaqah:", err);
        }
      }
    },
    [isAuthenticated, user, supabase]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      // Optimistic update
      setRecords((prev) => prev.filter((r) => r.id !== id));

      if (isAuthenticated && user) {
        try {
          const { error } = await supabase
            .from("sadaqah_records")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);
          if (error) console.error("Failed to delete sadaqah:", error.message);
        } catch (err) {
          console.error("Failed to delete sadaqah:", err);
        }
      }
    },
    [isAuthenticated, user, supabase]
  );

  return { records, addRecord, deleteRecord, isLoading };
}
