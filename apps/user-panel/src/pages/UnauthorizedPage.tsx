import { useNavigate } from 'react-router';
import { useAuth } from '@company/shared-auth';
import { USER_ROUTES } from '@company/shared-config';
import { Button } from '@company/shared-ui';

export function UnauthorizedPage() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-semibold text-red-600">403</p>
        <h1 className="mt-4 text-xl font-semibold">You do not have access</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your account does not have permission to use this application.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            void (isAuthenticated ? logout() : Promise.resolve()).then(() =>
              navigate(USER_ROUTES.login),
            );
          }}
        >
          {isAuthenticated ? 'Sign out' : 'Go to sign in'}
        </Button>
      </div>
    </main>
  );
}
