"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DeviceOrientationState {
  heading: number | null;
  isSupported: boolean;
  permissionState: "prompt" | "granted" | "denied" | "unsupported";
  requestPermission: () => Promise<void>;
}

// Smoothing factor for low-pass filter (0 = no smoothing, 1 = max smoothing)
const SMOOTHING_FACTOR = 0.3;

export function useDeviceOrientation(): DeviceOrientationState {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const lastHeading = useRef<number | null>(null);
  const listening = useRef(false);

  // Check support on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasDeviceOrientation = "DeviceOrientationEvent" in window;
    setIsSupported(hasDeviceOrientation);

    if (!hasDeviceOrientation) {
      setPermissionState("unsupported");
      return;
    }

    // On non-iOS devices, check if we can just listen directly
    const needsPermission =
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === "function";

    if (!needsPermission) {
      // Non-iOS: try to start listening immediately
      setPermissionState("granted");
    }
  }, []);

  const smoothHeading = useCallback((raw: number): number => {
    if (lastHeading.current === null) {
      lastHeading.current = raw;
      return raw;
    }

    // Handle wrapping around 360/0 boundary
    let diff = raw - lastHeading.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const smoothed =
      ((lastHeading.current + diff * (1 - SMOOTHING_FACTOR)) + 360) % 360;
    lastHeading.current = smoothed;
    return smoothed;
  }, []);

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android (alpha is 0-360 counterclockwise)
      let compassHeading: number | null = null;

      if ("webkitCompassHeading" in event) {
        compassHeading = (event as DeviceOrientationEvent & { webkitCompassHeading: number })
          .webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android: alpha is the compass heading but measured counterclockwise
        compassHeading = (360 - event.alpha) % 360;
      }

      if (compassHeading !== null && !isNaN(compassHeading)) {
        setHeading(smoothHeading(compassHeading));
      }
    },
    [smoothHeading]
  );

  // Start listening when permission is granted
  useEffect(() => {
    if (permissionState !== "granted" || listening.current) return;

    listening.current = true;
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      listening.current = false;
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [permissionState, handleOrientation]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;

    const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DeviceOrientationEventTyped.requestPermission === "function") {
      try {
        const permission = await DeviceOrientationEventTyped.requestPermission();
        if (permission === "granted") {
          setPermissionState("granted");
        } else {
          setPermissionState("denied");
        }
      } catch {
        setPermissionState("denied");
      }
    } else {
      // Non-iOS: just grant
      setPermissionState("granted");
    }
  }, []);

  return {
    heading,
    isSupported,
    permissionState,
    requestPermission,
  };
}
