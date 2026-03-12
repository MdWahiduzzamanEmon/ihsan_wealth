"use client";

import { useState, useEffect, useCallback } from "react";
import type { Chapter, Verse, VersesResponse } from "@/lib/quran-config";
import { TRANSLATION_IDS } from "@/lib/quran-config";
import type { TransLang } from "@/lib/islamic-content";

const CHAPTERS_CACHE_KEY = "quran-chapters-v1";

/** Read chapters from localStorage synchronously (instant, no flicker) */
function getCachedChapters(): Chapter[] {
  try {
    const cached = localStorage.getItem(CHAPTERS_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}
  return [];
}

/** Get a single chapter from cache (for instant surah header) */
export function getChapterFromCache(surahId: number): Chapter | undefined {
  return getCachedChapters().find((c) => c.id === surahId);
}

/** Prefetch verses for a surah (call on hover for instant navigation) */
export function prefetchVerses(surahId: number, lang: TransLang) {
  const translationId = TRANSLATION_IDS[lang] || TRANSLATION_IDS.en;
  const params = new URLSearchParams({
    path: `verses/by_chapter/${surahId}`,
    translations: String(translationId),
    fields: "text_uthmani",
    per_page: "20",
    page: "1",
  });
  // Use the browser cache — just warm it up
  fetch(`/api/quran?${params}`).catch(() => {});
}

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>(getCachedChapters);
  const [loading, setLoading] = useState(() => getCachedChapters().length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have cached data, skip network fetch
    if (chapters.length > 0) return;

    fetch("/api/quran?path=chapters")
      .then((r) => r.json())
      .then((data) => {
        const ch = data.chapters || [];
        setChapters(ch);
        try {
          localStorage.setItem(CHAPTERS_CACHE_KEY, JSON.stringify(ch));
        } catch {}
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [chapters.length]);

  return { chapters, loading, error };
}

export function useVerses(surahId: number, lang: TransLang, enabled: boolean = true) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const translationId = TRANSLATION_IDS[lang] || TRANSLATION_IDS.en;

  const fetchPage = useCallback(
    async (page: number, append: boolean = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          path: `verses/by_chapter/${surahId}`,
          translations: String(translationId),
          fields: "text_uthmani",
          per_page: "20",
          page: String(page),
        });

        const res = await fetch(`/api/quran?${params}`);
        const data: VersesResponse = await res.json();

        if (append) {
          setVerses((prev) => [...prev, ...data.verses]);
        } else {
          setVerses(data.verses || []);
        }

        setCurrentPage(data.pagination.current_page);
        setTotalPages(data.pagination.total_pages);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load verses");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [surahId, translationId]
  );

  useEffect(() => {
    if (!enabled) return;
    setVerses([]);
    setCurrentPage(1);
    fetchPage(1);
  }, [fetchPage, enabled]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loadingMore) {
      fetchPage(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loadingMore, fetchPage]);

  const hasMore = currentPage < totalPages;

  return { verses, loading, loadingMore, error, currentPage, totalPages, hasMore, loadMore };
}
