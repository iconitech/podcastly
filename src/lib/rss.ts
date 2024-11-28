import { supabase } from './supabase';

export interface PodcastItem {
  title: string;
  pubDate: string;
  guid: string;
  contentSnippet: string;
  audioUrl: string;
  itunes: {
    duration: string;
    summary?: string;
    explicit?: string;
    image?: string;
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

function cleanText(text: string): string {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
}

export async function getPodcastFeed(podcastId: string, feedUrl: string): Promise<PodcastFeed> {
  try {
    console.log('Fetching podcast feed:', podcastId);

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
      return cached.feed_data as PodcastFeed;
    }

    console.log('Fetching fresh feed for podcast:', podcastId);

    // Fetch feed
    const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl));
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    if (xmlDoc.querySelector('parsererror')) {
      throw new Error('Failed to parse XML feed');
    }

    // Parse feed
    const feed: PodcastFeed = {
      description: cleanText(xmlDoc.querySelector('channel > description')?.textContent || ''),
      image: {
        url: xmlDoc.querySelector('channel > image > url')?.textContent || 
             xmlDoc.querySelector('channel > itunes\\:image')?.getAttribute('href') || ''
      },
      items: Array.from(xmlDoc.querySelectorAll('item'))
        .slice(0, MAX_EPISODES)
        .map(item => {
          const enclosure = item.querySelector('enclosure');
          const audioUrl = enclosure?.getAttribute('url') || '';
          
          // Get duration using getElementsByTagName for better namespace handling
          const durationElement = item.getElementsByTagName('itunes:duration')[0];
          const duration = durationElement?.textContent?.trim() || '0';

          return {
            title: cleanText(item.querySelector('title')?.textContent || ''),
            pubDate: item.querySelector('pubDate')?.textContent || '',
            guid: cleanText(item.querySelector('guid')?.textContent || ''),
            contentSnippet: cleanText(
              item.querySelector('description')?.textContent || 
              item.querySelector('content\\:encoded')?.textContent || ''
            ),
            audioUrl,
            itunes: {
              duration,
              summary: cleanText(item.querySelector('itunes\\:summary')?.textContent || ''),
              explicit: item.querySelector('itunes\\:explicit')?.textContent || 'no',
              image: item.querySelector('itunes\\:image')?.getAttribute('href') || ''
            }
          };
        })
    };

    // Update cache
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