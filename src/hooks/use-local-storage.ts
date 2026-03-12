"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * Custom event name for cross-hook sync within the same tab.
 * The native "storage" event only fires across tabs.
 */
const LOCAL_STORAGE_CHANGE = "local-storage-change";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
    setIsLoaded(true);
  }, [key]);

  // Sync across multiple hook instances in the same tab
  useEffect(() => {
    function handleSync(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) {
        setStoredValue(detail.newValue);
      }
    }
    window.addEventListener(LOCAL_STORAGE_CHANGE, handleSync);
    return () => window.removeEventListener(LOCAL_STORAGE_CHANGE, handleSync);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
          // Notify other hook instances in the same tab
          window.dispatchEvent(
            new CustomEvent(LOCAL_STORAGE_CHANGE, { detail: { key, newValue } })
          );
        } catch (error) {
          console.error("Error writing localStorage:", error);
        }
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue, isLoaded];
}
