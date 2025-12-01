// src/lib/useSession.js
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { subscription } = supabase.auth.onAuthStateChange((_event, state) => {
      setSession(state?.session ?? null);
    });
    return () => subscription?.unsubscribe();
  }, []);
  return session;
}
