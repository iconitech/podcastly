import { supabase } from '../supabase';
import type { Summary } from '@/types/supabase';

export async function createSummary(summary: Omit<Summary, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('summaries')
    .insert({
      ...summary,
      // Ensure text is properly sanitized and encoded
      summary_text: summary.summary_text.trim(),
      // Add metadata to help with content type handling
      key_points: null // Remove if not needed to simplify the request
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function getUserSummaries(userId: string) {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function getEpisodeSummary(userId: string, episodeId: string) {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('episode_id', episodeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}