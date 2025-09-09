import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentBookings = () => {
  const bookings = [
    {
      id: 1,
      clientName: "Мария Петрова",
      sessionType: "Wedding Photography",
      date: "2025-09-15",
      time: "14:00",
      status: "confirmed",
      location: "София, България",
      package: "Premium Wedding Package",
      value: "€2,500"
    },
    {
      id: 2,
      clientName: "Анна Димитрова",
      sessionType: "Maternity Session",
      date: "2025-09-08",
      time: "10:30",
      status: "pending",
      location: "Пловдив, България",
      package: "Maternity Deluxe",
      value: "€450"
    },
    {
      id: 3,
      clientName: "Елена Георгиева",
      sessionType: "Family Portrait",
      date: "2025-09-12",
      time: "16:00",
      status: "confirmed",
      location: "Варна, България",
      package: "Family Classic",
      value: "€350"
    },
    {
      id: 4,
      clientName: "Стефан Николов",
      sessionType: "Corporate Headshots",
      date: "2025-09-05",
      time: "09:00",
      status: "requires_action",
      location: "София, България",
      package: "Professional Headshots",
      value: "€200"
    },
    {
      id: 5,
      clientName: "Ивана Стоянова",
      sessionType: "Engagement Session",
      date: "2025-09-20",
      time: "17:30",
      status: "confirmed",
      location: "Банско, България",
      package: "Engagement Premium",
      value: "€600"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        color: 'bg-green-100 text-green-800',
        icon: 'CheckCircle',
        text: 'Потвърдена'
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: 'Clock',
        text: 'Чакаща'
      },
      requires_action: {
        color: 'bg-red-100 text-red-800',
        icon: 'AlertCircle',
        text: 'Изисква действие'
      }
    };

    const config = statusConfig?.[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {config?.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
            Последни резервации
          </h3>
          <Button variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Нова резервация
          </Button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-elevation">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Сесия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Дата & Час
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Стойност
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-hierarchy-secondary uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {bookings?.map((booking) => (
                <tr key={booking?.id} className="hover:bg-surface-elevation transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                          <Icon name="User" size={16} className="text-sophisticated-dark" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-sophisticated-dark">
                          {booking?.clientName}
                        </div>
                        <div className="text-sm text-hierarchy-secondary">
                          {booking?.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-sophisticated-dark">{booking?.sessionType}</div>
                    <div className="text-sm text-hierarchy-secondary">{booking?.package}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-sophisticated-dark">{formatDate(booking?.date)}</div>
                    <div className="text-sm text-hierarchy-secondary">{booking?.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking?.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sophisticated-dark">
                    {booking?.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="MessageSquare" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-hierarchy-secondary">
            Показани 5 от 23 резервации
          </p>
          <Button variant="outline" size="sm">
            Виж всички резервации
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentBookings;