import { useState, useEffect } from 'react';
import { useDataCache } from './useDataCache.js';
import { getBotnoiToken as getBotnoiTokenAPI } from '../firebase/botnoi.js';
import { extractBotnoiToken } from '../utils/botnoiToken.js';

const BOTNOI_TOKEN_TTL_MS = 50 * 60 * 1000; // 50 minutes (tokens typically valid for 1 hour)

/**
 * Fetches and caches Botnoi authentication token from Firebase JWT.
 * Deduplicates requests per session to avoid duplicate firebase_auth calls.
 * @param {string} firebaseJwt - Firebase JWT token
 * @returns {{ token: string|null, loading: boolean, error: string|null }}
 */
export function useCachedBotnoiToken(firebaseJwt) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithCache } = useDataCache();

  useEffect(() => {
    if (!firebaseJwt) {
      setLoading(false);
      setToken(null);
      return;
    }

    let cancelled = false;

    async function fetch() {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchWithCache({
          cacheKey: 'auth:botnoi-token',
          ttlMs: BOTNOI_TOKEN_TTL_MS,
          fetcher: () => getBotnoiTokenAPI(firebaseJwt),
        });

        if (!cancelled) {
          const extracted = extractBotnoiToken(result);
          setToken(extracted);
        }
      } catch (err) {
        console.error('Error fetching Botnoi token:', err);
        if (!cancelled) {
          setError(err.message);
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [fetchWithCache, firebaseJwt]);

  return { token, loading, error };
}
