"use client";

import { useState, useEffect, useCallback } from "react";
import type { Chapter, Verse, VersesResponse } from "@/lib/quran-config";
import { TRANSLATION_IDS } from "@/lib/quran-config";
import type { TransLang } from "@/lib/islamic-content";

const CHAPTERS_CACHE_KEY = "quran-chapters-v1";

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try localStorage cache first
    try {
      const cached = localStorage.getItem(CHAPTERS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setChapters(parsed);
        setLoading(false);
        return;
      }
    } catch {}

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
  }, []);

  return { chapters, loading, error };
}

export function useVerses(surahId: number, lang: TransLang) {
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
    setVerses([]);
    setCurrentPage(1);
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loadingMore) {
      fetchPage(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loadingMore, fetchPage]);

  const hasMore = currentPage < totalPages;

  return { verses, loading, loadingMore, error, currentPage, totalPages, hasMore, loadMore };
}
