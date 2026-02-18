import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getBotnoiToken } from '../firebase/botnoi';

const SUBSCRIPTION_PACKAGE_API = 'https://api-voice-staging.botnoi.ai/api/payment/v2/get_subscription_package';

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

  const getBotnoiTokenHelper = useCallback(async () => {
    if (!user) return null;
    const firebaseToken = await user.getIdToken();
    const res = await getBotnoiToken(firebaseToken);
    if (typeof res === 'string') return res;
    if (res?.token) return res.token;
    if (res?.access_token) return res.access_token;
    if (res?.data?.token) return res.data.token;
    return res?.data?.access_token ?? null;
  }, [user]);

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
        const token = await getBotnoiTokenHelper();
        if (!token || cancelled) return;

        const response = await fetch(SUBSCRIPTION_PACKAGE_API, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch subscription package');

        const result = await response.json();

        if (!cancelled) {
          const data = result?.data ?? result;
          if (Array.isArray(data)) {
            const match = data.find(
              (p) => String(p?.sub_id ?? p?.id ?? '') === String(subId)
            );
            setPackageData(match ?? data[0] ?? null);
          } else {
            setPackageData(data ?? null);
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
  }, [user, getBotnoiTokenHelper, subId]);

  return { package: packageData, loading, error };
}
