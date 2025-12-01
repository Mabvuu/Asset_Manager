// src/components/ActivityFeed.jsx
export default function ActivityFeed({ events = [] }) {
  if (!events || events.length === 0) return <p>No activity yet.</p>;
  return (
    <div className="space-y-2">
      {events.map(e => (
        <div key={e.id} className="p-3 bg-white rounded">
          <div className="text-sm text-slate-500">{new Date(e.created_at).toLocaleString()}</div>
          <div className="mt-1">{e.action} — <span className="font-semibold">{e.asset_id}</span></div>
        </div>
      ))}
    </div>
  );
}
