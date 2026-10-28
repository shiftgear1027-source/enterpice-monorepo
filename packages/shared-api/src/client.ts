import axios, { type AxiosRequestConfig } from 'axios';
import { API_CONFIG, type ApiConfig } from '@company/shared-config';
import type { ApiResponse } from '@company/shared-types';
import { toApiError } from './errors';
import { createMockAdapter } from './mock/adapter';

type TokenProvider = () => string | null | undefined;
type UnauthorizedHandler = (error: ReturnType<typeof toApiError>) => void;

let tokenProvider: TokenProvider = () => null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Lets the auth package supply a bearer token without shared-api depending on it. */
export function setTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

/** Called on any 401 response (except login attempts) so the auth layer can clear its session. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: '',
  timeout: API_CONFIG.timeoutMs,
  // Sends the httpOnly session cookie when talking to a real backend (preferred production auth).
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenProvider();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    const url = (error as { config?: { url?: string } }).config?.url ?? '';
    if (apiError.status === 401 && !url.includes(API_CONFIG.endpoints.auth.login)) {
      unauthorizedHandler?.(apiError);
    }
    return Promise.reject(apiError);
  },
);

/** Call once at app start-up with values from `createEnv()`. */
export function configureApi(config: Partial<ApiConfig>): void {
  if (config.baseURL !== undefined) api.defaults.baseURL = config.baseURL;
  if (config.timeoutMs !== undefined) api.defaults.timeout = config.timeoutMs;
  if (config.useMock !== undefined) {
    api.defaults.adapter = config.useMock ? createMockAdapter() : undefined;
  }
}

/** Typed request helper: unwraps the `ApiResponse<T>` envelope and returns `data`. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<ApiResponse<T>>(config);
  return response.data.data;
}
