import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getBookings, cancelBooking } from '../../network/api/admin/bookings';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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

  const handleCancel = useCallback(async (bookingId, reason) => {
    setActionLoading(true);
    try {
      await cancelBooking(bookingId, reason);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
      toast.success('Booking cancelled successfully');
      return true;
    } catch {
      toast.error('Failed to cancel booking');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    bookings, filtered, loading, actionLoading,
    reportedCount, status, setStatus,
    search, setSearch, handleCancel,
  };
}