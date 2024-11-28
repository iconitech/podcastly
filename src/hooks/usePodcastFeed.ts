import { useState, useEffect, useCallback } from 'react';
import { getPodcastFeed, type PodcastFeed } from '@/lib/rss';
import { useToast } from '@/hooks/use-toast';

export function usePodcastFeed(podcastId: string, feedUrl: string) {
  const [feed, setFeed] = useState<PodcastFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching feed for podcast:', podcastId);
      const feedData = await getPodcastFeed(podcastId, feedUrl);
      setFeed(feedData);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load podcast episodes. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [podcastId, feedUrl, toast]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetchFeed();
    }

    return () => {
      mounted = false;
    };
  }, [fetchFeed]);

  return { feed, isLoading, error, refetch: fetchFeed };
}