import { supabase } from './supabase';
import type { AuthError, User } from '@supabase/supabase-js';

export async function signInWithGoogle() {
  const returnPath = window.location.pathname;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnPath)}`
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

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
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