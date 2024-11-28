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
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          console.log('Initial session found:', session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
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

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to home');
        navigate('/', { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    profile,
    isLoading,
    signOut: async () => {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate('/', { replace: true });
    },
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