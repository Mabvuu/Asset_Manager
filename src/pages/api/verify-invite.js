// src/pages/api/verify-invite.js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, token } = req.body;
  const { data, error } = await supabase.from('invites').select('*').eq('email', email).eq('token', token).single();
  if (error || !data || data.used) return res.status(400).json({ ok: false, error: 'invalid' });
  // mark used
  await supabase.from('invites').update({ used: true }).eq('id', data.id);
  res.json({ ok: true });
}
