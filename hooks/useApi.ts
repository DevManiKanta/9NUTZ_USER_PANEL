// Frontend/hooks/useApi.ts
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * useApi - generic hook for fetching data
 * 
 * @param apiFunc - your API function from lib/api.ts
 * @param args - arguments for that function (excluding token)
 * @param needsAuth - if true, will automatically pass token
 */
export function useApi<T>(
  apiFunc: (...args: any[]) => Promise<T>,
  args: any[] = [],
  needsAuth = false
) {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let result: T;
        if (needsAuth) {
          if (!token) throw new Error('Not authenticated');
          result = await apiFunc(...args, token);
        } else {
          result = await apiFunc(...args);
        }
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [apiFunc, JSON.stringify(args), needsAuth, token]);

  return { data, loading, error };
}

export default useApi;
