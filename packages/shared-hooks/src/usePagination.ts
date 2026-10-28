import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  total?: number;
}

export function usePagination({
  initialPage = 1,
  pageSize = 10,
  total = 0,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const goTo = useCallback((next: number) => setPage(Math.max(1, next)), []);
  const next = useCallback(() => setPage((p) => p + 1), []);
  const previous = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return useMemo(
    () => ({
      page: currentPage,
      pageSize,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
      goTo,
      next,
      previous,
      reset,
    }),
    [currentPage, pageSize, totalPages, goTo, next, previous, reset],
  );
}
