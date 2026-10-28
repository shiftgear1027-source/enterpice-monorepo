import type { AppEnv, AppEnvironment } from './types';

const ENVIRONMENTS: readonly AppEnvironment[] = ['development', 'staging', 'production'];

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

/**
 * Parses a raw env object (e.g. Vite's `import.meta.env`) into a typed config.
 * Shared packages stay free of bundler-specific globals; each app passes its env in.
 */
export function createEnv(raw: Record<string, unknown>): AppEnv {
  const appEnv = asString(raw.VITE_APP_ENV, 'development');
  return {
    apiBaseUrl: asString(raw.VITE_API_BASE_URL, 'http://localhost:3000/api'),
    appName: asString(raw.VITE_APP_NAME, 'Application'),
    appEnv: (ENVIRONMENTS as readonly string[]).includes(appEnv)
      ? (appEnv as AppEnvironment)
      : 'development',
    useMockApi: asString(raw.VITE_USE_MOCK_API, 'true') !== 'false',
  };
}
