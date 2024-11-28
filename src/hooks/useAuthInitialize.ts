import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/lib/db/profiles';
import type { Profile } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

// Global state to track initialization
let isInitialized = false;

export function useAuthInitialize() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(!isInitialized);
  const { toast } = useToast();
  const initRef = useRef(isInitialized);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        console.log('Fetching profile for user:', userId);
        const profile = await getProfile(userId);
        if (mounted) {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user profile. Please try logging in again.",
          });
        }
      }
    };

    const initializeAuth = async () => {
      // Skip if already initialized
      if (initRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!mounted) return;

        if (session?.user) {
          console.log('Initial session found:', session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('No initial session found');
        }

        // Mark as initialized globally and locally
        isInitialized = true;
        initRef.current = true;
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { user, profile, isLoading };
}