import { useState, useEffect } from 'react';
import { timeAgo } from '../../utils/formatters';
import { useApplications } from './useApplications';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { EmptyState } from '../../components/molecules/EmptyState';
import { SearchBar } from '../../components/molecules/SearchBar';
import { IconCheck, IconX } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';

export default function RejectModal({ name, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const trimmed = reason.trim();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function submit() {
    if (trimmed.length < 10) {
      setError('Please provide a reason of at least 10 characters.');
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div className="gx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gx-modal-title">Reject application</div>
        <div className="gx-modal-desc">
          Tell <b>{name}</b> why their application was rejected. This message will be sent to their
          email — keep it clear and respectful.
        </div>
        <textarea
          className={`gx-textarea${error ? ' is-error' : ''}`}
          placeholder="e.g. Missing required certification — please obtain and re-apply."
          value={reason}
          onChange={(e) => { setReason(e.target.value); if (error) setError(''); }}
          autoFocus
        />
        {error && <div className="gx-error-msg">{error}</div>}
        <div className="gx-modal-actions">
          <button className="gx-btn gx-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="gx-btn gx-btn-danger"
            onClick={submit}
            disabled={trimmed.length === 0}
          >
            Reject application
          </button>
        </div>
      </div>
    </div>
  );
}