/**
 * Supabase client configuration
 * This client is used for direct Supabase operations from the frontend
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Get Supabase URL from environment variables
 */
const getSupabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not configured. Please set it in your .env file.'
    );
  }
  return url;
};

/**
 * Get Supabase anon key from environment variables
 */
const getSupabaseAnonKey = (): string => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please set it in your .env file.'
    );
  }
  return key;
};

/**
 * Create and export Supabase client instance
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Get Supabase client instance (singleton pattern)
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }
  return supabaseClient;
}

/**
 * Initialize Supabase client (call this early in your app)
 */
export function initSupabaseClient(): SupabaseClient {
  return getSupabaseClient();
}

export default getSupabaseClient;
