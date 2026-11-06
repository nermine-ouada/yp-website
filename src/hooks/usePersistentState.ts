"use client";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

// State mirrored to localStorage. When storage is blocked (private mode,
// disabled cookies) values live in memory for the session instead.
const memory = new Map<string, string>();
const EVENT = "persistent-state";
const SERVER = "\u0000server";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * `initial` is used when nothing is stored yet. `serverValue` (defaults to
 * `initial`) is what the server renders, before the browser's value is known.
 */
export function usePersistentState<T>(key: string, initial: T, serverValue: T = initial) {
  // Frozen on first render, so a new [] literal each render is not a "change".
  const [fallback] = useState(() => ({ initial, serverValue }));
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => SERVER
  );
  const value = useMemo(
    () => (raw === SERVER ? fallback.serverValue : parse(raw, fallback.initial)),
    [raw, fallback]
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = parse(read(key), fallback.initial);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      const json = JSON.stringify(resolved);
      memory.set(key, json);
      try {
        localStorage.setItem(key, json);
      } catch {
        /* storage blocked: the in-memory copy is enough for this session */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key, fallback]
  );

  return [value, setValue] as const;
}
