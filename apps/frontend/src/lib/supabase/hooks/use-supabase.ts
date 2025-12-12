/**
 * React hook for Supabase client
 */

import { useMemo } from 'react';
import { getSupabaseClient } from '../supabase-client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Hook to get Supabase client instance
 */
export function useSupabase(): SupabaseClient {
  return useMemo(() => getSupabaseClient(), []);
}
