import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useBookings } from '../../../hooks/useBookings';
import { useLanguage } from '../../../hooks/useLanguage';

const UpcomingSchedule = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: bookings = [], isLoading, isError } = useBookings({ retry: 1 });

  // derive upcoming events from bookings (next 30 days)
  const upcomingEvents = React.useMemo(() => {
    if (!bookings || bookings?.length === 0) return [];
    
    return (bookings || [])
      .filter(b => b?.preferredDate)
      .map(b => ({
        id: b.id,
        title: b.sessionType ? `${b.sessionType.charAt(0).toUpperCase()}${b.sessionType.slice(1)} фотосесия` : 'Сесия',
        client: b.fullName || (b.client && b.client.full_name) || 'Клиент',
        date: b.preferredDate,
        time: '',
        location: b.location || '',
        type: b.sessionType,
        status: b.status,
        notes: b.adminNotes || ''
      }))
      .filter(ev => {
        const eventDate = new Date(ev.date);
        const today = new Date();
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [bookings]);

  const getEventTypeIcon = (type) => {
    const icons = {
      wedding: 'Heart',
      maternity: 'Baby',
      corporate: 'Briefcase',
      family: 'Users',
      engagement: 'Ring'
    };
    return icons?.[type] || 'Camera';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-800',
      maternity: 'bg-purple-100 text-purple-800',
      corporate: 'bg-blue-100 text-blue-800',
      family: 'bg-green-100 text-green-800',
      engagement: 'bg-red-100 text-red-800'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        color: 'bg-green-100 text-green-800',
        text: 'Потвърдена'
      },
      pending_confirmation: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Чака потвърждение'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        text: 'Отменена'
      }
    };

    const config = statusConfig?.[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Днес';
    if (diffDays === 1) return 'Утре';
    if (diffDays < 0) return `Преди ${Math.abs(diffDays)} дни`;
    return `След ${diffDays} дни`;
  };

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
            {t('upcomingSessions')}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Calendar" size={16} className="mr-2" />
              {t('booking')}
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {upcomingEvents?.map((event) => (
          <div key={event?.id} className="px-6 py-4 hover:bg-surface-elevation transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getEventTypeColor(event?.type)}`}>
                  <Icon name={getEventTypeIcon(event?.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-sophisticated-dark">
                      {event?.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(event?.status)}
                      <span className="text-xs text-hierarchy-secondary">
                        {getDaysUntil(event?.date)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-sophisticated-dark font-medium">
                      {event?.client}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-hierarchy-secondary">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{formatDate(event?.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{event?.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-hierarchy-secondary">
                      <Icon name="MapPin" size={14} />
                      <span>{event?.location}</span>
                    </div>
                    {event?.notes && (
                      <p className="text-xs text-hierarchy-secondary bg-surface-elevation px-2 py-1 rounded mt-2">
                        <Icon name="FileText" size={12} className="inline mr-1" />
                        {event?.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                <Button variant="ghost" size="sm">
                  <Icon name="MessageSquare" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Edit" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="MoreVertical" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-border bg-surface-elevation rounded-b-lg">
          <div className="flex items-center justify-between">
          <p className="text-sm text-hierarchy-secondary">
            {upcomingEvents?.length || 0} {t('upcomingSessionsInfo')}
          </p>
          <Button variant="outline" size="sm">
            {t('learnMore')}
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSchedule;