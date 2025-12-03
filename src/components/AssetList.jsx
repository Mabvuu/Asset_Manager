// src/components/AssetList.jsx
'use client';

import Link from 'next/link';
import React from 'react';

export default function AssetList({ assets = [] }) {
  if (!assets || assets.length === 0) {
    return (
      <div className="card placeholder">
        <p className="text-gray-600 text-center">No assets found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: grid of cards. Mobile: asset-cards styles from globals.css will take over. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <Link
            key={a.id}
            href={`/assets/${a.id}`}
            className="block group card transition hover:shadow-md"
            aria-labelledby={`asset-title-${a.id}`}
          >
            <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
              <div
                className="thumb"
                style={{
                  minWidth:64,
                  minHeight:64,
                  borderRadius:8,
                  display:'grid',
                  placeItems:'center',
                  fontWeight:700,
                  color:'var(--accent-700)',
                  background:'linear-gradient(90deg,#eef2ff,#f0f9ff)',
                  flexShrink:0
                }}
                aria-hidden
              >
                {(a.name || 'U').slice(0,2).toUpperCase()}
              </div>

              <div style={{flex:1, minWidth:0}}>
                <h3
                  id={`asset-title-${a.id}`}
                  className="title"
                  style={{fontWeight:800, margin:0, color:'#0f172a'}}
                >
                  {a.name || 'Untitled'}
                </h3>

                <p className="desc kicker" style={{marginTop:8, color:'var(--muted)', fontSize:13}}>
                  {a.description || 'No description'}
                </p>

                <div style={{display:'flex', gap:8, alignItems:'center', marginTop:12}}>
                  <div className="pill" style={{fontSize:12, padding:'6px 10px'}}>
                    {a.collection || 'Default'}
                  </div>

                  <div className="kicker" style={{fontSize:12, color:'var(--muted)'}}>
                    {a.media_type || a.type || 'file'}
                  </div>
                </div>
              </div>

              <div style={{marginLeft:8, display:'flex', alignItems:'center'}}>
                <div className="kicker" style={{fontSize:12, color:'var(--muted)'}}>
                  {a.status || 'draft'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile card fallback (globals.css shows .asset-cards on small screens) */}
      <div className="asset-cards" style={{display:'none', marginTop:12}}>
        {assets.map((a) => (
          <article key={a.id} className="asset-card" role="article" aria-labelledby={`asset-${a.id}`}>
            <div className="thumb" aria-hidden>{(a.name||'U').slice(0,2).toUpperCase()}</div>
            <div className="meta">
              <div id={`asset-${a.id}`} className="title" style={{fontWeight:800}}>{a.name || 'Untitled'}</div>
              <div className="desc" style={{marginTop:6, color:'var(--muted)'}}>{a.description || 'No description'}</div>
              <div style={{display:'flex', gap:8, marginTop:8, alignItems:'center'}}>
                <div className="kicker" style={{fontSize:12}}>{a.collection || 'Default'}</div>
                <div className="pill" style={{fontSize:12}}>{a.status || 'draft'}</div>
              </div>
            </div>
            <div style={{marginLeft:12}}>
              <button className="btn btn-ghost" aria-label={`Open ${a.name || 'asset'}`}>Open</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
