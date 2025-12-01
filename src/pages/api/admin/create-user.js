// src/pages/api/admin/create-user.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, role = 'user' } = req.body;
  try {
    // create user in auth
    const { data: user, error: createErr } = await supabase.auth.admin.createUser({ email, password: Math.random().toString(36).slice(2, 10) });
    if (createErr) return res.status(400).json({ error: createErr.message });
    // insert into users table
    const { error } = await supabase.from('users').insert([{ id: user.user.id, email, role }]);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ id: user.user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
