import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getReviews, deleteReview } from '../network/api/admin/reviews';

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchReviews = useCallback(() => {
    setLoading(true);
    getReviews()
      .then(setReviews)
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const filtered = reviews.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.customerName || r.customer?.name || '').toLowerCase().includes(q) ||
      (r.professionalName || r.professional?.name || '').toLowerCase().includes(q) ||
      (r.comment || r.body || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review deleted');
      return true;
    } catch {
      toast.error('Failed to delete review');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    reviews,
    filtered,
    loading,
    actionLoading,
    search, setSearch,
    handleDelete,
  };
}
