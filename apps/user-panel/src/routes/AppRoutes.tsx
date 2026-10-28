import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute, PublicOnlyRoute } from '@company/shared-auth';
import { USER_ROUTES } from '@company/shared-config';
import { Loader } from '@company/shared-ui';
import { UserLayout } from '../layouts/UserLayout';
import { AccountSettingsPage } from '../pages/AccountSettingsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

const fallback = <Loader fullPage label="Checking your session" />;

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={USER_ROUTES.login}
        element={
          <PublicOnlyRoute redirectTo={USER_ROUTES.dashboard} fallback={fallback}>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['user']}
            loginPath={USER_ROUTES.login}
            unauthorizedPath={USER_ROUTES.unauthorized}
            fallback={fallback}
          />
        }
      >
        <Route element={<UserLayout />}>
          <Route index element={<Navigate to={USER_ROUTES.dashboard} replace />} />
          <Route path={USER_ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={USER_ROUTES.products} element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path={USER_ROUTES.profile} element={<ProfilePage />} />
          <Route path={USER_ROUTES.settings} element={<AccountSettingsPage />} />
        </Route>
      </Route>
      <Route path={USER_ROUTES.unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
