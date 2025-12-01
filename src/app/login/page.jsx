// src/app/login/page.jsx
'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      // show modal instructing user to check email
      setShowModal(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.message || 'Something went wrong');
    }
  }

  // Called when user says "I clicked the link" — checks session and redirects if present
  async function handleContinueAfterEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      if (data?.session) {
        // user already authenticated — send them to the appropriate page
        router.push('/dashboard');
      } else {
        // no session yet — keep modal open and tell them to check email
        setErrorMsg('No active session yet. Please click the link in your email and then press continue.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.message || 'Failed to check session');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="you@company.com"
          />
        </label>

        {errorMsg && <p className="text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="mb-4">
              We sent a magic link to <strong>{email}</strong>. Click the link in your email to sign in.
              If this is a new account, confirm the email to finish setup.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleContinueAfterEmail}
                className="px-4 py-2 rounded bg-green-600 text-white"
                disabled={loading}
              >
                {loading ? 'Checking…' : 'I clicked the link — continue'}
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded border"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Didn't receive the email? Check spam or try again. If you are expecting to be redirected
              immediately (returning user), press "I clicked the link — continue" after clicking the link.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
