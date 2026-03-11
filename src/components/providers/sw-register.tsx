"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60 * 1000);

        // When a new SW is found and installed, activate it immediately
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // New SW is active and ready — reload to get fresh code
            if (
              newWorker.state === "activated" &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed silently
      });

    // Also handle the case where a new SW takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  return null;
}
