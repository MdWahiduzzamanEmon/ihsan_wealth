"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function useFavoriteHadiths() {
  const { user, isAuthenticated, supabase } = useAuth();
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>("favorite-hadiths", []);
  const [dbFavorites, setDbFavorites] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchId = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setDbFavorites(null);
      return;
    }

    const id = ++fetchId.current;
    setIsLoading(true);

    (async () => {
      try {
        await supabase.auth.getSession();
        const { data, error } = await supabase
          .from("favorite_hadiths")
          .select("hadith_id");

        if (id !== fetchId.current) return;

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
        if (id === fetchId.current) setDbFavorites(null);
      } finally {
        if (id === fetchId.current) setIsLoading(false);
      }
    })();
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
        await supabase.auth.getSession();
        if (isFavorited) {
          const { error } = await supabase
            .from("favorite_hadiths")
            .delete()
            .eq("user_id", user.id)
            .eq("hadith_id", hadithId);
          if (error) console.error("Failed to remove favorite hadith:", error.message);
        } else {
          const { error } = await supabase
            .from("favorite_hadiths")
            .insert({ user_id: user.id, hadith_id: hadithId });
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
