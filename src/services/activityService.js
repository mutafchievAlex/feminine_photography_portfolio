import { supabase } from '../lib/supabase';

export const activityService = {
  async getRecentActivity(limit = 10) {
    const { data, error } = await supabase?.from('activity_logs')?.select(`
        *,
        user_profiles!user_id(full_name, email)
      `)?.order('created_at', { ascending: false })?.limit(limit);

    if (error) throw error;

    return data?.map(activity => ({
      id: activity?.id,
      activityType: activity?.activity_type,
      description: activity?.description,
      metadata: activity?.metadata,
      user: activity?.user_profiles,
      createdAt: activity?.created_at
    })) || [];
  },

  async getRecentActivities(limit = 10) {
    return this.getRecentActivity(limit);
  },

  async getUserActivity() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('activity_logs')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false })?.limit(20);

    if (error) throw error;

    return data?.map(activity => ({
      id: activity?.id,
      activityType: activity?.activity_type,
      description: activity?.description,
      metadata: activity?.metadata,
      createdAt: activity?.created_at
    })) || [];
  }
};