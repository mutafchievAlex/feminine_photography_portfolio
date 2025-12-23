import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Notification Bell Component
 * Displays real-time notifications with unread count badge
 */
const NotificationBell = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll
  } = useRealtimeNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_status': case'new_booking': case'personal_booking':
        return '📅';
      case 'message':
        return '💬';
      case 'gallery_delivery':
        return '📸';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t?.notifications?.justNow || 'Just now';
    if (diffMins < 60) return `${diffMins}${t?.notifications?.minutesAgo || 'm ago'}`;
    if (diffHours < 24) return `${diffHours}${t?.notifications?.hoursAgo || 'h ago'}`;
    if (diffDays < 7) return `${diffDays}${t?.notifications?.daysAgo || 'd ago'}`;
    return date?.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      markAsRead(notification?.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label={t?.notifications?.label || 'Notifications'}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {t?.notifications?.title || 'Notifications'}
            </h3>
            {notifications?.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  title={t?.notifications?.markAllRead || 'Mark all as read'}
                >
                  <CheckCheck size={16} />
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700"
                  title={t?.notifications?.clearAll || 'Clear all'}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications?.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-2 text-gray-300" />
                <p>{t?.notifications?.noNotifications || 'No notifications yet'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification?.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification?.type)}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification?.title}
                          </h4>
                          {!notification?.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {formatTimestamp(notification?.timestamp)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification?.read && (
                          <button
                            onClick={(e) => {
                              e?.stopPropagation();
                              markAsRead(notification?.id);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title={t?.notifications?.markRead || 'Mark as read'}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            clearNotification(notification?.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title={t?.notifications?.clear || 'Clear'}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;