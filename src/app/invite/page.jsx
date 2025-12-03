// src/app/invite/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvitePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  function validEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    if (!validEmail(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // MVP: pretend to send request. If you later want a real API,
      // replace this with a POST to your backend: /api/request-invite
      await new Promise(r => setTimeout(r, 700));
      setLoading(false);
      setStatus('Invite request submitted. We will contact you soon.');
      setEmail('');
    } catch (err) {
      setLoading(false);
      setStatus('Failed to submit — try again.');
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="mb-6 text-center">
          <div className="login-brand mb-3">AM</div>
          <h1 className="login-title">Request an invite</h1>
          <p className="login-sub">Enter your work email and we’ll contact you when access is approved.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-600">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
              placeholder="you@company.com"
            />
          </label>

          {status && <div className="text-sm" style={{ color: status.startsWith('Invite') ? 'green' : '#dc2626' }}>{status}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting…' : 'Request Invite'}
            </button>

            <button
              type="button"
              onClick={() => { setEmail(''); setStatus(''); }}
              className="btn-secondary"
              style={{ width: 120 }}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-5 center text-muted">
          <span>Already have a link? </span>
          <a href="/login" style={{ color: 'var(--accent-600)', fontWeight: 700 }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
