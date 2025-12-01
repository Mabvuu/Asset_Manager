// src/pages/api/verify-asset.js
import { createClient } from '@supabase/supabase-js';
import { sha256Hex } from '../../lib/hashUtil';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  const { data: asset } = await supabase.from('assets').select('*').eq('id', id).single();
  if (!asset) return res.status(404).json({ ok: false, error: 'not found' });
  const recomputed = sha256Hex({
    name: asset.name,
    description: asset.description,
    category_id: asset.category_id,
    department_id: asset.department_id,
    created_at: asset.created_at,
  });
  res.json({ ok: recomputed === asset.current_hash, current_hash: asset.current_hash, recomputed });
}
