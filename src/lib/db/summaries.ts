import { supabase } from '../supabase';
import type { Summary } from '@/types/supabase';

export async function createSummary(summary: Omit<Summary, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('summaries')
    .insert(summary)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserSummaries(userId: string) {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getEpisodeSummary(userId: string, episodeId: string) {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('episode_id', episodeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}