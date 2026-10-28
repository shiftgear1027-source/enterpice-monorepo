import { Link } from 'react-router';
import { USER_ROUTES } from '@company/shared-config';
import { Button } from '@company/shared-ui';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-semibold text-brand-700">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or was moved.
        </p>
        <Link to={USER_ROUTES.dashboard} className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </main>
  );
}
