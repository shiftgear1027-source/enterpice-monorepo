import type { Permission, User, UserRole } from '@company/shared-types';

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  admin: ['users:read', 'users:write', 'users:delete', 'settings:write', 'products:read'],
  user: ['products:read'],
};

export function hasRole(user: User | null | undefined, roles: readonly UserRole[]): boolean {
  return !!user && roles.includes(user.role);
}

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  return !!user && ROLE_PERMISSIONS[user.role].includes(permission);
}
