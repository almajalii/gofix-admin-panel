import { useState } from 'react';
import { dateShort } from '../../utils/formatters';
import { useReviews } from '../../hooks/useReviews';
import { Avatar } from '../../components/atoms/Avatar';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ConfirmModal } from '../../components/molecules/ConfirmModal';
import { SearchBar } from '../../components/molecules/SearchBar';
import { IconStar, IconTrash } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';


function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => <IconStar key={n} filled={n <= (rating || 0)} />)}
    </div>
  );
}

export default function Reviews() {
  const { filtered, loading, actionLoading, search, setSearch, handleDelete } = useReviews();
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Reviews</h1>
          <div className="gx-page-subtitle">All customer reviews across the platform.</div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left" />
        <SearchBar value={search} onChange={setSearch} placeholder="Search reviews…" />
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No reviews found" desc="Try adjusting your search terms." />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr><th>Customer</th><th>Professional</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const customerName = r.customerName || r.customer?.name || '—';
                  const professionalName = r.professionalName || r.professional?.name || '—';
                  const comment = r.comment || r.body || r.text || '—';
                  return (
                    <TableRow key={r.id}>
                      <td><div className="gx-table-name"><Avatar name={customerName} size={30} /><span>{customerName}</span></div></td>
                      <td><div className="gx-table-name"><Avatar name={professionalName} size={30} /><span>{professionalName}</span></div></td>
                      <td><StarRating rating={r.rating} /></td>
                      <td className="gx-muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={comment}>{comment}</td>
                      <td className="gx-muted">{dateShort(r.createdAt || r.date)}</td>
                      <td>
                        <div className="gx-row-actions">
                          <button className="gx-btn gx-btn-danger-soft gx-btn-sm" onClick={() => setDeleteTarget(r)}>
                            <IconTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          confirmLabel="Delete review"
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => { const ok = await handleDelete(deleteTarget.id); if (ok) setDeleteTarget(null); }}
          loading={actionLoading}
        />
      )}
    </div>
  );
}