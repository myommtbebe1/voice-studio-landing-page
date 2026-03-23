import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useDataCache } from './useDataCache.js';
import { getUserBotnoiToken } from '../utils/botnoiToken.js';

const ADD_ON_PACKAGES_TTL_MS = 10 * 60 * 1000;
const VOICE_API_ORIGIN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VOICE_API_BASE_URL
    ? String(import.meta.env.VITE_VOICE_API_BASE_URL).replace(/\/$/, '')
    : 'https://api-voice.botnoi.ai');

export const useAddOnPackages = (filterDisplayName = null) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { fetchWithCache } = useDataCache();

  useEffect(() => {
    let cancelled = false;

    const getErrorMessage = async (response) => {
      try {
        const data = await response.json();
        return (
          data?.message ??
          data?.error ??
          data?.data?.message ??
          data?.data?.error ??
          `Failed to fetch packages (${response.status})`
        );
      } catch {
        return `Failed to fetch packages (${response.status})`;
      }
    };

    async function fetchAddOnPackages() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchWithCache({
          cacheKey: 'packages:add-ons',
          ttlMs: ADD_ON_PACKAGES_TTL_MS,
          fetcher: () =>
            (async () => {
              const token = await getUserBotnoiToken(user);
              if (!token) {
                throw new Error('Failed to retrieve Botnoi authentication token.');
              }

              const response = await fetch(
                `${VOICE_API_ORIGIN}/api/payment/v2/get_all_package_add_on`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (!response.ok) {
                throw new Error(await getErrorMessage(response));
              }

              const payload = await response.json();
              return payload.data || [];
            })(),
        });
        
        if (!cancelled) {
          let packageList = Array.isArray(result) ? result : [];
          
          // Filter by display_name if provided
          if (filterDisplayName) {
            packageList = packageList.filter(
              pkg => pkg.display_name === filterDisplayName
            );
          }
          
          setPackages(packageList);
        }
      } catch (err) {
        console.error('Error fetching add-on packages:', err);
        if (!cancelled) {
          setError(err.message);
          setPackages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAddOnPackages();
    return () => { cancelled = true; };
  }, [fetchWithCache, filterDisplayName, user]);

  return { packages, loading, error };
};
