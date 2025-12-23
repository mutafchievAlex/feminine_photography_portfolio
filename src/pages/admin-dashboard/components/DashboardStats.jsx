import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { bookingService } from '../../../services/bookingService';
import { realtimeService } from '../../../services/realtimeService';
import { useLanguage } from '../../../hooks/useLanguage';

export default function DashboardStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch initial stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Setup real-time subscription for booking updates
  useEffect(() => {
    const subscription = realtimeService?.subscribeToBookingUpdates(() => {
      // Refresh stats when any booking changes
      fetchStats();
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const bookings = await bookingService?.getAllBookings();
      
      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter(b => b?.status === 'pending')?.length || 0;
      const completedBookings = bookings?.filter(b => b?.status === 'completed')?.length || 0;
      const totalRevenue = bookings
        ?.filter(b => b?.status === 'completed')
        ?.reduce((sum, b) => sum + (parseFloat(b?.total_amount) || 0), 0) || 0;

      setStats({
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4]?.map(i => (
          <div key={i} className="bg-background rounded-lg shadow-soft border border-border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Общо резервации',
      value: stats?.totalBookings,
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: `+${stats?.thisMonth} този месец`
    },
    {
      title: 'Чакащи потвърждение',
      value: stats?.pendingBookings,
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'Изискват внимание'
    },
    {
      title: 'Потвърдени',
      value: stats?.completedBookings,
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'Предстоящи сесии'
    },
    {
      title: 'Завършени',
      value: stats?.completedBookings,
      icon: 'Award',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'Общо завършени'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-background rounded-lg shadow-soft border border-border p-6 hover:shadow-medium transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-hierarchy-secondary mb-1">
                {stat?.title}
              </p>
              <h3 className="text-3xl font-heading font-bold text-sophisticated-dark">
                {stat?.value}
              </h3>
              <p className="text-xs text-hierarchy-secondary mt-2">
                {stat?.trend}
              </p>
            </div>
            <div className={`${stat?.bgColor} ${stat?.color} p-3 rounded-lg`}>
              <Icon name={stat?.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}