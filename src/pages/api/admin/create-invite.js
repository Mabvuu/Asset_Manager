// src/pages/api/admin/create-invite.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  const token = crypto.randomBytes(16).toString('hex');
  const { error } = await supabase.from('invites').upsert([{ email, token, used: false }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ token });
}
