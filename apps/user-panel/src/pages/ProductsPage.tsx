import { useCallback, useState } from 'react';
import { productsApi } from '@company/shared-api';
import { APP_CONSTANTS } from '@company/shared-config';
import { useAsync, useDebounce, usePagination } from '@company/shared-hooks';
import { Alert, Card, Input, Loader, PageHeader, Pagination, Select } from '@company/shared-ui';
import { ProductCard } from '../features/products/ProductCard';

const categories = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'Travel', label: 'Travel' },
];

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debounced = useDebounce(search, APP_CONSTANTS.searchDebounceMs);
  const [total, setTotal] = useState(0);
  const pagination = usePagination({ pageSize: 6, total });
  const { page, pageSize, goTo, reset } = pagination;

  const load = useCallback(
    () =>
      productsApi.list({ page, pageSize, search: debounced, category }).then((result) => {
        setTotal(result.meta.total);
        return result;
      }),
    [page, pageSize, debounced, category],
  );
  const { data, loading, error } = useAsync(load);

  return (
    <>
      <PageHeader title="Products" description="Everything currently in stock." />
      <div className="mb-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <Input
          aria-label="Search products"
          placeholder="Search products"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            reset();
          }}
        />
        <Select
          aria-label="Category"
          placeholder="All categories"
          options={categories}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            reset();
          }}
        />
      </div>
      {error && (
        <Alert tone="danger" title="Could not load products" className="mb-4">
          {error}
        </Alert>
      )}
      {loading && !data ? (
        <Loader label="Loading products" />
      ) : data && data.items.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            No products match your filters. Try clearing the search.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={goTo}
        />
      </div>
    </>
  );
}
