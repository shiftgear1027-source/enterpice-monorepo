import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import type { UserRole } from '@company/shared-types';
import { useAuth } from './useAuth';

export interface ProtectedRouteProps {
  /** Roles allowed to see the nested routes. Omit to allow any signed-in user. */
  allowedRoles?: readonly UserRole[];
  loginPath: string;
  unauthorizedPath: string;
  /** Shown while the session is being restored. */
  fallback?: ReactNode;
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  loginPath,
  unauthorizedPath,
  fallback = null,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) return <>{fallback}</>;
  if (!isAuthenticated)
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to={unauthorizedPath} replace />;
  return <>{children ?? <Outlet />}</>;
}

/** Keeps signed-in users away from the login page. */
export function PublicOnlyRoute({
  redirectTo,
  fallback = null,
  children,
}: {
  redirectTo: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <>{fallback}</>;
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <>{children}</>;
}
