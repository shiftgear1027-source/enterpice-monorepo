import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute, PublicOnlyRoute } from '@company/shared-auth';
import { ADMIN_ROUTES } from '@company/shared-config';
import { Loader } from '@company/shared-ui';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { UserCreatePage } from '../pages/UserCreatePage';
import { UserEditPage } from '../pages/UserEditPage';
import { UsersPage } from '../pages/UsersPage';

const fallback = <Loader fullPage label="Checking your session" />;

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ADMIN_ROUTES.login}
        element={
          <PublicOnlyRoute redirectTo={ADMIN_ROUTES.dashboard} fallback={fallback}>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
            loginPath={ADMIN_ROUTES.login}
            unauthorizedPath={ADMIN_ROUTES.unauthorized}
            fallback={fallback}
          />
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to={ADMIN_ROUTES.dashboard} replace />} />
          <Route path={ADMIN_ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ADMIN_ROUTES.users} element={<UsersPage />} />
          <Route path={ADMIN_ROUTES.userCreate} element={<UserCreatePage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path={ADMIN_ROUTES.profile} element={<ProfilePage />} />
          <Route path={ADMIN_ROUTES.settings} element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path={ADMIN_ROUTES.unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
