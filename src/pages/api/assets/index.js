// src/pages/api/assets/index.js
import { createClient } from '@supabase/supabase-js';
import { sha256Hex } from '../../../lib/hashUtil';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const hash = sha256Hex(body);
    body.current_hash = hash;
    const { data, error } = await supabase.from('assets').insert([body]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    // write history
    await supabase.from('asset_history').insert([{ asset_id: data.id, hash, previous_hash: null, changed_by: body.created_by || null, data: body }]);
    return res.status(201).json(data);
  }

  res.status(405).end();
}
