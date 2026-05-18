import { useState } from 'react';
import { toast } from 'react-toastify';
import { broadcastNotification } from '../../network/api/admin/notifications';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setLoading(true);
    try {
      await broadcastNotification({ title: title.trim(), body: body.trim(), target });
      toast.success('Notification sent successfully!');
      setTitle('');
      setBody('');
      setTarget('all');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  }

  const targetOptions = [
    { value: 'all',          label: 'Everyone',      desc: 'All customers and professionals' },
    { value: 'customer',     label: 'Customers only', desc: 'Only users who book services' },
    { value: 'professional', label: 'Professionals only', desc: 'Only verified service providers' },
  ];

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Broadcast Notifications</h1>
          <div className="gx-page-subtitle">Send a push notification to users on GoFix.</div>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="gx-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Target */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 10 }}>
              Send to
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {targetOptions.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setTarget(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    border: `1.5px solid ${target === opt.value ? 'var(--accent)' : 'var(--line)'}`,
                    borderRadius: 'var(--radius)',
                    background: target === opt.value ? 'var(--accent-soft)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${target === opt.value ? 'var(--accent)' : 'var(--ink-5)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {target === opt.value && (
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              Title
            </label>
            <input
              className="gx-input"
              placeholder="e.g. New feature available!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4, textAlign: 'right' }}>
              {title.length}/200
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              Message
            </label>
            <textarea
              className="gx-textarea"
              placeholder="Write your notification message here…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={1000}
              style={{ minHeight: 120 }}
            />
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4, textAlign: 'right' }}>
              {body.length}/1000
            </div>
          </div>

          {/* Preview */}
          {(title || body) && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 8 }}>
                Preview
              </label>
              <div style={{
                padding: '14px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--accent)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.3" />
                    <path d="M8.5 12a3.5 3.5 0 1 0 6.3-2.1l1.7-1.7-1.5-1.5-1.7 1.7A3.5 3.5 0 0 0 8.5 12z" fill="#fff" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{title || 'Notification title'}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{body || 'Your message will appear here'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Send button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="gx-btn gx-btn-primary gx-btn-lg"
              onClick={handleSend}
              disabled={loading || !title.trim() || !body.trim()}
            >
              {loading ? 'Sending…' : '📣 Send notification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}