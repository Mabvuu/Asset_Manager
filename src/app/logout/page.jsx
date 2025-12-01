// src/app/logout/page.jsx
'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      router.push('/');
    })();
  }, [router]);
  return <p>Signing out…</p>;
}
