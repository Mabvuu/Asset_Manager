// src/app/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data?.session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  // nothing to render here — immediate redirect
  return null;
}
