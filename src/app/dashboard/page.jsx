// src/app/dashboard/page.jsx
'use client';
import useSWR from 'swr';
import AssetList from '../../components/AssetList';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const fetcher = url => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const { data: assets } = useSWR('/api/assets', fetcher);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Dashboard</h2>
      <AssetList assets={assets || []} />
    </div>
  );
}
