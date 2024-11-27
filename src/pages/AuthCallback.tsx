import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { handleAuthCallback } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { error } = await handleAuthCallback();
        
        if (error) {
          console.error('Auth error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem signing you in. Please try again.",
          });
          navigate('/login');
          return;
        }

        // Get the return path from state or default to podcasts
        const returnPath = searchParams.get('returnTo') || '/podcasts';

        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        
        navigate(returnPath, { replace: true });
      } catch (err) {
        console.error('Callback error:', err);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem signing you in. Please try again.",
        });
        navigate('/login');
      }
    };

    handleAuth();
  }, [navigate, toast, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}