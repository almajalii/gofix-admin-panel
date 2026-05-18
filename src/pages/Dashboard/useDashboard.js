import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStats } from '../../network/api/admin/stats';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
