// src/app/invite/page.jsx
'use client';
import { useState } from 'react';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  async function createInvite(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/create-invite', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return alert('Error creating invite');
    const data = await res.json();
    alert(`Invite token created for ${email} — token: ${data.token}`);
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Request Invite (admin will create)</h2>
      <form onSubmit={createInvite} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="invitee@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Request Invite</button>
      </form>
    </div>
  );
}
