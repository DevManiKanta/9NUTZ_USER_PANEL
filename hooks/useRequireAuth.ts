// Frontend/hooks/useRequireAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // App Router
import { useAuth } from '../contexts/AuthContext';

type UseRequireAuthOptions = {
  redirectTo?: string;        // where to send unauthenticated users (default '/login')
  requireAdmin?: boolean;     // if true, only allow admin users
  onUnauthorized?: () => void; // optional callback when unauthorized
};

/**
 * useRequireAuth
 * Protects a page or component. If user is not authenticated (or not admin when requireAdmin=true),
 * it redirects them to `redirectTo`. Returns current user and loading for UI.
 *
 * Usage (App Router):
 *   const { user, isLoading } = useRequireAuth({ redirectTo: '/login', requireAdmin: true });
 */
export function useRequireAuth(opts: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', requireAdmin = false, onUnauthorized } = opts;
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // don't redirect while we're still checking token / loading
    if (isLoading) return;

    // not logged in -> redirect
    if (!user) {
      if (onUnauthorized) onUnauthorized();
      // navigate to login page
      router.push(redirectTo);
      return;
    }

    // if admin required but user isn't admin -> redirect or show unauthorized
    if (requireAdmin && user.role !== 'admin') {
      if (onUnauthorized) onUnauthorized();
      router.push(redirectTo);
      return;
    }
  }, [user, isLoading, requireAdmin, router, redirectTo, onUnauthorized]);

  return { user, isLoading };
}

export default useRequireAuth;