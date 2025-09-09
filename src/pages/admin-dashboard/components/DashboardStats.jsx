import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: "Upcoming Sessions",
      value: "12",
      change: "+3 this week",
      trend: "up",
      icon: "Calendar",
      color: "bg-accent"
    },
    {
      id: 2,
      title: "Pending Inquiries",
      value: "8",
      change: "2 urgent",
      trend: "neutral",
      icon: "MessageSquare",
      color: "bg-secondary"
    },
    {
      id: 3,
      title: "Gallery Deliveries",
      value: "5",
      change: "Due this week",
      trend: "down",
      icon: "Image",
      color: "bg-surface-elevation"
    },
    {
      id: 4,
      title: "Monthly Revenue",
      value: "€4,850",
      change: "+15% vs last month",
      trend: "up",
      icon: "DollarSign",
      color: "bg-warm-section"
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-500';
      default: return 'text-hierarchy-secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className={`${stat?.color} rounded-lg p-6 shadow-soft elegant-hover`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className="text-sophisticated-dark" />
            </div>
            <Icon 
              name={getTrendIcon(stat?.trend)} 
              size={16} 
              className={getTrendColor(stat?.trend)} 
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-heading font-semibold text-sophisticated-dark">
              {stat?.value}
            </h3>
            <p className="text-sm font-sophisticated text-hierarchy-secondary">
              {stat?.title}
            </p>
            <p className={`text-xs font-medium ${getTrendColor(stat?.trend)}`}>
              {stat?.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;