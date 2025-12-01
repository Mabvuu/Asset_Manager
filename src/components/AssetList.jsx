// src/components/AssetList.jsx
'use client';
import Link from 'next/link';
import React from 'react';

export default function AssetList({ assets = [] }) {
  if (!assets || assets.length === 0) {
    return <p className="text-gray-600">No assets found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((a) => (
        <article key={a.id} className="rounded border p-4 bg-white shadow-sm">
          {/* Use Link directly — don't put an <a> inside it */}
          <Link href={`/assets/${a.id}`} className="block group">
            <h3 className="font-semibold group-hover:underline">{a.name || 'Untitled'}</h3>
            <p className="text-sm text-gray-600 mt-1">{a.description || '—'}</p>
            <div className="mt-3 text-xs text-gray-500">ID: {a.id}</div>
          </Link>
        </article>
      ))}
    </div>
  );
}
