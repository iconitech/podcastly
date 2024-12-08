import { supabase } from './supabase';
import type { AuthError } from '@supabase/supabase-js';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  
  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function handleAuthCallback(): Promise<{ error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.search);
    
    if (error) {
      console.error('Auth error:', error);
      return { error };
    }

    if (!data.session) {
      return { error: new Error('No session') as AuthError };
    }

    return { error: null };
  } catch (error) {
    console.error('Auth callback error:', error);
    return { error: error as AuthError };
  }
}