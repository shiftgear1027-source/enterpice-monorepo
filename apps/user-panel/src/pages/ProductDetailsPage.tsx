import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { productsApi } from '@company/shared-api';
import { USER_ROUTES } from '@company/shared-config';
import { useAsync } from '@company/shared-hooks';
import { Alert, Badge, Button, Card, Loader, useToast } from '@company/shared-ui';
import { formatCurrency, formatDate } from '@company/shared-utils';

export function ProductDetailsPage() {
  const { id = '' } = useParams();
  const toast = useToast();
  const load = useCallback(() => productsApi.get(id), [id]);
  const { data: product, loading, error } = useAsync(load);

  if (loading && !product) return <Loader label="Loading product" />;
  if (error || !product) {
    return (
      <Alert tone="danger" title="Product not found">
        {error ?? 'This product is no longer available.'}{' '}
        <Link to={USER_ROUTES.products} className="font-medium underline">
          Back to products
        </Link>
      </Alert>
    );
  }

  return (
    <>
      <Link
        to={USER_ROUTES.products}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        ← All products
      </Link>
      <Card className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <Badge tone="info">{product.category}</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-3 text-slate-600">{product.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Rating</dt>
                <dd className="font-medium">★ {product.rating.toFixed(1)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Availability</dt>
                <dd className="font-medium">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Listed</dt>
                <dd className="font-medium">{formatDate(product.createdAt)}</dd>
              </div>
            </dl>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold">
              {formatCurrency(product.price, product.currency)}
            </p>
            <Button
              className="mt-4"
              size="lg"
              disabled={product.stock === 0}
              onClick={() => toast.success(`${product.name} added to your cart`)}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
