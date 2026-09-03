import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL_KEY = 'play_learn_compete_sb_url';
const SUPABASE_ANON_KEY = 'play_learn_compete_sb_key';

export const DEFAULT_SUPABASE_URL = 'https://wzdypitewjtpzgrsssds.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZHlwaXRld2p0cHpncnNzc2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDg2NDEsImV4cCI6MjEwNDAyNDY0MX0.fiIioOHYI54owimeH3aj_Bd8A5i_EkoRvTgOxetixzE';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Get active Supabase configuration from environment or localStorage override
 */
export function getSupabaseConfig(): SupabaseConfig {
  let url = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  let anonKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  try {
    const savedUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const savedKey = localStorage.getItem(SUPABASE_ANON_KEY);
    if (savedUrl && savedUrl.trim()) url = savedUrl.trim();
    if (savedKey && savedKey.trim()) anonKey = savedKey.trim();
  } catch {
    // Local storage unavailable
  }

  if (!url) url = DEFAULT_SUPABASE_URL;
  if (!anonKey) anonKey = DEFAULT_SUPABASE_ANON_KEY;

  return { url, anonKey };
}

/**
 * Save custom Supabase credentials from UI settings
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    if (url.trim()) {
      localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(SUPABASE_URL_KEY);
    }

    if (anonKey.trim()) {
      localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(SUPABASE_ANON_KEY);
    }
  } catch {
    // Ignored
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

/**
 * Get initialized Supabase client instance or null if not configured
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch {
    return null;
  }
}

/**
 * Check if valid Supabase connection details are present
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null;
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    const { error } = await client.from('student_profiles').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, connection to Supabase itself succeeded
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { 
          ok: true, 
          message: 'Connected to Supabase! (Table "student_profiles" needs to be created with the SQL setup snippet).' 
        };
      }
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Connected to Supabase database successfully!' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Network error connecting to Supabase.' };
  }
}
