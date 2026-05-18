import { useState, useEffect } from 'react';
import { getStats } from '../../network/api/admin/stats';
import PageHeader from '../../components/molecules/PageHeader';
import StatCard from '../../components/atoms/StatCard';
import { ClipboardList, Users, CalendarDays, Flag } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res?.data ?? res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Pending Applications', value: stats?.pendingApplications, icon: ClipboardList, primary: true },
    { label: 'Total Professionals',  value: stats?.totalProfessionals,  icon: Users },
    { label: 'Total Customers',      value: stats?.totalCustomers,      icon: Users },
    { label: 'Total Bookings',       value: stats?.totalBookings,       icon: CalendarDays },
    { label: 'Completed Bookings',   value: stats?.completedBookings,   icon: CalendarDays },
    { label: 'Reported Bookings',    value: stats?.reportedBookings,    icon: Flag },
  ];

  return (
    <div className="gx-page">
      <PageHeader
        title="Good morning 👋"
        subtitle="Here's what's happening on GoFix today."
      />
      {loading ? (
        <div className="gx-stat-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gx-stat-card" style={{ height: 130, opacity: 0.3 }} />
          ))}
        </div>
      ) : (
        <div className="gx-stat-grid">
          {cards.map((c) => (
            <StatCard
              key={c.label}
              label={c.label}
              value={c.value}
              icon={c.icon}
              primary={c.primary}
            />
          ))}
        </div>
      )}
    </div>
  );
}