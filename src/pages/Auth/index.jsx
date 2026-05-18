import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildHeaders } from '../../network/http/requestInterceptor';
import { handleResponse } from '../../network/http/responseInterceptor';
import { API_BASE_URL } from '../../network/config/apiConfig';
import { setToken } from '../../network/http/tokenHelper';
import { useDispatch } from 'react-redux';
import { setAdmin } from './store/adminAuthSlice';
import { useAuth } from './useAuth';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await handleResponse(
        fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: buildHeaders(false),
          body: JSON.stringify({ email, password }),
        })
      );
      const token = res?.data?.token;
      const role = res?.data?.user?.role;
      if (token && role === 'admin') {
        setToken(token);
        navigate('/dashboard');
      } else {
        throw new Error('Not authorized');
      }
    } catch {
      // toast fired by handleResponse
    } finally {
      dispatch(setAdmin(userData));
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div className="gx-card" style={{ width: 400, padding: 40 }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em' }}>
            GoFix <span style={{ color: 'var(--accent)' }}>Admin</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            Sign in to your admin account
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gofix.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--line)',
                fontSize: 14,
                outline: 'none',
                background: 'var(--surface)',
                color: 'var(--ink-1)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--line)',
                fontSize: 14,
                outline: 'none',
                background: 'var(--surface)',
                color: 'var(--ink-1)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gx-btn gx-btn-primary gx-btn-lg"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}