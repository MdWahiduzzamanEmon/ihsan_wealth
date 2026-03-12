"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function useFavoriteDuas() {
  const { user, isAuthenticated, supabase } = useAuth();
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>("favorite-duas", []);
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
          .from("favorite_duas")
          .select("dua_id");

        if (id !== fetchId.current) return;

        if (error) {
          console.error("Failed to fetch favorite duas:", error.message);
          setDbFavorites(null);
        } else {
          const ids = (data || []).map((row) => row.dua_id as string);
          setDbFavorites(ids);
          setLocalFavorites(ids);
        }
      } catch (err) {
        console.error("Failed to fetch favorite duas:", err);
        if (id === fetchId.current) setDbFavorites(null);
      } finally {
        if (id === fetchId.current) setIsLoading(false);
      }
    })();
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
        await supabase.auth.getSession();
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
