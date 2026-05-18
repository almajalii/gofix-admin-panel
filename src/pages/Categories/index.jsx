import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ConfirmModal } from '../../components/molecules/ConfirmModal';
import { IconPlus, IconEdit, IconTrash } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';

function CategoryModal({ initial, onClose, onSave, loading }) {
  const [name, setName] = useState(initial?.name || '');
  const [nameAr, setNameAr] = useState(initial?.nameAr || '');

  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div className="gx-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: 360 }}>
        <div className="gx-modal-title">{initial ? 'Edit category' : 'Add category'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Name (English) *</label>
            <input className="gx-input" placeholder="e.g. Plumbing" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Name (Arabic)</label>
            <input className="gx-input" placeholder="e.g. سباكة" value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" />
          </div>
        </div>
        <div className="gx-modal-actions">
          <button className="gx-btn gx-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="gx-btn gx-btn-primary" onClick={() => onSave({ name: name.trim(), nameAr: nameAr.trim() })} disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : initial ? 'Save changes' : 'Add category'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const { categories, loading, actionLoading, handleCreate, handleUpdate, handleDelete } = useCategories();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleSave(data) {
    const ok = editTarget ? await handleUpdate(editTarget.id, data) : await handleCreate(data);
    if (ok) { setShowAdd(false); setEditTarget(null); }
  }

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Categories</h1>
          <div className="gx-page-subtitle">Service categories available on GoFix.</div>
        </div>
        <div className="gx-page-actions">
          <button className="gx-btn gx-btn-primary" onClick={() => setShowAdd(true)}>
            <IconPlus /> Add category
          </button>
        </div>
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories yet" desc="Add your first service category to get started." />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Name (Arabic)</th><th></th></tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <TableRow key={cat.id}>
                    <td className="gx-muted" style={{ width: 48 }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                    <td className="gx-muted" dir="rtl" style={{ textAlign: 'right' }}>{cat.nameAr || '—'}</td>
                    <td>
                      <div className="gx-row-actions">
                        <button className="gx-btn gx-btn-ghost gx-btn-sm" onClick={() => setEditTarget(cat)}><IconEdit /> Edit</button>
                        <button className="gx-btn gx-btn-danger-soft gx-btn-sm" onClick={() => setDeleteTarget(cat)}><IconTrash /> Delete</button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showAdd || editTarget) && (
        <CategoryModal
          initial={editTarget}
          onClose={() => { setShowAdd(false); setEditTarget(null); }}
          onSave={handleSave}
          loading={actionLoading}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete category"
          message={`Are you sure you want to delete <b>${deleteTarget.name}</b>? This action cannot be undone.`}
          confirmLabel="Delete"
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => { const ok = await handleDelete(deleteTarget.id); if (ok) setDeleteTarget(null); }}
          loading={actionLoading}
        />
      )}
    </div>
  );
}