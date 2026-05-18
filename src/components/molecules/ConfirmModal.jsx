export function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass = 'gx-btn-danger',
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div className="gx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gx-modal-title">{title}</div>
        <div className="gx-modal-desc" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="gx-modal-actions">
          <button className="gx-btn gx-btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={`gx-btn ${confirmClass}`} onClick={onConfirm} disabled={loading}>
            {loading ? `${confirmLabel}…` : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}