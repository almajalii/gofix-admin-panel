import { useState, useMemo } from 'react';

export function usePagination(items, pageSize = 20) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function goTo(n) { setPage(Math.max(1, Math.min(n, totalPages))); }
  function next()  { goTo(page + 1); }
  function prev()  { goTo(page - 1); }

  // Reset to page 1 when items change length significantly
  const reset = () => setPage(1);

  return { paged, page, totalPages, goTo, next, prev, reset };
}
