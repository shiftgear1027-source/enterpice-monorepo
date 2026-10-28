export const ADMIN_ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
  userCreate: '/users/new',
  userEdit: (id: string) => `/users/${id}/edit`,
  profile: '/profile',
  settings: '/settings',
  unauthorized: '/unauthorized',
} as const;

export const USER_ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  products: '/products',
  productDetails: (id: string) => `/products/${id}`,
  unauthorized: '/unauthorized',
} as const;
