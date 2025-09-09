import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "booking",
      title: "Нова резервация получена",
      description: "Мария Петрова резерви сватбена фотосесия за 15 септември",
      timestamp: "преди 2 часа",
      icon: "Calendar",
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      type: "gallery",
      title: "Галерия доставена",
      description: "Семейна галерия за Анна Димитрова е готова за преглед",
      timestamp: "преди 4 часа",
      icon: "Image",
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      type: "inquiry",
      title: "Ново запитване",
      description: "Елена Георгиева пита за корпоративни портрети",
      timestamp: "преди 6 часа",
      icon: "MessageSquare",
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "payment",
      title: "Плащане получено",
      description: "€450 от Стефан Николов за матернитетна сесия",
      timestamp: "преди 8 часа",
      icon: "DollarSign",
      color: "text-emerald-600 bg-emerald-100"
    },
    {
      id: 5,
      type: "portfolio",
      title: "Портфолио актуализирано",
      description: "Добавени 15 нови снимки в сватбената галерия",
      timestamp: "преди 1 ден",
      icon: "Upload",
      color: "text-orange-600 bg-orange-100"
    },
    {
      id: 6,
      type: "review",
      title: "Нова оценка",
      description: "Ивана Стоянова остави 5-звездна оценка",
      timestamp: "преди 1 ден",
      icon: "Star",
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      id: 7,
      type: "reminder",
      title: "Напомняне за сесия",
      description: "Утрешна сесия с Петър Иванов в 14:00",
      timestamp: "преди 2 дни",
      icon: "Bell",
      color: "text-red-600 bg-red-100"
    }
  ];

  const getRelativeTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
            Последна активност
          </h3>
          <button className="text-sm text-hierarchy-secondary hover:text-sophisticated-dark transition-colors">
            Виж всички
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <div className="divide-y divide-border">
          {activities?.map((activity, index) => (
            <div key={activity?.id} className="px-6 py-4 hover:bg-surface-elevation transition-colors duration-200">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity?.color}`}>
                  <Icon name={activity?.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-sophisticated-dark">
                      {activity?.title}
                    </p>
                    <p className="text-xs text-hierarchy-secondary">
                      {getRelativeTime(activity?.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-hierarchy-secondary mt-1">
                    {activity?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border bg-surface-elevation rounded-b-lg">
        <div className="flex items-center justify-center">
          <button className="text-sm text-hierarchy-secondary hover:text-sophisticated-dark transition-colors flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} />
            <span>Обнови активността</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;