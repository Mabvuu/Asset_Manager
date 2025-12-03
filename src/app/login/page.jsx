// src/app/login/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data?.session) router.replace('/dashboard');
      else setCheckingSession(false);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_evt, state) => {
      if (state?.session) router.replace('/dashboard');
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  if (checkingSession) return null;

  function validEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  // New handleLogin: if already signed-in -> go to dashboard.
  // Otherwise send magic link (redirect back to /login so the page can verify session).
  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1) If already have a session, skip sending email and go to dashboard
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setLoading(false);
        router.replace('/dashboard');
        return;
      }

      // 2) Not signed-in -> validate email then send magic link
      if (!validEmail(email)) {
        setLoading(false);
        setErrorMsg('Please enter a valid email address.');
        return;
      }

      // ensure Supabase redirects back to the login page after clicking the magic link
     const redirect = `${window.location.origin}/dashboard`;


      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message || 'Failed to send magic link.');
        return;
      }

      // show modal instructing user to check their email
      setShowModal(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.message || 'Something went wrong.');
    }
  }

  // Called by "I clicked the link — continue" button in the modal.
  // Checks session; if Supabase established it, send the user to dashboard.
  async function handleContinueAfterEmail() {
    setErrorMsg('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      if (data?.session) router.replace('/dashboard');
      else setErrorMsg('No active session yet. Click the link in your email and then press continue.');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.message || 'Failed to check session');
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="mb-6 text-center">
          <div className="login-brand mb-3">AM</div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in with your email to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-600">Work email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
              placeholder="you@company.com"
            />
          </label>

          {errorMsg && <div className="text-sm" style={{ color: '#dc2626' }}>{errorMsg}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Working…' : 'Send magic link'}
            </button>

            <button
              type="button"
              onClick={() => { setEmail(''); setErrorMsg(''); }}
              className="btn-secondary"
              style={{ width: 120 }}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-5 center text-muted">
          <span>Need an invite? </span>
          <a href="/invite" style={{ color: 'var(--accent-600)', fontWeight: 700 }}>Request one</a>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-90 flex items-center justify-center" style={{ background: 'rgba(244, 234, 234, 0.45)', padding: 16 }}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="mb-4">
              We sent a magic link to <strong>{email}</strong>. Open the email and click the link to sign in.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleContinueAfterEmail}
                className="btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Checking…' : 'I clicked the link — continue'}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                style={{ width: 120 }}
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-muted">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
