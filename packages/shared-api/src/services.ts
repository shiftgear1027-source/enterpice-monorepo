import { API_CONFIG } from '@company/shared-config';
import type {
  AuthSession,
  CreateUserInput,
  LoginCredentials,
  PaginatedResponse,
  PaginationParams,
  Product,
  UpdateUserInput,
  User,
} from '@company/shared-types';
import { request } from './client';

const { auth, users, products } = API_CONFIG.endpoints;

export interface ListQuery extends Partial<PaginationParams> {
  search?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    request<AuthSession>({ method: 'POST', url: auth.login, data: credentials }),
  logout: () => request<null>({ method: 'POST', url: auth.logout }),
  me: () => request<AuthSession>({ method: 'GET', url: auth.me }),
};

export const usersApi = {
  list: (params?: ListQuery) =>
    request<PaginatedResponse<User>>({ method: 'GET', url: users, params }),
  get: (id: string) => request<User>({ method: 'GET', url: `${users}/${id}` }),
  create: (input: CreateUserInput) => request<User>({ method: 'POST', url: users, data: input }),
  update: (id: string, input: UpdateUserInput) =>
    request<User>({ method: 'PATCH', url: `${users}/${id}`, data: input }),
  remove: (id: string) => request<null>({ method: 'DELETE', url: `${users}/${id}` }),
};

export const productsApi = {
  list: (params?: ListQuery & { category?: string }) =>
    request<PaginatedResponse<Product>>({ method: 'GET', url: products, params }),
  get: (id: string) => request<Product>({ method: 'GET', url: `${products}/${id}` }),
};
