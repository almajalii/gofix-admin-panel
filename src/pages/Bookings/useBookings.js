import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getBookings } from '../../network/api/admin/bookings';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getBookings()
      .then(setBookings)
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const reportedCount = useMemo(
    () => bookings.filter((b) => b.isReported || b.reported || b.hasReport).length,
    [bookings]
  );

  const filtered = useMemo(() => {
    let arr = bookings;
    if (status !== 'All') arr = arr.filter((b) => b.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (b) =>
          (b.customerName || b.customer?.name || '').toLowerCase().includes(q) ||
          (b.professionalName || b.professional?.name || '').toLowerCase().includes(q) ||
          (b.serviceName || b.service || '').toLowerCase().includes(q)
      );
    }
    return [...arr].sort((a, b) => new Date(b.scheduledAt || b.date || 0) - new Date(a.scheduledAt || a.date || 0));
  }, [bookings, status, search]);

  return { bookings, filtered, loading, reportedCount, status, setStatus, search, setSearch };
}
