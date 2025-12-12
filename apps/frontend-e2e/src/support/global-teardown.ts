import type { FullConfig } from '@playwright/test';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Global teardown for Playwright E2E tests
 * Cleans up Supabase client (no explicit close needed, but we can clean up test data)
 */
async function globalTeardown(config: FullConfig): Promise<void> {
  const supabase = (globalThis as any).__E2E_SUPABASE__ as
    | SupabaseClient
    | undefined;

  if (supabase) {
    try {
      // Optionally clean up test data here if needed
      // await supabase.from('images').delete().eq('test', true);
      console.log('✅ Supabase client cleanup completed');
    } catch (error) {
      console.error('❌ Error during Supabase cleanup:', error);
    }
  }
}

export default globalTeardown;
