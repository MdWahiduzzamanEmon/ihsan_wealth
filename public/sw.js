// Change this version on every deploy to trigger SW update
const SW_VERSION = "mmwyjd6r";
const CACHE_NAME = "ihsanwealth-v" + SW_VERSION;

self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/favicon.svg", "/logo.svg", "/manifest.json"])
    )
  );
});

self.addEventListener("activate", (event) => {
  // Delete all old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle http/https requests - ignore chrome-extension://, etc.
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Never cache Supabase API requests (auth, DB queries, etc.)
  if (url.hostname.includes("supabase")) return;

  // Network-first for all page navigations and API calls
  // This ensures users always get the latest code
  if (event.request.mode === "navigate" || url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Network-first for JS/CSS bundles (Next.js _next/ files)
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first only for truly static assets (images, fonts, icons)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
