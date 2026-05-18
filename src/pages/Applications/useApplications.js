import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  getApplications,
  getApplicationDetail,
  approveApplication,
  rejectApplication,
} from '../../network/api/admin/application';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getApplications()
      .then(setApplications)
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = useMemo(
    () => applications.filter((a) => ['Pending', 'PendingReview'].includes(a.status)).length,
    [applications]
  );

  const filtered = useMemo(() => {
    let arr = applications;
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (a) =>
          (a.applicantName || a.name || '').toLowerCase().includes(q) ||
          (a.email || '').toLowerCase().includes(q) ||
          (a.categoryName || '').toLowerCase().includes(q)
      );
    }
    return [...arr].sort((a, b) => new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0));
  }, [applications, search]);

  const openDetail = useCallback(async (id) => {
    setDetailLoading(true);
    try {
      const data = await getApplicationDetail(id);
      setDetail(data);
    } catch {
      toast.error('Failed to load application detail');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleApprove = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await approveApplication(id);
      setApplications((prev) =>
        prev.map((a) => (a.professionalId === id || a.id === id ? { ...a, status: 'Approved' } : a))
      );
      setDetail(null);
      toast.success('Application approved');
    } catch {
      toast.error('Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleReject = useCallback(async (id, reason) => {
    setActionLoading(true);
    try {
      await rejectApplication(id, reason);
      setApplications((prev) =>
        prev.map((a) =>
          a.professionalId === id || a.id === id
            ? { ...a, status: 'Rejected', rejectionReason: reason }
            : a
        )
      );
      setDetail(null);
      toast.success('Application rejected');
    } catch {
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    applications,
    filtered,
    detail,
    loading,
    detailLoading,
    actionLoading,
    pendingCount,
    search, setSearch,
    openDetail,
    closeDetail: () => setDetail(null),
    handleApprove,
    handleReject,
  };
}