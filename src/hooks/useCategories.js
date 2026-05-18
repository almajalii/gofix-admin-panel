import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../network/api/admin/categories';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = useCallback(async (data) => {
    setActionLoading(true);
    try {
      const created = await createCategory(data);
      setCategories((prev) => [...prev, created]);
      toast.success('Category created');
      return true;
    } catch {
      toast.error('Failed to create category');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id, data) => {
    setActionLoading(true);
    try {
      const updated = await updateCategory(id, data);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      toast.success('Category updated');
      return true;
    } catch {
      toast.error('Failed to update category');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Category deleted');
      return true;
    } catch {
      toast.error('Failed to delete category');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    actionLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
