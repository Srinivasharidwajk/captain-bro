import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determine if we should run in Mock mode
export const isMockSupabase = 
  !rawUrl || 
  !rawKey || 
  rawUrl.includes('your_supabase_project_url') || 
  rawKey.includes('your_supabase_anon_key');

const supabaseUrl = isMockSupabase ? 'https://placeholder-project.supabase.co' : rawUrl;
const supabaseAnonKey = isMockSupabase ? 'placeholder-key' : rawKey;

if (isMockSupabase) {
  console.log('Running in Mock Supabase Mode (local storage fallback)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
