import { useState, useEffect } from 'react';
import { getPodcastFeed, type PodcastFeed } from '@/lib/rss';

export function usePodcastFeed(podcastId: string, feedUrl: string) {
  const [feed, setFeed] = useState<PodcastFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchFeed() {
      try {
        setIsLoading(true);
        setError(null);
        const feedData = await getPodcastFeed(podcastId, feedUrl);
        if (mounted) {
          setFeed(feedData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchFeed();

    return () => {
      mounted = false;
    };
  }, [podcastId, feedUrl]);

  return { feed, isLoading, error };
}