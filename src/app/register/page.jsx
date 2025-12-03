// src/app/register/page.jsx
'use client';
import { useState } from 'react';
import { supabase } from '../..//lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    // Verify invite with API
    const check = await fetch('/api/verify-invite', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, token }),
    });
    if (!check.ok) return alert('Invite invalid');
    // Create magic link sign up (Supabase OTP handles signup)
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert(error.message);
    alert('Check your email to complete registration.');
    router.push('/');
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register (Invite Only)</h2>
      <form onSubmit={handleRegister} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="invite token" value={token} onChange={e => setToken(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Register</button>
      </form>
    </div>
  );
}
