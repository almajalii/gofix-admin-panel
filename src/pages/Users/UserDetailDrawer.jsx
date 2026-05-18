import { useState, useEffect } from 'react';
import { getUserDetail } from '../../network/api/admin/users';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { IconX } from '../../components/atoms/Icons';
import { dateShort } from '../../utils/formatters';
import { toast } from 'react-toastify';

function StatBox({ label, value }) {
  return (
    <div style={{
      flex: 1, background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 'var(--radius)', padding: '14px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)' }}>{value ?? '—'}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function UserDetailDrawer({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
    getUserDetail(userId)
      .then(setUser)
      .catch(() => toast.error('Failed to load user details'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <>
      <div className="gx-drawer-backdrop" onClick={onClose} />
      <div className="gx-drawer">
        {/* Head */}
        <div className="gx-drawer-head">
          <div className="gx-drawer-head-meta">
            {!loading && user && (
              <>
                <Avatar name={`${user.firstName} ${user.lastName}`} size={42} />
                <div>
                  <div className="gx-drawer-head-title">{user.firstName} {user.lastName}</div>
                  <div className="gx-drawer-head-sub">{user.email} · Joined {dateShort(user.createdAt)}</div>
                </div>
                <Badge status={user.isBanned ? 'Banned' : 'Active'} />
              </>
            )}
            {loading && <div className="gx-drawer-head-title">Loading…</div>}
          </div>
          <button className="gx-drawer-close" onClick={onClose}><IconX /></button>
        </div>

        {/* Body */}
        <div className="gx-drawer-body">
          {loading ? (
            <div className="gx-empty"><div className="gx-empty-title">Loading…</div></div>
          ) : !user ? (
            <div className="gx-empty"><div className="gx-empty-title">User not found</div></div>
          ) : (
            <>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <StatBox label="Total Bookings"     value={user.totalBookings} />
                <StatBox label="Completed"          value={user.completedBookings} />
                <StatBox label="Cancelled"          value={user.cancelledBookings} />
                <StatBox label="Reviews Left"       value={user.reviews?.length} />
              </div>

              {/* Info */}
              <div className="gx-section">
                <div className="gx-section-head">
                  <div className="gx-section-title">Account Info</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    ['Role',   <Badge status={user.role} sm />],
                    ['Phone',  user.phone || '—'],
                    ['Verified', user.isVerified ? '✅ Yes' : '❌ No'],
                    ['Status', user.isBanned ? '🚫 Banned' : '✅ Active'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              {user.recentBookings?.length > 0 && (
                <div className="gx-section">
                  <div className="gx-section-head">
                    <div className="gx-section-title">Recent Bookings</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {user.recentBookings.map((b) => (
                      <div key={b.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--surface)', border: '1px solid var(--line)',
                        borderRadius: 'var(--radius)', padding: '10px 14px',
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{b.serviceName}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{b.professional?.name} · {dateShort(b.scheduledDate)}</div>
                        </div>
                        <Badge status={b.status} sm />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {user.reviews?.length > 0 && (
                <div className="gx-section">
                  <div className="gx-section-head">
                    <div className="gx-section-title">Reviews Left</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {user.reviews.map((r) => (
                      <div key={r.id} style={{
                        background: 'var(--surface)', border: '1px solid var(--line)',
                        borderRadius: 'var(--radius)', padding: '10px 14px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{r.professionalName}</div>
                          <div style={{ fontSize: 13, color: 'var(--accent)' }}>{'★'.repeat(Math.round(r.rating))} {r.rating}</div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}