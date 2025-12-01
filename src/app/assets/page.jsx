'use client';
import useSWR from 'swr';
import AssetList from '../../components/AssetList';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AssetsPage() {
  const { data, error } = useSWR('/api/assets', fetcher);

  if (error) return <p className="p-6 text-red-600">Failed to load assets.</p>;
  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assets</h1>
      <AssetList assets={data} />
    </div>
  );
}
