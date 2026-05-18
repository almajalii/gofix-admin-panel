import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getReports } from '../../network/api/admin/reports';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getReports()
      .then(setReports)
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading };
}
