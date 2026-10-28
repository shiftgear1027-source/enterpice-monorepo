import { Link } from 'react-router';
import { USER_ROUTES } from '@company/shared-config';
import type { Product } from '@company/shared-types';
import { Badge } from '@company/shared-ui';
import { formatCurrency } from '@company/shared-utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={USER_ROUTES.productDetails(product.id)}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <Badge tone="info" className="self-start">
        {product.category}
      </Badge>
      <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">
        {product.name}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold">
          {formatCurrency(product.price, product.currency)}
        </span>
        <span className="text-sm text-slate-500">★ {product.rating.toFixed(1)}</span>
      </div>
    </Link>
  );
}
