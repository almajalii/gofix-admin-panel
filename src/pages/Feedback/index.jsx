import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFeedback } from '../../network/api/admin/feedback';
import { dateShort } from '../../utils/formatters';
import { Avatar } from '../../components/atoms/Avatar';
import { EmptyState } from '../../components/molecules/EmptyState';
import TableRow from '../../components/molecules/TableRow';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? 'var(--amber)' : 'none'} stroke="var(--amber)" strokeWidth="1.8">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0); // 0 = all

  useEffect(() => {
    setLoading(true);
    getFeedback()
      .then(setFeedback)
      .catch(() => toast.error('Failed to load feedback'))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.stars, 0) / feedback.length).toFixed(1)
    : '—';

  const filtered = filter === 0
    ? feedback
    : feedback.filter((f) => f.stars === filter);

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Feedback</h1>
          <div className="gx-page-subtitle">
            App feedback submitted by users.
            {feedback.length > 0 && (
              <span> · <b>{feedback.length} responses</b> · avg <b style={{ color: 'var(--amber)' }}>★ {avgRating}</b></span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <div className="gx-tabs">
            {[0, 5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                className={`gx-tab${filter === s ? ' is-active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 0 ? 'All' : `${s} ★`}
                <span className="gx-tab-count">
                  {s === 0 ? feedback.length : feedback.filter((f) => f.stars === s).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No feedback yet" desc="Users haven't submitted any feedback yet." />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <TableRow key={f.id}>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={f.userName} size={32} />
                        <div className="gx-table-name-stack">
                          <div>{f.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td><StarRating rating={f.stars} /></td>
                    <td style={{ maxWidth: 400, color: 'var(--ink-2)', fontSize: 13 }}>{f.message}</td>
                    <td className="gx-muted">{dateShort(f.createdAt)}</td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}