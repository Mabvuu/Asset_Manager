// src/lib/checkAdmin.js
import { supabase } from './supabaseClient';

export async function isAdminByUserId(userId) {
  const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
  if (error) return false;
  return data?.role === 'admin';
}
