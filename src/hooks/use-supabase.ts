"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Reusable hook that returns a stable Supabase browser client.
 * Use this in all client components instead of calling createClient() directly.
 */
export function useSupabase() {
  return useMemo(() => createClient(), []);
}
