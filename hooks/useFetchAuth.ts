// Frontend/hooks/useFetchAuth.ts
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * useFetchAuth
 * Returns a `call` helper that will call your API helper functions
 * and automatically pass the stored token as the last argument.
 *
 * Example:
 *   const { call } = useFetchAuth();
 *   const created = await call(createProductAPI, payload);
 *
 * Notes:
 * - apiFunc must be one of your lib/api functions that expects `token` as the last parameter.
 * - If an apiFunc expects token in a different position, call it directly and pass token yourself.
 */
export function useFetchAuth() {
  const { token } = useAuth();

  const call = useCallback(
    async (apiFunc: (...args: any[]) => Promise<any>, ...args: any[]) => {
      if (!token) {
        // nicer error to catch in UI
        const err = new Error('Not authenticated (no token). Please login.');
        (err as any).status = 401;
        throw err;
      }
      // Append token as last argument
      return apiFunc(...args, token);
    },
    [token]
  );

  return { call, token };
}

export default useFetchAuth;
