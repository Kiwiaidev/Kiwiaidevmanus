import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please check your environment variables.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
