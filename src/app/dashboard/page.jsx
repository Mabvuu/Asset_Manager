// src/app/dashboard/page.jsx
'use client';

import useSWR from 'swr';
import AssetList from '../../components/AssetList';
import ProtectedPage from '../../components/ProtectedPage';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
  if (!data.user) redirect('/login')

const fetcher = (url) => fetch(url).then((r) => r.json());

function Icon({ children }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={children} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPlus() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IconBell() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IconSearch() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <InnerDashboard />
    </ProtectedPage>
  );
}

function InnerDashboard() {
  const { data: assets, error, isLoading } = useSWR('/api/assets', fetcher);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  const filtered = (assets || []).filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (a.name || '').toLowerCase().includes(q)
      || (a.description || '').toLowerCase().includes(q)
      || (a.collection || '').toLowerCase().includes(q)
      || (a.tags || []).join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="container">
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden>AM</div>
          <div>
            <div className="title">Asset Manager</div>
            <div className="subtitle">Organize • Preview • Mint</div>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:800}}>{user?.email || 'Guest'}</div>
            <div className="kicker" style={{fontSize:12, color:'var(--muted)'}}>Member</div>
          </div>
          <div className="avatar" title={user?.email || 'Guest'}>
            {user?.email ? user.email[0].toUpperCase() : 'G'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats" aria-hidden>
        <div className="card stat card-sm">
          <div style={{flex:1}}>
            <div className="meta">Total</div>
            <div className="value">{(assets && assets.length) || 0}</div>
          </div>
          <div className="pill">Items</div>
        </div>

        <div className="card stat card-sm">
          <div style={{flex:1}}>
            <div className="meta">Drafts</div>
            <div className="value">{ (assets || []).filter(a => a.status === 'draft').length }</div>
          </div>
        </div>

        <div className="card stat card-sm">
          <div style={{flex:1}}>
            <div className="meta">Collections</div>
            <div className="value">{ new Set((assets || []).map(a => a.collection)).size || 0 }</div>
          </div>
        </div>

        <div className="card stat card-sm">
          <div style={{flex:1}}>
            <div className="meta">Activity</div>
            <div className="value">—</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls" role="search" aria-label="Search assets">
        <div className="search card-sm" style={{minWidth:0, flex:1}}>
          <IconSearch />
          <input
            aria-label="Search assets"
            placeholder="Search assets, tags, collections..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="actions" style={{marginLeft:12}}>
          <button className="btn btn-ghost" aria-label="Notifications" title="Notifications">
            <IconBell />
          </button>

          <button className="btn btn-primary" aria-label="New asset" title="New asset">
            <IconPlus /> <span style={{marginLeft:8}}>New Asset</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="asset-area" style={{marginTop:14}}>
        <main style={{minWidth:0}}>
          <div className="card" style={{marginBottom:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
              <div>
                <div className="h2">My Assets</div>
                <div className="kicker">Manage and preview your uploaded files</div>
              </div>
              <div className="pill">{(assets && assets.length) || 0} items</div>
            </div>
          </div>

          <div className="card">
            {isLoading && <div className="placeholder">Loading assets…</div>}
            {error && <div className="placeholder" style={{color:'#dc2626'}}>Failed to load assets.</div>}

            {!isLoading && !error && (
              <AssetList assets={filtered || []} />
            )}
          </div>
        </main>

        <aside>
          <div className="card" style={{marginBottom:12}}>
            <div className="h2">Quick Actions</div>
            <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:10}}>
              <button className="btn btn-primary">Create collection</button>
              <button className="btn btn-ghost">Import from URL</button>
              <button className="btn btn-ghost">Bulk edit</button>
            </div>
          </div>

          <div className="card">
            <div className="h2">Tips</div>
            <ul style={{marginTop:10, paddingLeft:18, color:'var(--muted)'}}>
              <li>Use tags to make search faster.</li>
              <li>Group similar items into collections.</li>
              <li>Tap an asset to preview and mint.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
