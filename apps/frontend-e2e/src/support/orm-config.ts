import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Supabase configuration for E2E tests
 * This can be used in test fixtures or helper functions
 */
export function getSupabaseConfig() {
  // Load environment variables
  const envPath = path.join(__dirname, '../../../backend/.env');
  dotenv.config({ path: envPath });

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.E2E_SUPABASE_URL ||
    'https://your-project.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.E2E_SUPABASE_ANON_KEY ||
    'your-anon-key';

  return {
    url: supabaseUrl,
    key: supabaseKey,
  };
}

/**
 * Get Supabase client instance from global scope (set by global-setup)
 */
export function getSupabaseInstance(): SupabaseClient | undefined {
  return (globalThis as any).__E2E_SUPABASE__;
}

/**
 * Create a new Supabase client (useful for tests that need isolated connections)
 */
export function createSupabaseClient(): SupabaseClient {
  const config = getSupabaseConfig();
  return createClient(config.url, config.key);
}
