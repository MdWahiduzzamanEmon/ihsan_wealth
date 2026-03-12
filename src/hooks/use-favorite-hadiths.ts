"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function useFavoriteHadiths() {
  const { user, isAuthenticated } = useAuth();
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>("favorite-hadiths", []);
  const [dbFavorites, setDbFavorites] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase();
  const prevUserId = useRef<string | null>(null);

  // Fetch favorites from Supabase when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setDbFavorites(null);
      prevUserId.current = null;
      return;
    }

    if (prevUserId.current === user.id) return;
    prevUserId.current = user.id;

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const { data: { session: resolvedSession } } = await supabase.auth.getSession();
        if (!resolvedSession) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("favorite_hadiths")
          .select("hadith_id");

        if (cancelled) return;

        if (error) {
          console.error("Failed to fetch favorite hadiths:", error.message);
          setDbFavorites(null);
        } else {
          const ids = (data || []).map((row) => row.hadith_id as string);
          setDbFavorites(ids);
          setLocalFavorites(ids);
        }
      } catch (err) {
        console.error("Failed to fetch favorite hadiths:", err);
        if (!cancelled) setDbFavorites(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated, user, supabase, setLocalFavorites]);

  const favorites = dbFavorites ?? localFavorites;

  const toggleFavorite = useCallback(
    async (hadithId: string): Promise<"login-required" | void> => {
      if (!isAuthenticated || !user) {
        return "login-required";
      }

      const isFavorited = favorites.includes(hadithId);
      const newFavorites = isFavorited
        ? favorites.filter((id) => id !== hadithId)
        : [...favorites, hadithId];

      setLocalFavorites(newFavorites);
      setDbFavorites(newFavorites);

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        if (isFavorited) {
          const { error } = await supabase
            .from("favorite_hadiths")
            .delete()
            .eq("user_id", authUser.id)
            .eq("hadith_id", hadithId);
          if (error) console.error("Failed to remove favorite hadith:", error.message);
        } else {
          const { error } = await supabase
            .from("favorite_hadiths")
            .insert({ user_id: authUser.id, hadith_id: hadithId });
          if (error) console.error("Failed to save favorite hadith:", error.message);
        }
      } catch (err) {
        console.error("Failed to sync favorite hadith:", err);
      }
    },
    [favorites, isAuthenticated, user, supabase, setLocalFavorites]
  );

  return { favorites, toggleFavorite, isLoading, isAuthenticated };
}
