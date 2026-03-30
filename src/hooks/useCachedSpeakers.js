import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useDataCache } from "./useDataCache.js";
import { getAllSpeakers } from "../firebase/voiceApi.js";
import { getUserBotnoiToken } from "../utils/botnoiToken.js";

const SPEAKERS_CACHE_KEY = "speakers:en-my";
const SPEAKERS_TTL_MS = 15 * 60 * 1000;

export function useCachedSpeakers() {
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
          cacheKey: SPEAKERS_CACHE_KEY,
          ttlMs: SPEAKERS_TTL_MS,
          fetcher: () =>
            (async () => {
              const token = await getUserBotnoiToken(user);
              if (!token) {
                throw new Error("Failed to retrieve Botnoi authentication token.");
              }

              return await getAllSpeakers(token, ["en", "my"]);
            })(),
        });

        if (!cancelled) {
          setSpeakers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching speakers:", err);
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
