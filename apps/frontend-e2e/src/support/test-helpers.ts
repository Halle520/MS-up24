import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseInstance, createSupabaseClient } from './orm-config';

/**
 * Helper functions for database operations in E2E tests using Supabase
 */

/**
 * Get the Supabase client instance for database operations in tests
 */
export function getSupabase(): SupabaseClient {
  const supabase = getSupabaseInstance();
  if (!supabase) {
    throw new Error(
      'Supabase client not initialized. Make sure global-setup.ts has run successfully.',
    );
  }
  return supabase;
}

/**
 * Helper to clear all data from a table (useful for test cleanup)
 */
export async function clearTable(tableName: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    throw new Error(`Failed to clear table ${tableName}: ${error.message}`);
  }
}

/**
 * Helper to create test data
 */
export async function createTestData<T>(
  tableName: string,
  data: Partial<T>,
): Promise<T> {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create test data in ${tableName}: ${error.message}`);
  }

  return result as T;
}

/**
 * Helper to find test data
 */
export async function findTestData<T>(
  tableName: string,
  where: Record<string, any>,
): Promise<T | null> {
  const supabase = getSupabase();
  let query = supabase.from(tableName).select('*');

  // Apply where conditions
  for (const [key, value] of Object.entries(where)) {
    query = query.eq(key, value);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to find test data in ${tableName}: ${error.message}`);
  }

  return data as T | null;
}

/**
 * Helper to update test data
 */
export async function updateTestData<T>(
  tableName: string,
  id: string,
  data: Partial<T>,
): Promise<T> {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update test data in ${tableName}: ${error.message}`);
  }

  return result as T;
}

/**
 * Helper to delete test data
 */
export async function deleteTestData(tableName: string, id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(tableName).delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete test data from ${tableName}: ${error.message}`);
  }
}
