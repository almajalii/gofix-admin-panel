import { useState, useEffect } from 'react';
import { getStats, getActivityFeed } from '../../network/api/admin/stats';
import PageHeader from '../../components/molecules/PageHeader';
import StatCard from '../../components/atoms/StatCard';
import { Avatar } from '../../components/atoms/Avatar';
import { ClipboardList, Users, CalendarDays, Flag } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';

const TYPE_CONFIG = {
  booking:      { emoji: '📅', color: 'var(--blue)',   bg: 'var(--blue-soft)' },
  registration: { emoji: '👤', color: 'var(--green)',  bg: 'var(--green-soft)' },
  report:       { emoji: '🚩', color: 'var(--red)',    bg: 'var(--red-soft)' },
  review:       { emoji: '⭐', color: 'var(--accent)', bg: 'var(--accent-soft)' },
};

function ActivityFeed({ feed, loading }) {
  return (
    <div className="gx-card" style={{ flex: 1 }}>
      <div style={{ padding: '18px 24px 12px', borderBottom: '1px solid var(--line)', fontWeight: 600, fontSize: 14 }}>
        Recent Activity
      </div>
      {loading ? (
        <div className="gx-empty" style={{ padding: 40 }}>
          <div className="gx-empty-title">Loading…</div>
        </div>
      ) : feed.length === 0 ? (
        <div className="gx-empty" style={{ padding: 40 }}>
          <div className="gx-empty-title">No activity yet</div>
        </div>
      ) : (
        <div className="gx-feed">
          {feed.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.booking;
            return (
              <div key={i} className="gx-feed-item">
                <div className="gx-feed-dot" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.emoji}
                </div>
                <div className="gx-feed-body">
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{item.title}</div>
                  <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{item.subtitle}</div>
                  <div className="gx-feed-time">{timeAgo(item.createdAt)}</div>
                </div>
                {item.imageUrl && (
                  <Avatar name={item.subtitle} size={32} src={item.imageUrl} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [feed, setFeed]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res?.data ?? res))
      .catch(() => {})
      .finally(() => setLoading(false));

    getActivityFeed()
      .then((res) => setFeed(res?.data ?? res ?? []))
      .catch(() => {})
      .finally(() => setFeedLoading(false));
  }, []);

  const cards = [
    { label: 'Pending Applications', value: stats?.pendingApplications, icon: ClipboardList, primary: true },
    { label: 'Total Professionals',  value: stats?.totalProfessionals,  icon: Users },
    { label: 'Total Customers',      value: stats?.totalCustomers,      icon: Users },
    { label: 'Total Bookings',       value: stats?.totalBookings,       icon: CalendarDays },
    { label: 'Completed Bookings',   value: stats?.completedBookings,   icon: CalendarDays },
    { label: 'Reported Bookings',    value: stats?.reportedBookings,    icon: Flag, danger: true },
  ];

  return (
    <div className="gx-page">
      <PageHeader
        title="Good morning 👋"
        subtitle="Here's what's happening on GoFix today."
      />

      {loading ? (
        <div className="gx-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gx-stat-card" style={{ height: 130, opacity: 0.3 }} />
          ))}
        </div>
      ) : (
        <div className="gx-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {cards.map((c) => (
            <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} primary={c.primary} danger={c.danger} />
          ))}
        </div>
      )}

      <ActivityFeed feed={Array.isArray(feed) ? feed : []} loading={feedLoading} />
    </div>
  );
}