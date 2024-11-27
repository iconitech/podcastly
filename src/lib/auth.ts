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
    // First try to get session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session) {
      return { error: null };
    }

    // If no session, try to parse hash params
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });

        if (error) throw error;
        return { error: null };
      }
    }

    // If we get here, check for error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      throw new Error(errorDescription || error);
    }

    return { error: null };
  } catch (error) {
    console.error('Auth callback error:', error);
    return { error: error as AuthError };
  }
}