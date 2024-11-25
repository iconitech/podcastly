import { supabase } from './supabase';
import type { AuthError, User } from '@supabase/supabase-js';

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  if (error) throw error;
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
  const { error } = await supabase.auth.getSession();
  return { error };
}