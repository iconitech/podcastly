import { supabase } from './supabase';

export interface PodcastItem {
  title: string;
  pubDate: string;
  guid: string;
  contentSnippet: string;
  audioUrl: string; // Add audioUrl field
  itunes: {
    duration: string;
  };
}

export interface PodcastFeed {
  items: PodcastItem[];
  image: { url: string };
  description: string;
}

const CORS_PROXY = 'https://corsproxy.io/?';
const MAX_EPISODES = 20;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function getPodcastFeed(podcastId: string, feedUrl: string): Promise<PodcastFeed> {
  try {
    // Try cache first
    const { data: cached, error: cacheError } = await supabase
      .from('podcast_feeds')
      .select('feed_data, last_fetched')
      .eq('podcast_id', podcastId)
      .single();

    const now = new Date();
    const shouldRefresh = !cached?.last_fetched || 
      (now.getTime() - new Date(cached.last_fetched).getTime()) > CACHE_TTL;

    if (!cacheError && cached?.feed_data && !shouldRefresh) {
      console.log('Using cached feed for podcast:', podcastId);
      return {
        ...cached.feed_data,
        items: (cached.feed_data as PodcastFeed).items.slice(0, MAX_EPISODES)
      } as PodcastFeed;
    }

    console.log('Fetching fresh feed for podcast:', podcastId);

    // Fetch feed
    const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl));
    if (!response.ok) throw new Error('Failed to fetch feed');
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Parse feed
    const feed: PodcastFeed = {
      description: xmlDoc.querySelector('channel > description')?.textContent || '',
      image: {
        url: xmlDoc.querySelector('channel > image > url')?.textContent || 
             xmlDoc.querySelector('channel > itunes\\:image')?.getAttribute('href') || ''
      },
      items: Array.from(xmlDoc.querySelectorAll('item'))
        .slice(0, MAX_EPISODES)
        .map(item => ({
          title: item.querySelector('title')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          guid: item.querySelector('guid')?.textContent || '',
          contentSnippet: item.querySelector('description')?.textContent || '',
          audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '', // Extract audio URL
          itunes: {
            duration: item.querySelector('itunes\\:duration')?.textContent || ''
          }
        }))
    };

    // Update cache with ON CONFLICT DO UPDATE
    const { error: upsertError } = await supabase
      .from('podcast_feeds')
      .upsert({
        podcast_id: podcastId,
        feed_data: feed,
        last_fetched: now.toISOString()
      }, {
        onConflict: 'podcast_id'
      });

    if (upsertError) {
      console.error('Error updating feed cache:', upsertError);
    } else {
      console.log('Successfully cached feed for podcast:', podcastId);
    }

    return feed;
  } catch (error) {
    console.error('Error fetching podcast feed:', error);
    throw error;
  }
}