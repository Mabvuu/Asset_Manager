// src/pages/api/sync-queue.js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { queue = [] } = req.body;
  // naive processor: insert assets found in queue
  try {
    for (const item of queue) {
      const { action, payload } = item;
      if (action === 'create_asset') {
        await supabase.from('assets').insert([payload]);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
