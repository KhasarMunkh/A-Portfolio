// lib/hooks/usePersistentStore.ts
"use client";

export function createPersistentStore<T>(
  key: string,
  defaultValue: T,
  validValues?: readonly T[],
) {
  let currentValue: T = defaultValue;
  const listeners = new Set<() => void>();

  const isValid = (value: T) => !validValues || validValues.includes(value);

  // Initialize from localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValid(parsed)) currentValue = parsed;
      }
    } catch {}

    // Listen for cross-tab changes
    window.addEventListener("storage", (e) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (isValid(parsed)) {
            currentValue = parsed;
            listeners.forEach((l) => l());
          }
        } catch {}
      }
    });
  }

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => currentValue,
    getServerSnapshot: () => defaultValue,
    set: (value: T) => {
      if (!isValid(value)) return;
      currentValue = value;
      localStorage.setItem(key, JSON.stringify(value));
      listeners.forEach((l) => l());
    },
  };
}
