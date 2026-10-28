export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type Permission =
  'users:read' | 'users:write' | 'users:delete' | 'settings:write' | 'products:read';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: Permission[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  createdAt: string;
}

/** Envelope returned by every successful API call. */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta extends PaginationParams {
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

/** `accessToken` is optional: with cookie-based auth the server sets an httpOnly cookie instead. */
export interface AuthSession {
  user: User;
  accessToken?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

/** Normalised error shape used across all applications. */
export interface ApiErrorBody {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type CreateUserInput = Pick<User, 'name' | 'email' | 'role' | 'status'>;
export type UpdateUserInput = Partial<CreateUserInput>;
