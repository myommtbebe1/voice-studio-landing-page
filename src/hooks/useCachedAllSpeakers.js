import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useDataCache } from "./useDataCache.js";
import { getAllSpeakers } from "../firebase/voiceApi.js";
import { getUserBotnoiToken } from "../utils/botnoiToken.js";

/** Bumped when marketplace fetch semantics change (avoids stale empty sessionStorage). */
const ALL_SPEAKERS_CACHE_KEY = "speakers:all:v2";
const ALL_SPEAKERS_TTL_MS = 15 * 60 * 1000;

/**
 * Fetches and caches all speakers (no language filter) with deduplication.
 * Use this instead of calling getAllSpeakers() directly.
 */
export function useCachedAllSpeakers() {
  const { user } = useContext(AuthContext);
  const { fetchWithCache } = useDataCache();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSpeakers() {
      if (!user) {
        setSpeakers([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithCache({
          cacheKey: ALL_SPEAKERS_CACHE_KEY,
          ttlMs: ALL_SPEAKERS_TTL_MS,
          fetcher: () =>
            (async () => {
              const token = await getUserBotnoiToken(user);
              if (!token) {
                throw new Error("Failed to retrieve Botnoi authentication token.");
              }

              return await getAllSpeakers(token, []);
            })(),
        });

        if (!cancelled) {
          setSpeakers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching all speakers:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load speakers");
          setSpeakers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSpeakers();

    return () => {
      cancelled = true;
    };
  }, [fetchWithCache, user]);

  return { speakers, loading, error };
}
