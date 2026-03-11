"use client";

import { useState, useEffect } from "react";

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem("visitor-counted");

    if (alreadyCounted) {
      // Already counted this session, just fetch current count
      fetch("/api/views")
        .then((r) => r.json())
        .then((d) => setCount(d.count))
        .catch(() => {});
    } else {
      // First visit this session, increment
      fetch("/api/views", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          setCount(d.count);
          sessionStorage.setItem("visitor-counted", "1");
        })
        .catch(() => {});
    }
  }, []);

  return count;
}
