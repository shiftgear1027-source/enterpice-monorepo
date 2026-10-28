import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiErrorBody, PaginationMeta, User } from '@company/shared-types';
import { MOCK_CREDENTIALS, createProducts, createUsers } from './data';

/**
 * In-browser mock backend implemented as an Axios adapter.
 * INTEGRATION POINT: set VITE_USE_MOCK_API=false and point VITE_API_BASE_URL at the real API.
 * The request/response shapes below are the contract the real backend should honour.
 */

// Simulates a server-side session cookie so a page refresh keeps you signed in.
// A real backend sets an httpOnly cookie; JavaScript must never read or write it.
const SESSION_KEY = 'mock.session';
const LATENCY_MS = 250;

function readSession(): string | null {
  try {
    return globalThis.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
function writeSession(userId: string | null): void {
  try {
    if (userId) globalThis.sessionStorage.setItem(SESSION_KEY, userId);
    else globalThis.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export function createMockAdapter(): AxiosAdapter {
  let users = createUsers();
  const products = createProducts();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const paginate = <T>(items: T[], page: number, pageSize: number) => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const meta: PaginationMeta = { page: safePage, pageSize, total, totalPages };
    return { items: items.slice((safePage - 1) * pageSize, safePage * pageSize), meta };
  };

  function currentUser(config: InternalAxiosRequestConfig): User {
    const bearer = String(config.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const userId = bearer.startsWith('mock-token-')
      ? bearer.slice('mock-token-'.length)
      : readSession();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'You need to sign in to continue.');
    return user;
  }

  function requireAdmin(config: InternalAxiosRequestConfig): User {
    const user = currentUser(config);
    if (user.role !== 'admin')
      throw new HttpError(403, 'FORBIDDEN', 'You do not have permission to do that.');
    return user;
  }

  function handle(config: InternalAxiosRequestConfig): {
    status: number;
    data: unknown;
    message?: string;
  } {
    const method = (config.method ?? 'get').toUpperCase();
    const path = (config.url ?? '').split('?')[0] ?? '';
    const body =
      typeof config.data === 'string' && config.data
        ? (JSON.parse(config.data) as Record<string, unknown>)
        : {};
    const params = (config.params ?? {}) as Record<string, string | number | undefined>;
    const page = Number(params.page ?? 1);
    const pageSize = Number(params.pageSize ?? 8);
    const search = String(params.search ?? '')
      .trim()
      .toLowerCase();

    if (method === 'POST' && path === '/auth/login') {
      const email = String(body.email ?? '').toLowerCase();
      const entry = MOCK_CREDENTIALS[email];
      if (!entry || entry.password !== body.password) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Incorrect email or password.');
      }
      const user = users.find((u) => u.id === entry.userId);
      if (!user || user.status !== 'active')
        throw new HttpError(403, 'ACCOUNT_DISABLED', 'This account is not active.');
      writeSession(user.id);
      return { status: 200, data: { user, accessToken: `mock-token-${user.id}` } };
    }
    if (method === 'POST' && path === '/auth/logout') {
      writeSession(null);
      return { status: 200, data: null };
    }
    if (method === 'GET' && path === '/auth/me')
      return { status: 200, data: { user: currentUser(config) } };

    if (path === '/users' && method === 'GET') {
      requireAdmin(config);
      const filtered = users.filter(
        (u) => !search || `${u.name} ${u.email}`.toLowerCase().includes(search),
      );
      return { status: 200, data: paginate(filtered, page, pageSize) };
    }
    if (path === '/users' && method === 'POST') {
      requireAdmin(config);
      const email = String(body.email ?? '').toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        throw new HttpError(422, 'VALIDATION_ERROR', 'Validation failed.', {
          email: ['This email is already in use.'],
        });
      }
      const user: User = {
        id: `u-${Date.now()}`,
        name: String(body.name),
        email,
        role: body.role === 'admin' ? 'admin' : 'user',
        status: (body.status as User['status']) ?? 'active',
        createdAt: new Date().toISOString(),
      };
      users = [user, ...users];
      return { status: 201, data: user, message: 'User created' };
    }
    const userMatch = /^\/users\/([^/]+)$/.exec(path);
    if (userMatch) {
      const id = userMatch[1];
      const index = users.findIndex((u) => u.id === id);
      const isSelf = currentUser(config).id === id;
      if (method === 'GET') {
        if (!isSelf) requireAdmin(config);
        const found = users[index];
        if (!found) throw new HttpError(404, 'NOT_FOUND', 'User not found.');
        return { status: 200, data: found };
      }
      if (method === 'PATCH') {
        if (!isSelf) requireAdmin(config);
        const found = users[index];
        if (!found) throw new HttpError(404, 'NOT_FOUND', 'User not found.');
        const patch = { ...body };
        // Non-admins can never change their own role or status.
        if (currentUser(config).role !== 'admin') {
          delete patch.role;
          delete patch.status;
        }
        const updated = { ...found, ...patch } as User;
        users = users.map((u) => (u.id === id ? updated : u));
        return { status: 200, data: updated, message: 'User updated' };
      }
      if (method === 'DELETE') {
        const admin = requireAdmin(config);
        if (admin.id === id)
          throw new HttpError(409, 'CONFLICT', 'You cannot delete your own account.');
        if (index === -1) throw new HttpError(404, 'NOT_FOUND', 'User not found.');
        users = users.filter((u) => u.id !== id);
        return { status: 200, data: null, message: 'User deleted' };
      }
    }

    if (path === '/products' && method === 'GET') {
      currentUser(config);
      const category = String(params.category ?? '');
      const filtered = products.filter(
        (p) =>
          (!category || p.category === category) &&
          (!search || `${p.name} ${p.description}`.toLowerCase().includes(search)),
      );
      return { status: 200, data: paginate(filtered, page, pageSize) };
    }
    const productMatch = /^\/products\/([^/]+)$/.exec(path);
    if (productMatch && method === 'GET') {
      currentUser(config);
      const product = products.find((p) => p.id === productMatch[1]);
      if (!product) throw new HttpError(404, 'NOT_FOUND', 'Product not found.');
      return { status: 200, data: product };
    }

    throw new HttpError(404, 'NOT_FOUND', `No mock handler for ${method} ${path}`);
  }

  return async (config) => {
    await sleep(LATENCY_MS);
    const headers = new AxiosHeaders();
    try {
      const { status, data, message } = handle(config);
      return { data: { success: true, data, message }, status, statusText: 'OK', headers, config };
    } catch (error) {
      if (error instanceof HttpError) {
        const body: ApiErrorBody = {
          status: error.status,
          code: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors,
        };
        const response = {
          data: body,
          status: error.status,
          statusText: error.code,
          headers,
          config,
        };
        throw new AxiosError(error.message, String(error.status), config, null, response);
      }
      throw error;
    }
  };
}
