import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getBotnoiToken } from '../firebase/botnoi';

export const useAddOnPackages = (filterDisplayName = null) => {
  const [packages, setPackages] = useState([]);
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
    if (res?.data?.access_token) return res.data.access_token;
    if (typeof res?.data === 'string') return res.data; // 👈 ADD THIS
    return null;
  }, [user]);

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
        const token = await getBotnoiTokenHelper();
        if (!token || cancelled) return;

        const response = await fetch(
          'https://api-voice-staging.botnoi.ai/api/payment/v2/get_all_package_add_on',
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

        const result = await response.json();
        
        if (!cancelled) {
          let packageList = result.data || [];
          
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
  }, [user, getBotnoiTokenHelper, filterDisplayName]);

  return { packages, loading, error };
};
