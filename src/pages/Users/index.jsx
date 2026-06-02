import { useState } from 'react';
import { dateShort } from '../../utils/formatters';
import { useUsers } from './useUsers';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ConfirmModal } from '../../components/molecules/ConfirmModal';
import { SearchBar } from '../../components/molecules/SearchBar';
import { IconCheck, IconX } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';
import UserDetailDrawer from './UserDetailDrawer';

export default function Users() {
  const {
    filtered, loading, actionLoading,
    tab, setTab, search, setSearch,
    counts, handleBan, handleUnban,
  } = useUsers();

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [detailUserId, setDetailUserId] = useState(null);

  const tabs = [
    { id: 'All',           label: 'All',           count: counts.All },
    { id: 'Customers',     label: 'Customers',     count: counts.Customers },
    { id: 'Professionals', label: 'Professionals', count: counts.Professionals },
    { id: 'Banned',        label: 'Banned',        count: counts.Banned },
  ];

  async function handleConfirm() {
    const { user, action } = confirmTarget;
    if (action === 'ban') await handleBan(user);
    else await handleUnban(user);
    setConfirmTarget(null);
  }

  const modal = confirmTarget && (() => {
    const name = `${confirmTarget.user.firstName || ''} ${confirmTarget.user.lastName || ''}`.trim() || confirmTarget.user.email;
    return confirmTarget.action === 'ban'
      ? { title: 'Ban user', message: `Are you sure you want to ban <b>${name}</b>? They will no longer be able to log in.`, confirmLabel: 'Ban user', confirmClass: 'gx-btn-danger' }
      : { title: 'Unban user', message: `Are you sure you want to unban <b>${name}</b>? They will regain access to their account.`, confirmLabel: 'Unban user', confirmClass: 'gx-btn-primary' };
  })();

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Users</h1>
          <div className="gx-page-subtitle">All customers and professionals on GoFix.</div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <div className="gx-tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`gx-tab${tab === t.id ? ' is-active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}<span className="gx-tab-count">{t.count}</span>
              </button>
            ))}
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" />
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" desc="Try adjusting filters or search terms." />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th>
                  <th>Verified</th><th>Status</th><th>Joined</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                  return (
                    <TableRow key={u.id} clickable onClick={() => setDetailUserId(u.id)}>
                      <td>
                        <div className="gx-table-name">
                          <Avatar name={name} size={34} />
                          <div className="gx-table-name-stack">
                            <div>{name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="gx-muted">{u.email}</td>
                      <td><Badge status={u.role} sm /></td>
                      <td>
                        {u.isVerified
                          ? <span className="gx-verified-check"><IconCheck /></span>
                          : <span className="gx-verified-x"><IconX /></span>}
                      </td>
                      <td><Badge status={u.isBanned ? 'Banned' : 'Active'} sm /></td>
                      <td className="gx-muted">{dateShort(u.createdAt)}</td>
                      <td>
                        <div className="gx-row-actions">
                          <button
                            className="gx-btn gx-btn-secondary gx-btn-sm"
                            onClick={(e) => { e.stopPropagation(); setDetailUserId(u.id); }}
                          >
                            View
                          </button>
                          {u.isBanned
                            ? <button className="gx-btn gx-btn-primary gx-btn-sm" onClick={(e) => { e.stopPropagation(); setConfirmTarget({ user: u, action: 'unban' }); }}>Unban</button>
                            : <button className="gx-btn gx-btn-danger-soft gx-btn-sm" onClick={(e) => { e.stopPropagation(); setConfirmTarget({ user: u, action: 'ban' }); }}>Ban</button>}
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

      {confirmTarget && modal && (
        <ConfirmModal {...modal} onClose={() => setConfirmTarget(null)} onConfirm={handleConfirm} loading={actionLoading} />
      )}

      {detailUserId && (
        <UserDetailDrawer
          userId={detailUserId}
          onClose={() => setDetailUserId(null)}
        />
      )}
    </div>
  );
}