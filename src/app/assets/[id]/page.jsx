// src/app/assets/[id]/page.jsx
import { notFound } from 'next/navigation';

export default async function AssetPage({ params }) {
  const { id } = await params;
  if (!id) return notFound();

  // Use an absolute base URL. If you have an env var set, use it; otherwise fall back to localhost.
  const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
  const res = await fetch(`${base}/api/assets/${id}`);

  if (!res.ok) return notFound();
  const asset = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{asset.name || 'Asset'}</h1>
      <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
      <pre className="text-xs bg-gray-100 p-3 rounded">{JSON.stringify(asset, null, 2)}</pre>
    </div>
  );
}
