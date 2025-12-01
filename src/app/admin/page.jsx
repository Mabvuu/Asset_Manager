    // src/app/admin/page.jsx
'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [inviteEmail, setInviteEmail] = useState('');

  async function createInvite(e) {
    e.preventDefault();
    const r = await fetch('/api/admin/create-invite', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: inviteEmail }),
    });
    if (!r.ok) return alert('error');
    const data = await r.json();
    alert(`Invite created: ${data.token}`);
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Admin</h2>
      <form onSubmit={createInvite} className="space-y-3 max-w-md">
        <input className="w-full p-2 border rounded" placeholder="invitee@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Invite</button>
      </form>
    </div>
  );
}
