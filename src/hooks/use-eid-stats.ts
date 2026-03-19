"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";

export type EidAction = "download" | "share" | "whatsapp" | "email" | "clipboard" | "sticker_download" | "frame_download";

export interface EidGlobalStats {
  total_downloads: number;
  total_shares: number;
  total_whatsapp: number;
  total_stickers: number;
  total_frames: number;
  total_actions: number;
  unique_users: number;
}

const DEFAULT_STATS: EidGlobalStats = {
  total_downloads: 0,
  total_shares: 0,
  total_whatsapp: 0,
  total_stickers: 0,
  total_frames: 0,
  total_actions: 0,
  unique_users: 0,
};

export function useEidStats() {
  const { user } = useAuth();
  const [globalStats, setGlobalStats] = useState<EidGlobalStats>(DEFAULT_STATS);
  const [myStats, setMyStats] = useState<Record<EidAction, number>>({
    download: 0, share: 0, whatsapp: 0, email: 0, clipboard: 0, sticker_download: 0, frame_download: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const year = new Date().getFullYear();

  // Fetch global stats
  const fetchStats = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.rpc as any)("get_eid_card_global_stats", { target_year: year });
      if (data) setGlobalStats(data as EidGlobalStats);
    } catch { /* ignore */ }

    // Fetch per-user stats if authenticated
    if (user) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from as any)("eid_card_stats")
          .select("action")
          .eq("user_id", user.id)
          .eq("year", year);

        if (data) {
          const counts: Record<string, number> = {};
          data.forEach((r: { action: string }) => {
            counts[r.action] = (counts[r.action] || 0) + 1;
          });
          setMyStats((prev) => ({ ...prev, ...counts } as Record<EidAction, number>));
        }
      } catch { /* ignore */ }
    }

    setIsLoading(false);
  }, [supabase, user, year]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Track an action
  const trackAction = useCallback(async (action: EidAction, details?: { design?: string; layout?: string }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from as any)("eid_card_stats").insert({
        user_id: user?.id || null,
        action,
        card_design: details?.design || null,
        card_layout: details?.layout || null,
        year,
      });

      // Optimistic update
      setGlobalStats((prev) => ({
        ...prev,
        total_actions: prev.total_actions + 1,
        total_downloads: action === "download" ? prev.total_downloads + 1 : prev.total_downloads,
        total_shares: ["share", "whatsapp", "email", "clipboard"].includes(action) ? prev.total_shares + 1 : prev.total_shares,
        total_whatsapp: action === "whatsapp" ? prev.total_whatsapp + 1 : prev.total_whatsapp,
        total_stickers: action === "sticker_download" ? prev.total_stickers + 1 : prev.total_stickers,
        total_frames: action === "frame_download" ? prev.total_frames + 1 : prev.total_frames,
      }));

      setMyStats((prev) => ({ ...prev, [action]: (prev[action] || 0) + 1 }));
    } catch { /* ignore tracking errors — don't block the user */ }
  }, [supabase, user, year]);

  return { globalStats, myStats, trackAction, isLoading };
}
