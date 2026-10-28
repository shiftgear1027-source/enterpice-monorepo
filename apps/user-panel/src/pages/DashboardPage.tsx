import { useCallback } from 'react';
import { Link } from 'react-router';
import { productsApi } from '@company/shared-api';
import { useAuth } from '@company/shared-auth';
import { USER_ROUTES } from '@company/shared-config';
import { useAsync } from '@company/shared-hooks';
import { Alert, Button, Loader, PageHeader } from '@company/shared-ui';
import { formatDate } from '@company/shared-utils';
import { ProductCard } from '../features/products/ProductCard';

export function DashboardPage() {
  const { user } = useAuth();
  const load = useCallback(() => productsApi.list({ page: 1, pageSize: 3 }), []);
  const { data, loading, error } = useAsync(load);

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name.split(' ')[0] ?? 'there'}`}
        description={user ? `Member since ${formatDate(user.createdAt)}` : undefined}
        actions={
          <Link to={USER_ROUTES.products}>
            <Button>Browse products</Button>
          </Link>
        }
      />
      <h2 className="mb-4 text-lg font-semibold">New arrivals</h2>
      {error && (
        <Alert tone="danger" title="Could not load products">
          {error}
        </Alert>
      )}
      {loading && !data ? (
        <Loader label="Loading products" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
