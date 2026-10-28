import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@company/shared-auth';
import { USER_ROUTES } from '@company/shared-config';
import { Alert, Button, Card, Input } from '@company/shared-ui';
import { loginSchema, type LoginFormValues } from '@company/shared-validation';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const from = (location.state as { from?: string } | null)?.from;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values, { allowedRoles: ['user'] });
      navigate(from ?? USER_ROUTES.dashboard, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    }
  });

  return (
    <main className="grid min-h-screen place-items-center bg-brand-50 p-6">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-2xl font-semibold tracking-tight text-brand-800">
          Shopfront
        </p>
        <Card>
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to browse products and manage your account.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            {error && <Alert tone="danger">{error}</Alert>}
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>
          {/* Demo only: remove together with the mock API. */}
          <Alert className="mt-6" title="Demo account">
            user@company.com / User@1234
          </Alert>
        </Card>
      </div>
    </main>
  );
}
