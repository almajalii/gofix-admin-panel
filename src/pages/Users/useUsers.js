import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getUsers, banUser, unbanUser } from '../../network/api/admin/users';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  
  const fetchUsers = useCallback(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const counts = useMemo(() => ({
    All:           users.length,
    Customers:     users.filter((u) => (u.role || '').toLowerCase() === 'customer').length,
    Professionals: users.filter((u) => (u.role || '').toLowerCase() === 'professional').length,
    Banned:        users.filter((u) => u.isBanned).length,
  }), [users]);

  const filtered = useMemo(() => {
    let arr = users;
    if (tab === 'Customers')     arr = arr.filter((u) => (u.role || '').toLowerCase() === 'customer');
    if (tab === 'Professionals') arr = arr.filter((u) => (u.role || '').toLowerCase() === 'professional');
    if (tab === 'Banned')        arr = arr.filter((u) => u.isBanned);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (u) =>
          (`${u.firstName || ''} ${u.lastName || ''}`.trim()).toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
      );
    }
    return [...arr].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [users, tab, search]);

  const handleBan = useCallback(async (user) => {
    setActionLoading(true);
    try {
      await banUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: true } : u))
      );
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      toast.success(`${name} has been banned`);
    } catch {
      toast.error('Failed to ban user');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleUnban = useCallback(async (user) => {
    setActionLoading(true);
    try {
      await unbanUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: false } : u))
      );
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      toast.success(`${name} has been unbanned`);
    } catch {
      toast.error('Failed to unban user');
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    users,
    filtered,
    loading,
    actionLoading,
    tab, setTab,
    search, setSearch,
    counts,
    handleBan,
    handleUnban,
  };
}
