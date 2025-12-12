import type { FullConfig } from '@playwright/test';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Global setup for Playwright E2E tests
 * Initializes Supabase client for database operations in tests
 */
async function globalSetup(config: FullConfig): Promise<void> {
  // Load environment variables
  const envPath = path.join(__dirname, '../../../backend/.env');
  dotenv.config({ path: envPath });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.E2E_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.E2E_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      '⚠️  Supabase credentials not configured. Database operations in tests will be skipped.',
    );
    return;
  }

  try {
    // Initialize Supabase client for E2E tests
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase.from('images').select('count').limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is okay for fresh setup
      console.warn('⚠️  Supabase connection test:', error.message);
    }

    // Store Supabase client in global scope for use in tests
    (globalThis as any).__E2E_SUPABASE__ = supabase;

    console.log('✅ Supabase client initialized successfully for E2E tests');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client for E2E tests:', error);
    throw error;
  }
}

export default globalSetup;
