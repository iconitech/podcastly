import { supabase } from '../supabase';

export async function getCurrentMonthCredits(userId: string) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .eq('month', firstDayOfMonth.toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function incrementSummaryCount(userId: string) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStr = firstDayOfMonth.toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .eq('month', monthStr)
    .single();

  if (!existing) {
    const { error } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        month: monthStr,
        summaries_used: 1
      });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_credits')
      .update({ summaries_used: existing.summaries_used + 1 })
      .eq('id', existing.id);
    if (error) throw error;
  }
}