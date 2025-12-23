import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { activityService } from '../../../services/activityService';
import { realtimeService } from '../../../services/realtimeService';
import { useLanguage } from '../../../hooks/useLanguage';

export default function RecentActivity() {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial activities
  useEffect(() => {
    fetchActivities();
  }, []);

  // Setup real-time subscription for new activities
  useEffect(() => {
    const subscription = realtimeService?.subscribeToActivityLogs((data) => {
      const { activity } = data;
      // Add new activity to the top of the list
      setActivities(prev => [activity, ...prev]?.slice(0, 10));
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService?.getRecentActivities(10);
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err?.message || 'Грешка при зареждане на активности');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      booking_created: 'Calendar',
      booking_confirmed: 'CheckCircle',
      booking_updated: 'Edit',
      gallery_image_added: 'Image',
      user_registered: 'UserPlus'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      booking_created: 'text-blue-600 bg-blue-50',
      booking_confirmed: 'text-green-600 bg-green-50',
      booking_updated: 'text-yellow-600 bg-yellow-50',
      gallery_image_added: 'text-purple-600 bg-purple-50',
      user_registered: 'text-pink-600 bg-pink-50'
    };
    return colors?.[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Преди момент';
    if (seconds < 3600) return `Преди ${Math.floor(seconds / 60)} мин`;
    if (seconds < 86400) return `Преди ${Math.floor(seconds / 3600)} ч`;
    return `Преди ${Math.floor(seconds / 86400)} дни`;
  };

  if (loading) {
    return (
      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-sophisticated-dark mb-6">
          Последна активност
        </h3>
        <div className="space-y-4">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Грешка при зареждане: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
          Последна активност
        </h3>
      </div>
      <div className="p-6">
        {activities?.length === 0 ? (
          <p className="text-center text-hierarchy-secondary py-8">
            Няма активност
          </p>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity?.activityType)}`}>
                  <Icon name={getActivityIcon(activity?.activityType)} size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sophisticated-dark">
                    {activity?.description}
                  </p>
                  {activity?.user && (
                    <p className="text-xs text-hierarchy-secondary mt-1">
                      {activity?.user?.full_name}
                    </p>
                  )}
                  <p className="text-xs text-hierarchy-secondary mt-1">
                    {formatTimeAgo(activity?.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}