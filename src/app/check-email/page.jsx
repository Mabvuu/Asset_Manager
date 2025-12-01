// src/app/check-email/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CheckEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // 'checking' | 'no-session' | 'signed-in' | 'error'
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          if (!mounted) return;
          setStatus('error');
          setMsg(error.message);
          return;
        }
        if (data?.session) {
          if (!mounted) return;
          setStatus('signed-in');
          // redirect returning users to dashboard (or change to destination you prefer)
          router.push('/dashboard');
        } else {
          if (!mounted) return;
          setStatus('no-session');
        }
      } catch (err) {
        if (!mounted) return;
        setStatus('error');
        setMsg(err?.message || 'Unknown error');
      }
    }

    checkSession();

    // you can poll periodically if you want:
    const interval = setInterval(checkSession, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="max-w-md mx-auto p-6">
      {status === 'checking' && <p>Checking for sign-in…</p>}
      {status === 'no-session' && (
        <>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p>
            We sent you a magic link. Click it in your email and this page will detect the session
            and redirect you automatically. If it doesn't, press the back button or try signing in again.
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-red-600">{msg}</p>
        </>
      )}
    </div>
  );
}
