"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import type { ZakatFormData, ZakatResult } from "@/types/zakat";
import type { MetalPrices } from "@/hooks/use-metal-prices";

export interface ZakatRecord {
  id: string;
  user_id: string;
  year: number;
  year_type: "gregorian" | "hijri";
  calculated_at: string;
  currency: string;
  country: string;
  nisab_basis: "gold" | "silver";
  form_data: ZakatFormData;
  gold_price_per_gram: number;
  silver_price_per_gram: number;
  prices_were_live: boolean;
  total_assets: number;
  total_deductions: number;
  net_zakatable_wealth: number;
  nisab_threshold: number;
  is_above_nisab: boolean;
  zakat_amount: number;
  breakdown: Array<{ category: string; amount: number; percentage: number; color: string }>;
  notes: string | null;
  is_paid: boolean;
  paid_at: string | null;
}

export interface ZakatPayment {
  id: string;
  record_id: string;
  amount: number;
  recipient: string;
  category: string;
  paid_at: string;
  notes: string | null;
}

export function useZakatRecords() {
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveRecord = useCallback(async (
    formData: ZakatFormData,
    result: ZakatResult,
    prices: MetalPrices,
    year?: number
  ) => {
    setLoading(true);
    setError(null);

    const currentYear = year || new Date().getFullYear();

    try {
      if (!user) throw new Error("Please sign in to save your calculation");

      await supabase.auth.getSession();
      const { data, error: dbError } = await supabase
        .from("zakat_records")
        .upsert({
          user_id: user.id,
          year: currentYear,
          year_type: "gregorian",
          currency: formData.currency,
          country: formData.country,
          nisab_basis: formData.nisabBasis,
          form_data: formData,
          gold_price_per_gram: prices.goldPricePerGram,
          silver_price_per_gram: prices.silverPricePerGram,
          prices_were_live: prices.live,
          total_assets: result.totalAssets,
          total_deductions: result.totalDeductions,
          net_zakatable_wealth: result.netZakatableWealth,
          nisab_threshold: result.activeNisab,
          is_above_nisab: result.isAboveNisab,
          zakat_amount: result.zakatAmount,
          breakdown: result.breakdown,
        }, {
          onConflict: "user_id,year,year_type",
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      return data as ZakatRecord;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  const fetchRecords = useCallback(async (filters?: {
    year?: number;
    yearType?: "gregorian" | "hijri";
  }) => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.getSession();
      let query = supabase
        .from("zakat_records")
        .select("*")
        .order("year", { ascending: false });

      if (filters?.year) query = query.eq("year", filters.year);
      if (filters?.yearType) query = query.eq("year_type", filters.yearType);

      const { data, error: dbError } = await query;
      if (dbError) throw new Error(dbError.message);
      return (data || []) as ZakatRecord[];
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deleteRecord = useCallback(async (id: string) => {
    await supabase.auth.getSession();
    const { error: dbError } = await supabase
      .from("zakat_records")
      .delete()
      .eq("id", id);
    if (dbError) setError(dbError.message);
    return !dbError;
  }, [supabase]);

  const markPaid = useCallback(async (id: string) => {
    await supabase.auth.getSession();
    const { error: dbError } = await supabase
      .from("zakat_records")
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq("id", id);
    if (dbError) setError(dbError.message);
    return !dbError;
  }, [supabase]);

  const addPayment = useCallback(async (payment: {
    record_id: string;
    amount: number;
    recipient: string;
    category: string;
    notes?: string;
  }) => {
    if (!user) return null;

    await supabase.auth.getSession();
    const { data, error: dbError } = await supabase
      .from("zakat_payments")
      .insert({ ...payment, user_id: user.id })
      .select()
      .single();

    if (dbError) setError(dbError.message);
    return data as ZakatPayment | null;
  }, [supabase, user]);

  const fetchPayments = useCallback(async (recordId: string) => {
    await supabase.auth.getSession();
    const { data, error: dbError } = await supabase
      .from("zakat_payments")
      .select("*")
      .eq("record_id", recordId)
      .order("paid_at", { ascending: false });

    if (dbError) setError(dbError.message);
    return (data || []) as ZakatPayment[];
  }, [supabase]);

  return {
    loading,
    error,
    saveRecord,
    fetchRecords,
    deleteRecord,
    markPaid,
    addPayment,
    fetchPayments,
  };
}
