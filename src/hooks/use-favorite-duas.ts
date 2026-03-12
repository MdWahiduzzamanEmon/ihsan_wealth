"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function useFavoriteDuas() {
  const { user, isAuthenticated } = useAuth();
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>("favorite-duas", []);
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
          .from("favorite_duas")
          .select("dua_id");

        if (cancelled) return;

        if (error) {
          console.error("Failed to fetch favorite duas:", error.message);
          setDbFavorites(null);
        } else {
          const ids = (data || []).map((row) => row.dua_id as string);
          setDbFavorites(ids);
          // Sync localStorage with DB data
          setLocalFavorites(ids);
        }
      } catch (err) {
        console.error("Failed to fetch favorite duas:", err);
        if (!cancelled) setDbFavorites(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, supabase, setLocalFavorites]);

  const favorites = dbFavorites ?? localFavorites;

  const toggleFavorite = useCallback(
    async (duaId: string): Promise<"login-required" | void> => {
      if (!isAuthenticated || !user) {
        return "login-required";
      }

      const isFavorited = favorites.includes(duaId);
      const newFavorites = isFavorited
        ? favorites.filter((id) => id !== duaId)
        : [...favorites, duaId];

      setLocalFavorites(newFavorites);
      setDbFavorites(newFavorites);

      try {
        if (isFavorited) {
          const { error } = await supabase
            .from("favorite_duas")
            .delete()
            .eq("user_id", user.id)
            .eq("dua_id", duaId);
          if (error) console.error("Failed to remove favorite dua from DB:", error.message);
        } else {
          const { error } = await supabase
            .from("favorite_duas")
            .insert({ user_id: user.id, dua_id: duaId });
          if (error) console.error("Failed to save favorite dua to DB:", error.message);
        }
      } catch (err) {
        console.error("Failed to sync favorite dua with DB:", err);
      }
    },
    [favorites, isAuthenticated, user, supabase, setLocalFavorites]
  );

  return {
    favorites,
    toggleFavorite,
    isLoading,
    isAuthenticated,
  };
}
