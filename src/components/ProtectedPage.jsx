// src/components/ProtectedPage.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedPage({ children }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data?.session) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, state) => {
      if (!state?.session) router.replace('/login');
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  if (checking) return null;
  return <>{children}</>;
}
