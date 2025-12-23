import { useState, useEffect, useCallback, useRef } from 'react';
import { realtimeService } from '../services/realtimeService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing real-time notifications
 * Provides toast notifications for booking updates, messages, and gallery deliveries
 */
export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const subscriptionsRef = useRef([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    return newNotification;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev?.map(n => n?.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear notification
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev?.find(n => n?.id === notificationId);
      if (notification && !notification?.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev?.filter(n => n?.id !== notificationId);
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Request notification permission on mount
    requestNotificationPermission();

    // Subscribe to booking updates
    const bookingSub = realtimeService?.subscribeToBookingUpdates((data) => {
      const { type, booking } = data;
      
      if (type === 'UPDATE' && booking?.status) {
        addNotification({
          type: 'booking_status',
          title: 'Booking Status Updated',
          message: `Your booking status changed to: ${booking?.status}`,
          data: booking
        });
      } else if (type === 'INSERT') {
        addNotification({
          type: 'new_booking',
          title: 'New Booking Created',
          message: 'A new booking has been created',
          data: booking
        });
      }
    });

    // Subscribe to activity logs (messages)
    const activitySub = realtimeService?.subscribeToActivityLogs((data) => {
      const { activity } = data;
      
      if (activity?.action_type === 'message' || activity?.description?.toLowerCase()?.includes('message')) {
        addNotification({
          type: 'message',
          title: 'New Message',
          message: activity?.description || 'You have a new message',
          data: activity
        });
      }
    });

    // Subscribe to gallery deliveries
    const gallerySub = realtimeService?.subscribeToGalleryDeliveries((data) => {
      const { image, type } = data;
      
      if (type === 'published') {
        addNotification({
          type: 'gallery_delivery',
          title: 'Gallery Delivered',
          message: `New ${image?.category} photo has been published`,
          data: image
        });
      }
    });

    // Subscribe to user-specific notifications
    const userSub = realtimeService?.subscribeToUserNotifications(user?.id, (data) => {
      const { type: notifType, data: notifData, eventType } = data;
      
      if (notifType === 'booking_update' && eventType === 'UPDATE') {
        addNotification({
          type: 'personal_booking',
          title: 'Your Booking Updated',
          message: `Booking #${notifData?.id?.slice(0, 8)} status: ${notifData?.status}`,
          data: notifData
        });
      }
    });

    subscriptionsRef.current = [bookingSub, activitySub, gallerySub, userSub];

    // Cleanup subscriptions
    return () => {
      subscriptionsRef?.current?.forEach(sub => sub?.unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [user, addNotification, requestNotificationPermission]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    requestNotificationPermission
  };
};