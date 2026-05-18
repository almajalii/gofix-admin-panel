// Generic badge — pass a status string, get the right color + label.
// Covers application statuses, booking statuses, user roles, and ban state.

const STATUS_MAP = {
  // Application
  PendingReview: { label: 'Pending',      cls: 'badge-pending' },
  Pending:       { label: 'Pending',      cls: 'badge-pending' },
  Approved:      { label: 'Approved',     cls: 'badge-approved' },
  Rejected:      { label: 'Rejected',     cls: 'badge-rejected' },
  // Booking
  Accepted:      { label: 'Accepted',     cls: 'badge-info' },
  InProgress:    { label: 'In progress',  cls: 'badge-info' },
  Completed:     { label: 'Completed',    cls: 'badge-approved' },
  Cancelled:     { label: 'Cancelled',    cls: 'badge-draft' },
  // User role
  customer:      { label: 'Customer',     cls: 'badge-role-customer' },
  Customer:      { label: 'Customer',     cls: 'badge-role-customer' },
  professional:  { label: 'Professional', cls: 'badge-role-pro' },
  Professional:  { label: 'Professional', cls: 'badge-role-pro' },
  admin:         { label: 'Admin',        cls: 'badge-role-admin' },
  Admin:         { label: 'Admin',        cls: 'badge-role-admin' },
  // Ban state
  Active:        { label: 'Active',       cls: 'badge-approved' },
  Banned:        { label: 'Banned',       cls: 'badge-rejected' },
};

export function Badge({ status, sm = false }) {
  const m = STATUS_MAP[status] || { label: status, cls: 'badge-draft' };
  return (
    <span className={`gx-badge ${m.cls}${sm ? ' gx-badge-sm' : ''}`}>
      <span className="gx-badge-dot" />
      {m.label}
    </span>
  );
}