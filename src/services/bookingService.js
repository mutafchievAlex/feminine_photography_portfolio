import { supabase } from '../lib/supabase';

export const bookingService = {
  async create(bookingData) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('bookings')?.insert({
        client_id: user?.id,
        full_name: bookingData?.fullName,
        email: bookingData?.email,
        phone: bookingData?.phone,
        session_type: bookingData?.sessionType,
        preferred_date: bookingData?.preferredDate,
        alternate_date: bookingData?.alternateDate || null,
        location: bookingData?.location || null,
        vision: bookingData?.vision || null,
        inspiration: bookingData?.inspiration || null,
        special_requests: bookingData?.specialRequests || null,
        marketing_consent: bookingData?.marketingConsent || false,
        status: 'pending'
      })?.select()?.single();

    if (error) throw error;

    // Log activity
    await supabase?.rpc('log_activity', {
      activity_type_param: 'booking_created',
      description_param: `Нова резервация за ${bookingData?.sessionType} фотосесия`,
      metadata_param: { booking_id: data?.id, session_type: bookingData?.sessionType }
    });

    return {
      id: data?.id,
      clientId: data?.client_id,
      fullName: data?.full_name,
      email: data?.email,
      phone: data?.phone,
      sessionType: data?.session_type,
      preferredDate: data?.preferred_date,
      alternateDate: data?.alternate_date,
      location: data?.location,
      vision: data?.vision,
      inspiration: data?.inspiration,
      specialRequests: data?.special_requests,
      marketingConsent: data?.marketing_consent,
      status: data?.status,
      createdAt: data?.created_at
    };
  },

  async getUserBookings() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('bookings')?.select('*')?.eq('client_id', user?.id)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(booking => ({
      id: booking?.id,
      fullName: booking?.full_name,
      email: booking?.email,
      phone: booking?.phone,
      sessionType: booking?.session_type,
      preferredDate: booking?.preferred_date,
      alternateDate: booking?.alternate_date,
      location: booking?.location,
      vision: booking?.vision,
      inspiration: booking?.inspiration,
      specialRequests: booking?.special_requests,
      status: booking?.status,
      adminNotes: booking?.admin_notes,
      createdAt: booking?.created_at,
      updatedAt: booking?.updated_at
    })) || [];
  },

  async getAllBookings() {
    const { data, error } = await supabase?.from('bookings')?.select(`
        *,
        user_profiles!client_id(full_name, email, phone)
      `)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(booking => ({
      id: booking?.id,
      fullName: booking?.full_name,
      email: booking?.email,
      phone: booking?.phone,
      sessionType: booking?.session_type,
      preferredDate: booking?.preferred_date,
      alternateDate: booking?.alternate_date,
      location: booking?.location,
      vision: booking?.vision,
      inspiration: booking?.inspiration,
      specialRequests: booking?.special_requests,
      status: booking?.status,
      adminNotes: booking?.admin_notes,
      client: booking?.user_profiles,
      createdAt: booking?.created_at,
      updatedAt: booking?.updated_at
    })) || [];
  },

  async updateStatus(bookingId, status, adminNotes) {
    const { data, error } = await supabase?.from('bookings')?.update({ 
        status, 
        admin_notes: adminNotes,
        updated_at: new Date()?.toISOString()
      })?.eq('id', bookingId)?.select()?.single();

    if (error) throw error;

    // Log activity
    await supabase?.rpc('log_activity', {
      activity_type_param: 'booking_updated',
      description_param: `Статус на резервация променен на ${status}`,
      metadata_param: { booking_id: bookingId, new_status: status }
    });

    return {
      id: data?.id,
      status: data?.status,
      adminNotes: data?.admin_notes,
      updatedAt: data?.updated_at
    };
  },

  async getStats() {
    const { data, error } = await supabase?.from('bookings')?.select('status, session_type, created_at');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(b => b?.status === 'pending')?.length || 0,
      confirmed: data?.filter(b => b?.status === 'confirmed')?.length || 0,
      completed: data?.filter(b => b?.status === 'completed')?.length || 0,
      cancelled: data?.filter(b => b?.status === 'cancelled')?.length || 0,
      thisMonth: data?.filter(b => {
        const date = new Date(b.created_at);
        const now = new Date();
        return date?.getMonth() === now?.getMonth() && 
               date?.getFullYear() === now?.getFullYear();
      })?.length || 0
    };

    return stats;
  }
};