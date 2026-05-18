import { useState, useEffect } from 'react';
import { timeAgo } from '../../utils/formatters';
import { useApplications } from './useApplications';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { EmptyState } from '../../components/molecules/EmptyState';
import { SearchBar } from '../../components/molecules/SearchBar';
import { IconCheck, IconX } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';
import RejectModal from './RejectModal';
import ApplicationDrawer from './ApplicationDrawer';

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Applications() {
  const {
    filtered,
    detail,
    loading,
    detailLoading,
    actionLoading,
    pendingCount,
    status, setStatus,
    search, setSearch,
    openDetail,
    closeDetail,
    handleApprove,
    handleReject,
    applications,
  } = useApplications();

  const [activeTab, setActiveTab] = useState('Pending');

  // Derive tab-filtered list from the hook's filtered (which filters by search)
  // but apply tab on top — hook uses `status` state; we map tab → status values
  const tabFiltered = filtered.filter((a) => {
    if (activeTab === 'Pending')  return a.status === 'PendingReview' || a.status === 'Pending';
    if (activeTab === 'Approved') return a.status === 'Approved';
    if (activeTab === 'Rejected') return a.status === 'Rejected';
    return true; // 'All'
  });

  const counts = {
    Pending:  applications.filter((a) => a.status === 'PendingReview' || a.status === 'Pending').length,
    Approved: applications.filter((a) => a.status === 'Approved').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
    All:      applications.length,
  };

  const tabs = [
    { id: 'Pending',  label: 'Pending',  count: counts.Pending },
    { id: 'Approved', label: 'Approved', count: counts.Approved },
    { id: 'Rejected', label: 'Rejected', count: counts.Rejected },
    { id: 'All',      label: 'All',      count: counts.All },
  ];

  const openId = detail?.professionalId ?? detail?.id ?? null;

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Applications</h1>
          <div className="gx-page-subtitle">
            Review and approve professionals applying to join GoFix.
            {pendingCount > 0 && (
              <span> · <b style={{ color: 'var(--accent)' }}>{pendingCount} pending review</b></span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <div className="gx-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`gx-tab${activeTab === t.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
                <span className="gx-tab-count">{t.count}</span>
              </button>
            ))}
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or category…" />
      </div>

      <div className="gx-card">
        {loading ? (
          <div className="gx-empty"><div className="gx-empty-title">Loading…</div></div>
        ) : tabFiltered.length === 0 ? (
          <EmptyState
            title={activeTab === 'Pending' ? 'No pending applications' : 'Nothing here yet'}
            desc={
              activeTab === 'Pending'
                ? 'Nice work — the review queue is empty.'
                : 'Adjust filters or check another tab.'
            }
          />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Experience</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tabFiltered.map((a, i) => (
                  <TableRow
                    key={a.professionalId}
                    clickable
                    onClick={() => openDetail(a.professionalId)}
                  >
                    <td className="gx-row-num">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={a.applicantName} size={34} />
                        <div className="gx-table-name-stack">
                          <div>{a.applicantName}</div>
                          <div className="gx-table-name-sub">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="gx-cat">{a.categoryName || '—'}</span></td>
                    <td><span className="gx-muted">{a.experienceYears ?? 0} years</span></td>
                    <td className="gx-muted">{timeAgo(a.submittedAt || a.submitted)}</td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      <div className="gx-row-actions">
                        <button
                          className="gx-btn gx-btn-secondary gx-btn-sm"
                          onClick={(e) => { e.stopPropagation(); openDetail(a.professionalId); }}
                        >
                          Review
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

      {/* Drawer */}
      {(detailLoading || detail) && (
        detailLoading ? (
          <>
            <div className="gx-drawer-backdrop" onClick={closeDetail} />
            <div className="gx-drawer">
              <div className="gx-empty" style={{ marginTop: 80 }}>
                <div className="gx-empty-title">Loading…</div>
              </div>
            </div>
          </>
        ) : (
          <ApplicationDrawer
            app={detail}
            onClose={closeDetail}
            onApprove={() => handleApprove(openId)}
            onReject={(reason) => handleReject(openId, reason)}
            loading={actionLoading}
          />
        )
      )}
    </div>
  );
}