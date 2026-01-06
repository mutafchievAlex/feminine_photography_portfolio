import { supabase } from '../lib/supabase';

export const bookingService = {
  async create(bookingData) {
    // Get user if authenticated, otherwise use null
    let userId = null;
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      userId = user?.id;
    } catch (err) {
      // User not authenticated - allow anonymous bookings
      console.log('Anonymous booking submission');
    }

    const { data, error } = await supabase?.from('bookings')?.insert({
        client_id: userId,
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

    // Create admin notification
    try {
      await supabase?.from('admin_notifications')?.insert({
        title: `Нова резервация от ${bookingData?.fullName}`,
        message: `${bookingData?.fullName} направи резервация за ${bookingData?.sessionType} на дата ${bookingData?.preferredDate}`,
        type: 'new_booking',
        booking_id: data?.id,
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (notifErr) {
      // Log notification error but don't fail the booking
      console.warn('Failed to create admin notification:', notifErr?.message);
    }

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

  async updateBookingWithDetails(bookingId, bookingData) {
    const { data, error } = await supabase?.from('bookings')?.update({
      full_name: bookingData?.fullName,
      email: bookingData?.email,
      phone: bookingData?.phone,
      location: bookingData?.location,
      preferred_date: bookingData?.preferredDate,
      vision: bookingData?.vision,
      special_requests: bookingData?.specialRequests,
      admin_notes: bookingData?.adminNotes,
      updated_at: new Date()?.toISOString()
    })?.eq('id', bookingId)?.select()?.single();

    if (error) throw error;

    // Log activity
    await supabase?.rpc('log_activity', {
      activity_type_param: 'booking_updated',
      description_param: `Детайли на резервация актуализирани от администратор`,
      metadata_param: { booking_id: bookingId }
    });

    return {
      id: data?.id,
      fullName: data?.full_name,
      email: data?.email,
      phone: data?.phone,
      location: data?.location,
      preferredDate: data?.preferred_date,
      vision: data?.vision,
      specialRequests: data?.special_requests,
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
  },

  // Admin notification methods
  async getAdminNotifications() {
    const { data, error } = await supabase
      ?.from('admin_notifications')
      ?.select('*')
      ?.order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])?.map(notif => ({
      id: notif?.id,
      title: notif?.title,
      message: notif?.message,
      type: notif?.type,
      bookingId: notif?.booking_id,
      read: notif?.read,
      createdAt: notif?.created_at,
      updatedAt: notif?.updated_at
    }));
  },

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      ?.from('admin_notifications')
      ?.update({ read: true, updated_at: new Date().toISOString() })
      ?.eq('id', notificationId)
      ?.select()
      ?.single();

    if (error) throw error;

    return {
      id: data?.id,
      read: data?.read,
      updatedAt: data?.updated_at
    };
  },

  async deleteNotification(notificationId) {
    const { error } = await supabase
      ?.from('admin_notifications')
      ?.delete()
      ?.eq('id', notificationId);

    if (error) throw error;

    return true;
  }

};
