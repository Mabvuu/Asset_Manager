// src/app/assets/[id]/page.jsx
import { notFound } from 'next/navigation';

export default async function AssetPage({ params }) {
  const id = params.id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/assets/${id}`);
  if (!res.ok) return notFound();
  const asset = await res.json();
  return (
    <div>
      <h2 className="text-2xl mb-2">{asset.name}</h2>
      <p className="mb-4">{asset.description}</p>
      <pre className="bg-white p-3 rounded">{JSON.stringify(asset, null, 2)}</pre>
    </div>
  );
}
