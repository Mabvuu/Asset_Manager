// src/pages/api/admin/create-department.js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name } = req.body;
  const { error } = await supabase.from('departments').insert([{ name }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
}
