// src/components/AssetHistory.jsx
export default function AssetHistory({ history = [] }) {
  if (!history.length) return <p>No history.</p>;
  return (
    <div className="space-y-2">
      {history.map(h => (
        <div key={h.id} className="bg-white p-3 rounded">
          <div className="text-sm text-slate-600">{new Date(h.created_at).toLocaleString()}</div>
          <div className="font-medium">{h.changed_by}</div>
          <pre className="mt-2 text-xs">{JSON.stringify(h.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
