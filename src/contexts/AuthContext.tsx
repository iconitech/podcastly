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

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id)
          .then(profile => {
            if (mounted) {
              setProfile(profile);
            }
          })
          .catch(console.error)
          .finally(() => {
            if (mounted) {
              setIsLoading(false);
            }
          });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await getProfile(session.user.id);
          setProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
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