import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSummaries } from '@/lib/db/summaries';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from '@/lib/utils';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function MySummaries() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-summaries' } });
      return;
    }

    const fetchSummaries = async () => {
      try {
        setIsLoading(true);
        const data = await getUserSummaries(user.id);
        setSummaries(data);
        setHasMore(data.length >= ITEMS_PER_PAGE);
      } catch (err) {
        console.error('Error fetching summaries:', err);
        setError('Failed to load summaries');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your summaries. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [user, navigate, toast]);

  const paginatedSummaries = summaries.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-neutral-800"
          onClick={() => navigate("/podcasts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to podcasts
        </Button>

        <h1 className="text-4xl font-bold mb-4">My Summaries</h1>
        <p className="text-xl text-neutral-400 mb-12">
          View all your podcast episode summaries
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <div className="flex items-center text-red-500 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Error loading summaries</h3>
            </div>
            <p className="text-neutral-400">{error}</p>
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400">You haven't generated any summaries yet.</p>
            <Button
              className="mt-4 bg-green-500 hover:bg-green-600 text-black"
              onClick={() => navigate('/podcasts')}
            >
              Browse Podcasts
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedSummaries.map((summary) => (
              <div
                key={summary.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{summary.episode_title}</h3>
                <div className="text-sm text-neutral-400 mb-4">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  Generated {formatDistanceToNow(new Date(summary.created_at))} ago
                </div>
                <div className="prose prose-invert max-w-none">
                  {summary.summary_text.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-neutral-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  className="hover:bg-neutral-800"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}