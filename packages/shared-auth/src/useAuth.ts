import { useEffect } from 'react';
import type { UserRole } from '@company/shared-types';
import { login, logout, restoreSession } from './authService';
import { useAuthStore } from './authStore';
import { hasRole } from './rbac';

/** Call once near the app root to restore the session on first load. */
export function useAuthBootstrap(): void {
  useEffect(() => {
    void restoreSession();
  }, []);
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  return {
    user,
    status,
    isAuthenticated: status === 'authenticated' && user !== null,
    isLoading: status === 'idle' || status === 'loading',
    hasRole: (roles: readonly UserRole[]) => hasRole(user, roles),
    login,
    logout,
  };
}
