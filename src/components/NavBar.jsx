// src/components/NavBar.jsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="font-bold">
          AssetMVP
        </Link>

        {/* Navigation */}
        <nav className="space-x-3 flex items-center">

          <Link href="/assets">Assets</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/mint">Mint</Link>

          {user ? (
            <Link href="/logout" className="ml-3">
              Logout
            </Link>
          ) : (
            <Link href="/login" className="ml-3">
              Login
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}
