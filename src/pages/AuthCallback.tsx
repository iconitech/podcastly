import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '@/lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback().then(({ error }) => {
      if (error) {
        navigate('/login?error=auth-error');
      } else {
        navigate('/podcasts');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}