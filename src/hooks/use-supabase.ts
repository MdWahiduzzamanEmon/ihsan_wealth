"use client";

import { useAuth } from "@/components/providers/auth-provider";

/**
 * Returns the shared Supabase browser client from AuthProvider.
 * This ensures all hooks use the same client instance with proper auth state.
 */
export function useSupabase() {
  const { supabase } = useAuth();
  return supabase;
}
