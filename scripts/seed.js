// scripts/seed.js
import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seed() {
  try {
    console.log('Seeding departments...');
    await supabase.from('departments').upsert([
      { name: 'IT' },
      { name: 'Finance' },
      { name: 'Logistics' },
    ]);

    console.log('Seeding categories...');
    await supabase.from('categories').upsert([
      { name: 'Laptop' },
      { name: 'Phone' },
      { name: 'Vehicle' },
      { name: 'Furniture' },
    ]);

    console.log('Seeding admin user record...');
    const adminEmail = 'admin@example.com';

    const insertUser = await supabase
      .from('users')
      .upsert([{ email: adminEmail, role: 'admin' }], { onConflict: 'email' });

    if (insertUser.error) throw insertUser.error;

    const { data: cat } = await supabase
      .from('categories')
      .select('id,name')
      .eq('name', 'Laptop')
      .maybeSingle();

    const { data: dept } = await supabase
      .from('departments')
      .select('id,name')
      .eq('name', 'IT')
      .maybeSingle();

    const { data: userRow } = await supabase
      .from('users')
      .select('id,email')
      .eq('email', adminEmail)
      .maybeSingle();

    console.log('Seeding assets...');
    const assets = [];

    for (let i = 1; i <= 5; i++) {
      const payload = {
        name: `Seed Asset ${i}`,
        description: 'Seeded asset for testing',
        category_id: cat?.id || null,
        department_id: dept?.id || null,
        created_by: userRow?.id || null,
        created_at: new Date().toISOString(),
      };

      payload.current_hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(payload))
        .digest('hex');

      assets.push(payload);
    }

    const { error: assetsError } = await supabase.from('assets').insert(assets);
    if (assetsError) throw assetsError;

    console.log('Seeding complete.');
    process.exit(0);

  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
