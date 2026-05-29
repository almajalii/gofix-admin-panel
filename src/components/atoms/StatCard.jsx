export default function StatCard({ label, value, icon: Icon, primary = false, danger = false }) {
  return (
    <div
      className={`gx-stat-card${primary ? ' is-primary' : ''}`}
      style={danger ? { borderColor: 'var(--red)', background: 'var(--red-soft)' } : {}}
    >
      <div className="gx-stat-top">
        <div className="gx-stat-label" style={danger ? { color: 'var(--red)' } : {}}>
          {label}
        </div>
        <div className="gx-stat-icon" style={danger ? { background: 'var(--red-soft)', color: 'var(--red)' } : {}}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <div className="gx-stat-value" style={danger ? { color: 'var(--red)' } : {}}>
        {value ?? '—'}
      </div>
    </div>
  );
}
