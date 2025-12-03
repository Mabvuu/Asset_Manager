// src/components/AuthGate.jsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import NavBar from './NavBar';

/**
 * AuthGate wraps the layout content.
 * - While session is unknown → render nothing (prevents flicker)
 * - If logged in → render NavBar + children
 * - If not logged in → render only children (public pages like / and /login)
 */
export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, state) => {
      if (!mounted) return;
      setSession(state?.session ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // while checking session, render nothing to avoid layout flicker
  if (session === undefined) return null;

  return (
    <>
      {session ? <NavBar /> : null}
      {children}
    </>
  );
}
