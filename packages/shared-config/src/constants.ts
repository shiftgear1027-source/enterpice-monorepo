export const APP_CONSTANTS = {
  companyName: 'Company',
  defaultPageSize: 8,
  pageSizeOptions: [8, 16, 24] as const,
  toastDurationMs: 4000,
  searchDebounceMs: 300,
} as const;

export const API_CONFIG = {
  timeoutMs: 15_000,
  endpoints: {
    auth: { login: '/auth/login', logout: '/auth/logout', me: '/auth/me' },
    users: '/users',
    products: '/products',
  },
} as const;

export const STORAGE_KEYS = {
  settings: 'company.settings',
  sidebarCollapsed: 'company.sidebarCollapsed',
} as const;
