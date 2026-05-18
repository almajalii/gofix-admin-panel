import { useState, useEffect } from 'react';
import { dateShort } from '../../utils/formatters';
import { IconSearch, IconFlag } from '../../components/atoms/Icons';
import { toast } from 'react-toastify';
import { getReports } from '../../network/api/admin/reports';
import TableRow from '../../components/molecules/TableRow';

// ── Icons ─────────────────────────────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────

function Avatar({ name, size = 32 }) {
  const initials = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="gx-avatar gx-avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending:    { label: 'Pending',     cls: 'badge-pending' },
    Accepted:   { label: 'Accepted',    cls: 'badge-info' },
    InProgress: { label: 'In progress', cls: 'badge-info' },
    Completed:  { label: 'Completed',   cls: 'badge-approved' },
    Cancelled:  { label: 'Cancelled',   cls: 'badge-draft' },
  };
  const m = map[status] || { label: status, cls: 'badge-draft' };
  return (
    <span className={`gx-badge ${m.cls}`}>
      <span className="gx-badge-dot" />
      {m.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="gx-empty">
      <div className="gx-empty-illo">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          <rect x="10" y="40" width="100" height="50" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
          <path d="M10 60h30l5 8h30l5-8h30" stroke="var(--accent)" strokeWidth="1.5" fill="#fff" />
          <circle cx="60" cy="14" r="3" fill="var(--accent)" />
        </svg>
      </div>
      <div className="gx-empty-title">No reports</div>
      <div className="gx-empty-desc">All clear — no bookings have been flagged yet.</div>
    </div>
  );
}

// ── Report Detail Modal ───────────────────────────────────────────────────────
function ReportModal({ report, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div className="gx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="gx-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--red)' }}><IconFlag /></span>
          Report Details
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          {/* Report description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 6 }}>
              Customer's report
            </div>
            <div style={{
              padding: '12px 14px',
              background: 'var(--red-soft)',
              color: 'var(--ink-1)',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              lineHeight: 1.6,
              borderLeft: '3px solid var(--red)',
            }}>
              {report.reportDescription}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
              Reported {dateShort(report.reportedAt)}
            </div>
          </div>

          {/* Booking info */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 8 }}>
              Booking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span className="gx-muted">Service</span>
                <span style={{ fontWeight: 500 }}>{report.serviceName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span className="gx-muted">Price</span>
                <span style={{ fontWeight: 500 }}>{report.servicePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span className="gx-muted">Date</span>
                <span>{dateShort(report.scheduledDate)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span className="gx-muted">Status</span>
                <StatusBadge status={report.bookingStatus} />
              </div>
            </div>
          </div>

          {/* Parties */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, padding: '10px 12px', background: 'var(--surface-2, var(--accent-soft))', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>Customer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={report.customer?.name} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{report.customer?.name}</span>
              </div>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', background: 'var(--surface-2, var(--accent-soft))', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>Professional</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={report.professional?.name} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{report.professional?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gx-modal-actions" style={{ marginTop: 20 }}>
          <button className="gx-btn gx-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    getReports()
      .then(setReports)
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.customer?.name || '').toLowerCase().includes(q) ||
      (r.professional?.name || '').toLowerCase().includes(q) ||
      (r.serviceName || '').toLowerCase().includes(q) ||
      (r.reportDescription || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Reports</h1>
          <div className="gx-page-subtitle">
            Bookings flagged by customers for review.
            {reports.length > 0 && (
              <span> · <b style={{ color: 'var(--red)' }}>{reports.length} open</b></span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left" />
        <div className="gx-search">
          <span className="gx-search-icon"><IconSearch /></span>
          <input
            placeholder="Search by name or service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="gx-card">
        {loading ? (
          <div className="gx-empty"><div className="gx-empty-title">Loading…</div></div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Service</th>
                  <th>Booking date</th>
                  <th>Reported</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <TableRow key={r.reportId} clickable onClick={() => setSelected(r)}>
                    <td className="gx-row-num">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={r.customer?.name} size={30} />
                        <span>{r.customer?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={r.professional?.name} size={30} />
                        <span>{r.professional?.name || '—'}</span>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 500 }}>{r.serviceName}</span></td>
                    <td className="gx-muted">{dateShort(r.scheduledDate)}</td>
                    <td className="gx-muted">{dateShort(r.reportedAt)}</td>
                    <td><StatusBadge status={r.bookingStatus} /></td>
                    <td>
                      <div className="gx-row-actions">
                        <button
                          className="gx-btn gx-btn-secondary gx-btn-sm"
                          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ReportModal report={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}