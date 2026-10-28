export type AppEnvironment = 'development' | 'staging' | 'production';

export interface AppEnv {
  apiBaseUrl: string;
  appName: string;
  appEnv: AppEnvironment;
  /** When true the in-browser mock API is used instead of a real backend. */
  useMockApi: boolean;
}

export interface ApiConfig {
  baseURL: string;
  timeoutMs: number;
  useMock: boolean;
}
