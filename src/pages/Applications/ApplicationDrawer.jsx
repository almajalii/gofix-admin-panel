import { timeAgo } from '../../utils/formatters';
import { useApplications } from './useApplications';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { IconCheck, IconX } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';
import RejectModal from './RejectModal';

// ── Application Drawer ────────────────────────────────────────────────────────
export default function ApplicationDrawer({ app, onClose, onApprove, onReject, loading }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const isActionable = app.status === 'PendingReview' || app.status === 'Pending';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (rejectOpen) setRejectOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rejectOpen, onClose]);

  return (
    <>
      <div className="gx-drawer-backdrop" onClick={onClose} />
      <div className="gx-drawer">
        {/* Head */}
        <div className="gx-drawer-head">
          <div className="gx-drawer-head-meta">
            <Avatar name={app.fullName || app.name} size={42} />
            <div>
              <div className="gx-drawer-head-title">{app.fullName || app.name}</div>
              <div className="gx-drawer-head-sub">
                {app.categoryName} · {app.yearsOfExperience ?? app.experience ?? 0} yrs ·{' '}
                Submitted {timeAgo(app.submittedAt || app.submitted)}
              </div>
            </div>
            <Badge status={app.status} />
          </div>
          <button className="gx-drawer-close" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="gx-drawer-body">
          {!isActionable && (
            <div style={{
              padding: '12px 14px',
              background: app.status === 'Approved' ? 'var(--green-soft)' : 'var(--red-soft)',
              color: app.status === 'Approved' ? 'var(--green)' : 'var(--red)',
              borderRadius: 'var(--radius)',
              marginBottom: 20,
              fontSize: 13,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}>
              <div style={{ fontSize: 16 }}>ⓘ</div>
              <div>
                <b>This application has already been {app.status === 'Approved' ? 'approved' : 'rejected'}.</b>
                {app.status === 'Rejected' && app.rejectionReason && (
                  <div style={{ marginTop: 4 }}>Reason: "{app.rejectionReason}"</div>
                )}
              </div>
            </div>
          )}

          {/* Profile */}
          <div className="gx-section">
            <div className="gx-section-head">
              <div className="gx-section-title">Profile</div>
            </div>
            <div className="gx-profile-card">
              <Avatar name={app.fullName || app.name} size={68} />
              <div className="gx-profile-meta">
                <div className="gx-profile-name">{app.fullName || app.name}</div>
                <div className="gx-profile-cat-line">
                  <span className="gx-cat">{app.categoryName || '—'}</span>
                  <span>·</span>
                  <span>{app.yearsOfExperience ?? app.experience ?? 0} years experience</span>
                </div>
                {app.bio && <div className="gx-profile-bio">{app.bio}</div>}
                <div className="gx-profile-contacts">
                  <div className="gx-profile-contact-item">✉ {app.email}</div>
                  {app.phoneNumber && (
                    <div className="gx-profile-contact-item">☏ {app.phoneNumber}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          {app.services?.length > 0 && (
            <div className="gx-section">
              <div className="gx-section-head">
                <div className="gx-section-title">Services &amp; Pricing</div>
                <span className="gx-muted" style={{ fontSize: 12 }}>{app.services.length} services</span>
              </div>
              <div className="gx-services">
                {app.services.map((s, i) => (
                  <div key={i} className="gx-service-row">
                    <div className="gx-service-row-name">{s.name || s.serviceName}</div>
                    <div className="gx-service-row-price">
                      {s.minPrice != null ? `$${s.minPrice} – $${s.maxPrice}` : s.price != null ? `$${s.price}` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Areas */}
          {app.serviceAreas?.length > 0 && (
            <div className="gx-section">
              <div className="gx-section-head">
                <div className="gx-section-title">Service Areas</div>
              </div>
              <div className="gx-chips">
                {app.serviceAreas.map((a, i) => (
                  <span key={i} className="gx-chip">📍 {a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {app.documents?.length > 0 && (
            <div className="gx-section">
              <div className="gx-section-head">
                <div className="gx-section-title">Documents</div>
                <span className="gx-muted" style={{ fontSize: 12 }}>{app.documents.length} files</span>
              </div>
              <div className="gx-docs">
                {app.documents.map((d, i) => (
                  <div key={i} className="gx-doc-card">
                    <div className="gx-doc-body">
                      <div className="gx-doc-label">{d.name || d.label || `Document ${i + 1}`}</div>
                      {d.type && <div className="gx-doc-sub">{d.type}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isActionable && (
          <div className="gx-drawer-foot">
            <button className="gx-btn gx-btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="gx-btn gx-btn-danger-soft"
              onClick={() => setRejectOpen(true)}
              disabled={loading}
            >
              <IconX /> Reject
            </button>
            <button
              className="gx-btn gx-btn-success gx-btn-lg"
              onClick={onApprove}
              disabled={loading}
            >
              <IconCheck /> {loading ? 'Processing…' : 'Approve application'}
            </button>
          </div>
        )}
      </div>

      {rejectOpen && (
        <RejectModal
          name={app.fullName || app.name}
          onClose={() => setRejectOpen(false)}
          onSubmit={(reason) => { setRejectOpen(false); onReject(reason); }}
        />
      )}
    </>
  );
}