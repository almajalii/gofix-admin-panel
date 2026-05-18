export function EmptyState({ title, desc }) {
  return (
    <div className="gx-empty">
      <div className="gx-empty-illo">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          <rect x="10" y="40" width="100" height="50" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
          <path d="M10 60h30l5 8h30l5-8h30" stroke="var(--accent)" strokeWidth="1.5" fill="#fff" />
          <circle cx="60" cy="14" r="3" fill="var(--accent)" />
        </svg>
      </div>
      <div className="gx-empty-title">{title}</div>
      {desc && <div className="gx-empty-desc">{desc}</div>}
    </div>
  );
}