import { supabase } from '../lib/supabase';

/**
 * Real-time service for handling Supabase subscriptions
 * Provides live updates for bookings, messages, and gallery deliveries
 */

class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
  }

  /**
   * Subscribe to booking status updates
   * @param {Function} callback - Function to call when booking status changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToBookingUpdates(callback) {
    const channel = supabase?.channel('booking_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking update received:', payload);
          callback({
            type: payload?.eventType,
            booking: payload?.new || payload?.old,
            oldBooking: payload?.old
          });
        }
      )?.subscribe();

    this.subscriptions?.set('bookings', channel);

    return {
      unsubscribe: () => this.unsubscribe('bookings')
    };
  }

  /**
   * Subscribe to specific booking status changes
   * @param {string} bookingId - ID of the booking to watch
   * @param {Function} callback - Function to call when status changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToBookingStatus(bookingId, callback) {
    const channel = supabase?.channel(`booking_status_${bookingId}`)?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`
        },
        (payload) => {
          console.log('Booking status changed:', payload);
          if (payload?.old?.status !== payload?.new?.status) {
            callback({
              bookingId: payload?.new?.id,
              oldStatus: payload?.old?.status,
              newStatus: payload?.new?.status,
              booking: payload?.new
            });
          }
        }
      )?.subscribe();

    this.subscriptions?.set(`booking_${bookingId}`, channel);

    return {
      unsubscribe: () => this.unsubscribe(`booking_${bookingId}`)
    };
  }

  /**
   * Subscribe to new client messages/activity logs
   * @param {Function} callback - Function to call when new activity is logged
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToActivityLogs(callback) {
    const channel = supabase?.channel('activity_logs')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        (payload) => {
          console.log('New activity log:', payload);
          callback({
            activity: payload?.new
          });
        }
      )?.subscribe();

    this.subscriptions?.set('activity_logs', channel);

    return {
      unsubscribe: () => this.unsubscribe('activity_logs')
    };
  }

  /**
   * Subscribe to gallery delivery notifications
   * @param {Function} callback - Function to call when gallery is delivered
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToGalleryDeliveries(callback) {
    const channel = supabase?.channel('gallery_deliveries')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gallery_images'
        },
        (payload) => {
          console.log('New gallery image:', payload);
          callback({
            image: payload?.new
          });
        }
      )?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'gallery_images',
          filter: 'is_published=eq.true'
        },
        (payload) => {
          console.log('Gallery image published:', payload);
          if (!payload?.old?.is_published && payload?.new?.is_published) {
            callback({
              image: payload?.new,
              type: 'published'
            });
          }
        }
      )?.subscribe();

    this.subscriptions?.set('gallery_deliveries', channel);

    return {
      unsubscribe: () => this.unsubscribe('gallery_deliveries')
    };
  }

  /**
   * Subscribe to user-specific notifications
   * @param {string} userId - User ID to filter notifications
   * @param {Function} callback - Function to call on new notifications
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToUserNotifications(userId, callback) {
    const channel = supabase?.channel(`user_notifications_${userId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('User booking update:', payload);
          callback({
            type: 'booking_update',
            data: payload?.new || payload?.old,
            eventType: payload?.eventType
          });
        }
      )?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('User activity:', payload);
          callback({
            type: 'activity',
            data: payload?.new
          });
        }
      )?.subscribe();

    this.subscriptions?.set(`user_${userId}`, channel);

    return {
      unsubscribe: () => this.unsubscribe(`user_${userId}`)
    };
  }

  /**
   * Unsubscribe from a specific channel
   * @param {string} key - Subscription key
   */
  async unsubscribe(key) {
    const channel = this.subscriptions?.get(key);
    if (channel) {
      await supabase?.removeChannel(channel);
      this.subscriptions?.delete(key);
      console.log(`Unsubscribed from ${key}`);
    }
  }

  /**
   * Unsubscribe from all active channels
   */
  async unsubscribeAll() {
    const promises = Array.from(this.subscriptions?.keys())?.map(key => 
      this.unsubscribe(key)
    );
    await Promise.all(promises);
    console.log('Unsubscribed from all channels');
  }

  /**
   * Get list of active subscriptions
   * @returns {Array} Array of active subscription keys
   */
  getActiveSubscriptions() {
    return Array.from(this.subscriptions?.keys());
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// Export class for testing
export { RealtimeService };