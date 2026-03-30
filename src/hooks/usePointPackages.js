import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useDataCache } from "./useDataCache.js";
import { getPackages } from "../firebase/voiceApi.js";
import { getUserBotnoiToken } from "../utils/botnoiToken.js";

const POINT_PACKAGES_CACHE_KEY = "packages:points";
const POINT_PACKAGES_TTL_MS = 10 * 60 * 1000;

export function usePointPackages() {
  const { user } = useContext(AuthContext);
  const { fetchWithCache } = useDataCache();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      if (!user) {
        setPackages([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithCache({
          cacheKey: POINT_PACKAGES_CACHE_KEY,
          ttlMs: POINT_PACKAGES_TTL_MS,
          fetcher: () =>
            (async () => {
              const token = await getUserBotnoiToken(user);
              if (!token) {
                throw new Error("Failed to retrieve Botnoi authentication token.");
              }

              return await getPackages(token);
            })(),
        });

        if (!cancelled) {
          setPackages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch packages");
          setPackages([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, [fetchWithCache, user]);

  return { packages, loading, error };
}
