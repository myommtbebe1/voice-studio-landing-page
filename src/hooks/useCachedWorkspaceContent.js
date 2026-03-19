import { useState, useEffect } from 'react';
import { useDataCache } from './useDataCache.js';
import { getWorkspaceContent as getWorkspaceContentAPI } from '../firebase/voiceApi.js';

const WORKSPACE_CONTENT_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches workspace content with caching.
 * @param {string} bnToken - Botnoi authentication token
 * @param {string} workspaceId - Workspace ID to fetch
 * @returns {{ data: object|null, loading: boolean, error: string|null }}
 */
export function useCachedWorkspaceContent(bnToken, workspaceId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithCache } = useDataCache();

  useEffect(() => {
    if (!bnToken || !workspaceId) {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;

    async function fetch() {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchWithCache({
          cacheKey: `workspace:${workspaceId}`,
          ttlMs: WORKSPACE_CONTENT_TTL_MS,
          fetcher: () =>
            getWorkspaceContentAPI(bnToken, workspaceId),
        });

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching workspace content:', err);
        if (!cancelled) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [fetchWithCache, bnToken, workspaceId]);

  return { data, loading, error };
}
