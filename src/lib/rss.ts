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

function cleanDuration(duration: string): string {
  // If duration is in seconds (numeric string)
  if (/^\d+$/.test(duration)) {
    const totalSeconds = parseInt(duration, 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // If duration is already in HH:MM:SS or MM:SS format, return as is
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(duration)) {
    return duration;
  }

  // Default to 0:00 if no valid format is found
  return '0:00';
}

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
      return cached.feed_data as PodcastFeed;
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
      description: cleanText(xmlDoc.querySelector('channel > description')?.textContent || ''),
      image: {
        url: xmlDoc.querySelector('channel > image > url')?.textContent || 
             xmlDoc.querySelector('channel > itunes\\:image')?.getAttribute('href') || ''
      },
      items: Array.from(xmlDoc.querySelectorAll('item'))
        .slice(0, MAX_EPISODES)
        .map(item => {
          // Get duration using getElementsByTagName for better namespace handling
          const durationElement = item.getElementsByTagName('itunes:duration')[0];
          const duration = durationElement?.textContent?.trim() || '0';

          return {
            title: cleanText(item.querySelector('title')?.textContent || ''),
            pubDate: item.querySelector('pubDate')?.textContent || '',
            guid: item.querySelector('guid')?.textContent?.trim() || '',
            contentSnippet: cleanText(
              item.querySelector('description')?.textContent || 
              item.querySelector('content\\:encoded')?.textContent || ''
            ),
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
            itunes: {
              duration: cleanDuration(duration),
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
    }

    return feed;
  } catch (error) {
    console.error('Error fetching podcast feed:', error);
    throw error;
  }
}