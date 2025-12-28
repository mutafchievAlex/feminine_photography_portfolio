import React from 'react';
import Icon from '../../../components/AppIcon';
import { useBookingStats } from '../../../hooks/useBookings';
import { useLanguage } from '../../../hooks/useLanguage';

export default function DashboardStats() {
  const { t } = useLanguage();
  const { data: stats, isLoading, isError, error } = useBookingStats();

  // Loading state
  if (isLoading) {
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

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={24} className="text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">{t('loadingStats')}</h3>
            <p className="text-red-600 text-sm">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!stats) {
    return (
      <div className="bg-background rounded-lg shadow-soft border border-border p-12 text-center">
        <Icon name="TrendingUp" size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-hierarchy-secondary">{t('noStatsAvailable')}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Общо резервации',
      value: stats?.total || 0,
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: `+${stats?.thisMonth || 0} този месец`
    },
    {
      title: 'Чакащи потвърждение',
      value: stats?.pending || 0,
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'Изискват внимание'
    },
    {
      title: 'Потвърдени',
      value: stats?.confirmed || 0,
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'Предстоящи сесии'
    },
    {
      title: 'Завършени',
      value: stats?.completed || 0,
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