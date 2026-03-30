import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useDataCache } from './useDataCache.js';
import { getUserBotnoiToken } from '../utils/botnoiToken.js';

const SUBSCRIPTION_PACKAGE_API =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VOICE_API_BASE_URL
    ? String(import.meta.env.VITE_VOICE_API_BASE_URL).replace(/\/$/, '')
    : 'https://api-voice.botnoi.ai') + '/api/payment/v2/get_subscription_package';
const SUBSCRIPTION_PACKAGE_TTL_MS = 10 * 60 * 1000;

/**
 * Fetches a single subscription package by sub_id (e.g. 38 for Starter).
 * @param {number|string} subId - Subscription package ID (e.g. 38)
 * @returns {{ package: object|null, loading: boolean, error: string|null }}
 */
export function useSubscriptionPackage(subId) {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { fetchWithCache } = useDataCache();

  useEffect(() => {
    if (subId == null || subId === '') {
      setLoading(false);
      setPackageData(null);
      return;
    }

    let cancelled = false;

    async function fetchSubscriptionPackage() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchWithCache({
          cacheKey: `packages:subscription:${subId}`,
          ttlMs: SUBSCRIPTION_PACKAGE_TTL_MS,
          fetcher: () =>
            (async () => {
              const token = await getUserBotnoiToken(user);
              if (!token) {
                throw new Error('Failed to retrieve Botnoi authentication token.');
              }

              const url = `${SUBSCRIPTION_PACKAGE_API}?sub_id=${encodeURIComponent(subId)}`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) throw new Error('Failed to fetch subscription package');

              return await response.json();
            })(),
        });

        if (!cancelled) {
          const data = result?.data ?? result;
          const subIdStr = String(subId);

          const findById = (obj) =>
            obj && String(obj?.sub_id ?? obj?.id ?? '') === subIdStr;

          if (Array.isArray(data)) {
            const match = data.find(findById);
            setPackageData(match ?? data[0] ?? null);
          } else if (data && typeof data === 'object') {
            if (findById(data)) {
              setPackageData(data);
            } else {
              const values = Object.values(data);
              const match = values.find(
                (v) => v && typeof v === 'object' && findById(v)
              );
              setPackageData(match ?? data ?? null);
            }
          } else {
            setPackageData(null);
          }
        }
      } catch (err) {
        console.error('Error fetching subscription package:', err);
        if (!cancelled) {
          setError(err.message);
          setPackageData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSubscriptionPackage();
    return () => { cancelled = true; };
  }, [fetchWithCache, subId, user]);

  return { package: packageData, loading, error };
}
