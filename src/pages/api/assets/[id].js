// src/pages/api/assets/[id].js
import { createClient } from '@supabase/supabase-js';
import { sha256Hex } from '../../../../lib/hashUtil';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'not found' });
    return res.json(data);
  }
  if (req.method === 'PUT') {
    const body = req.body;
    const newHash = sha256Hex(body);
    const { data, error } = await supabase.from('assets').update({ ...body, current_hash: newHash, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    // fetch previous
    const prev = await supabase.from('asset_history').select('hash').eq('asset_id', id).order('created_at', { ascending: false }).limit(1).single();
    const prevHash = prev?.data?.hash || null;
    await supabase.from('asset_history').insert([{ asset_id: id, hash: newHash, previous_hash: prevHash, changed_by: body.updated_by || null, data: body }]);
    return res.json(data);
  }
  res.status(405).end();
}
