import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/db/profiles';
import type { Profile } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch profile
  const fetchProfile = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      console.log('Fetched profile:', profile);
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Successfully signed out');
      setUser(null);
      setProfile(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
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
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        console.log('User signed out, redirecting to home');
        navigate('/', { replace: true });
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    profile,
    isLoading,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}