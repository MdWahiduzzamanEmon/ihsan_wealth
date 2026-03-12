"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import type { SadaqahRecord } from "@/components/sadaqah/sadaqah-form";

export function useSadaqahRecords() {
  const { user, isAuthenticated, supabase } = useAuth();
  const [records, setRecords] = useState<SadaqahRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  const fetchRecords = useCallback(async () => {
    const id = ++fetchId.current;
    setIsLoading(true);
    try {
      // Prime the client's auth state before querying
      await supabase.auth.getSession();

      const { data, error } = await supabase
        .from("sadaqah_records")
        .select("*")
        .order("date", { ascending: false });

      if (id !== fetchId.current) return;
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
      console.error("Failed to fetch sadaqah records:", err);
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
    fetchRecords();
  }, [isAuthenticated, user, fetchRecords]);

  const addRecord = useCallback(
    async (record: SadaqahRecord) => {
      try {
        await supabase.auth.getSession();
        const { error } = await supabase.from("sadaqah_records").insert({
          id: record.id,
          user_id: user!.id,
          amount: record.amount,
          currency: record.currency,
          category: record.category,
          date: record.date,
          notes: record.notes || null,
        });
        if (error) {
          console.error("Failed to save sadaqah:", error.message);
        } else {
          await fetchRecords();
        }
      } catch (err) {
        console.error("Failed to save sadaqah:", err);
      }
    },
    [supabase, user, fetchRecords]
  );

  const deleteRecord = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await supabase.auth.getSession();
        const { error } = await supabase
          .from("sadaqah_records")
          .delete()
          .eq("id", id);
        if (error) {
          console.error("Failed to delete sadaqah:", error.message);
          return false;
        }
        await fetchRecords();
        return true;
      } catch (err) {
        console.error("Failed to delete sadaqah:", err);
        return false;
      }
    },
    [supabase, fetchRecords]
  );

  return { records, addRecord, deleteRecord, isLoading };
}
