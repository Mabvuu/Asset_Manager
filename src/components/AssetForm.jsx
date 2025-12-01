// src/components/AssetForm.jsx
'use client';
import { useForm } from 'react-hook-form';
import { sha256Hex } from '../lib/hashUtil';
import { useState } from 'react';

export default function AssetForm({ onSaved }) {
  const { register, handleSubmit, reset } = useForm();
  const [saving, setSaving] = useState(false);

  async function onSubmit(values) {
    setSaving(true);
    const payload = { ...values, created_at: new Date().toISOString() };
    const hash = sha256Hex(payload);
    payload.current_hash = hash;
    const r = await fetch('/api/assets', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!r.ok) return alert('Error creating asset');
    const data = await r.json();
    reset();
    onSaved?.(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-lg">
      <input {...register('name')} className="w-full p-2 border rounded" placeholder="Asset name" required />
      <textarea {...register('description')} className="w-full p-2 border rounded" placeholder="Description" />
      <div className="flex space-x-2">
        <input {...register('category_id')} className="p-2 border rounded flex-1" placeholder="category id (optional)" />
        <input {...register('department_id')} className="p-2 border rounded flex-1" placeholder="department id (optional)" />
      </div>
      <div className="space-x-2">
        <button disabled={saving} type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </div>
    </form>
  );
}
