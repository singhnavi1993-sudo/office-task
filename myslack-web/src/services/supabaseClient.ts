import { createClient } from '@supabase/supabase-js';

// Read Supabase Credentials from environment variables or fallback
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export interface SupabaseUserRecord {
  id: string;
  display_name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  custom_task?: string;
  avatar_url?: string;
  is_approved: boolean;
  registered_ip?: string;
  created_at: string;
}

// 1. Register User in Supabase Cloud DB
export async function registerSupabaseUser(data: {
  displayName: string;
  email: string;
  password?: string;
  role: string;
  currentTask?: string;
  clientIp?: string;
  isApproved: boolean;
}) {
  if (!supabase) return null;

  try {
    const newRecord = {
      display_name: data.displayName,
      email: data.email.toLowerCase(),
      password: data.password || '123456',
      role: data.role,
      status: 'active',
      custom_task: data.currentTask || 'Joined MySlack Workspace',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.displayName)}`,
      is_approved: data.isApproved,
      registered_ip: data.clientIp || '127.0.0.1',
      created_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabase
      .from('myslack_users')
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.warn('Supabase Insert Error:', error.message);
      return null;
    }

    return inserted;
  } catch (err) {
    console.error('Supabase Registration Failed:', err);
    return null;
  }
}

// 2. Fetch All Registered Users from Supabase Cloud DB
export async function fetchSupabaseUsers(): Promise<SupabaseUserRecord[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('myslack_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase Fetch Users Error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase User Fetch Failed:', err);
    return [];
  }
}
