import React, { useCallback, useContext, useMemo, useRef } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { DataCacheContext } from "./dataCache.js";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function buildStorageKey(userId, cacheKey) {
  return `voice-studio-cache:${userId ?? "guest"}:${cacheKey}`;
}

export function DataCacheProvider({ children }) {
  const { user } = useContext(AuthContext);
  const memoryCacheRef = useRef(new Map());
  const inFlightRequestsRef = useRef(new Map());

  const getFreshEntry = useCallback(
    (cacheKey, ttlMs = 0) => {
      const userId = user?.uid ?? "guest";
      const memoryKey = buildStorageKey(userId, cacheKey);
      const now = Date.now();
      const memoryEntry = memoryCacheRef.current.get(memoryKey);

      if (memoryEntry && (ttlMs <= 0 || now - memoryEntry.timestamp < ttlMs)) {
        return memoryEntry;
      }

      if (!isBrowser()) {
        return null;
      }

      try {
        const rawValue = window.sessionStorage.getItem(memoryKey);
        if (!rawValue) {
          return null;
        }

        const parsed = JSON.parse(rawValue);
        if (!parsed || typeof parsed !== "object") {
          return null;
        }

        if (ttlMs > 0 && now - parsed.timestamp >= ttlMs) {
          window.sessionStorage.removeItem(memoryKey);
          return null;
        }

        memoryCacheRef.current.set(memoryKey, parsed);
        return parsed;
      } catch (error) {
        console.warn("Failed to read cached data:", error);
        return null;
      }
    },
    [user]
  );

  const setEntry = useCallback(
    (cacheKey, data, persist = true) => {
      const userId = user?.uid ?? "guest";
      const memoryKey = buildStorageKey(userId, cacheKey);
      const entry = {
        data,
        timestamp: Date.now(),
      };

      memoryCacheRef.current.set(memoryKey, entry);

      if (persist && isBrowser()) {
        try {
          window.sessionStorage.setItem(memoryKey, JSON.stringify(entry));
        } catch (error) {
          console.warn("Failed to persist cached data:", error);
        }
      }

      return entry;
    },
    [user]
  );

  const fetchWithCache = useCallback(
    async ({
      cacheKey,
      fetcher,
      ttlMs = 5 * 60 * 1000,
      persist = true,
      forceRefresh = false,
    }) => {
      if (!cacheKey || typeof fetcher !== "function") {
        throw new Error("cacheKey and fetcher are required");
      }

      const userId = user?.uid ?? "guest";
      const memoryKey = buildStorageKey(userId, cacheKey);

      if (!forceRefresh) {
        const cachedEntry = getFreshEntry(cacheKey, ttlMs);
        if (cachedEntry) {
          return cachedEntry.data;
        }
      }

      const existingRequest = inFlightRequestsRef.current.get(memoryKey);
      if (existingRequest) {
        return existingRequest;
      }

      const request = (async () => {
        const result = await fetcher();
        setEntry(cacheKey, result, persist);
        return result;
      })();

      inFlightRequestsRef.current.set(memoryKey, request);

      try {
        return await request;
      } finally {
        inFlightRequestsRef.current.delete(memoryKey);
      }
    },
    [getFreshEntry, setEntry, user]
  );

  const clearCache = useCallback(
    (cacheKey) => {
      const userId = user?.uid ?? "guest";
      const memoryKey = buildStorageKey(userId, cacheKey);
      memoryCacheRef.current.delete(memoryKey);

      if (isBrowser()) {
        window.sessionStorage.removeItem(memoryKey);
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      fetchWithCache,
      clearCache,
      getFreshEntry,
    }),
    [clearCache, fetchWithCache, getFreshEntry]
  );

  return <DataCacheContext.Provider value={value}>{children}</DataCacheContext.Provider>;
}
