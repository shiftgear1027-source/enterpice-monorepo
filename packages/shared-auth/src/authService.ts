import {
  ApiError,
  authApi,
  setTokenProvider,
  setUnauthorizedHandler,
  toApiError,
} from '@company/shared-api';
import type { LoginCredentials, User, UserRole } from '@company/shared-types';
import { useAuthStore } from './authStore';
import { tokenStorage } from './tokenStorage';

setTokenProvider(() => tokenStorage.get());
// Any 401 from the API means the session is gone: reset client auth state.
setUnauthorizedHandler(() => {
  tokenStorage.clear();
  useAuthStore.getState().clear();
});

export interface LoginOptions {
  /** Reject sessions whose role is not in this list (e.g. an admin-only app). */
  allowedRoles?: readonly UserRole[];
}

/**
 * INTEGRATION POINT: `authApi.login` calls POST /auth/login. With a real backend, have it set an
 * httpOnly session cookie and return only `{ user }`.
 */
export async function login(
  credentials: LoginCredentials,
  options: LoginOptions = {},
): Promise<User> {
  try {
    const session = await authApi.login(credentials);
    if (options.allowedRoles && !options.allowedRoles.includes(session.user.role)) {
      await authApi.logout().catch(() => undefined);
      throw new ApiError({
        status: 403,
        code: 'WRONG_APP',
        message: 'This account cannot sign in to this application.',
      });
    }
    tokenStorage.set(session.accessToken);
    useAuthStore.getState().setUser(session.user);
    return session.user;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await authApi.logout();
  } catch {
    /* clear local state even if the server call fails */
  } finally {
    tokenStorage.clear();
    useAuthStore.getState().clear();
  }
}

/** Restores a session on page load (cookie-based: GET /auth/me). */
export async function restoreSession(): Promise<void> {
  const store = useAuthStore.getState();
  if (store.status !== 'idle') return;
  store.setStatus('loading');
  try {
    const session = await authApi.me();
    tokenStorage.set(session.accessToken);
    useAuthStore.getState().setUser(session.user);
  } catch {
    useAuthStore.getState().clear();
  }
}
