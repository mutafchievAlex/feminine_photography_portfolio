import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bookingService } from '../../../services/bookingService';
import { realtimeService } from '../../../services/realtimeService';
import { useLanguage } from '../../../hooks/useLanguage';

export default function RecentBookings() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch initial bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  // Setup real-time subscription
  useEffect(() => {
    const subscription = realtimeService?.subscribeToBookingUpdates((data) => {
      const { type, booking } = data;

      if (type === 'INSERT') {
        // Add new booking to the list
        setBookings(prev => [booking, ...prev]?.slice(0, 5));
      } else if (type === 'UPDATE') {
        // Update existing booking
        setBookings(prev =>
          prev?.map(b => (b?.id === booking?.id ? booking : b))
        );
      } else if (type === 'DELETE') {
        // Remove deleted booking
        setBookings(prev => prev?.filter(b => b?.id !== booking?.id));
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService?.getAllBookings();
      setBookings(data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      await bookingService?.updateStatus(bookingId, newStatus);
      await fetchBookings(); // Reload bookings
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Грешка при актуализиране на статус: ' + err?.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Чакащо',
      confirmed: 'Потвърдено',
      completed: 'Завършено',
      cancelled: 'Отказано'
    };
    return labels?.[status] || status;
  };

  const getSessionTypeLabel = (type) => {
    const labels = {
      wedding: 'Сватба',
      maternity: 'Бременност',
      family: 'Семейна',
      engagement: 'Годеж',
      individual: 'Индивидуална',
      corporate: 'Корпоративна',
      newborn: 'Новородено',
      other: 'Друго'
    };
    return labels?.[type] || type;
  };

  if (loading) {
    return (
      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
            Последни резервации
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
          Последни резервации
        </h3>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={20} />
        </Button>
      </div>
      <div className="p-6">
        {bookings?.length === 0 ? (
          <p className="text-center text-hierarchy-secondary py-8">
            Няма резервации
          </p>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <div
                key={booking?.id}
                className="flex items-start justify-between p-4 bg-surface-elevation rounded-lg hover:shadow-soft transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-sophisticated font-medium text-sophisticated-dark">
                      {booking?.fullName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                      {getStatusLabel(booking?.status)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-hierarchy-secondary">
                    <p className="flex items-center space-x-2">
                      <Icon name="Camera" size={14} />
                      <span>{getSessionTypeLabel(booking?.sessionType)}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(booking.preferredDate)?.toLocaleDateString('bg-BG')}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} />
                      <span>{booking?.email}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {booking?.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleStatusChange(booking?.id, 'confirmed')}
                        loading={updatingStatus === booking?.id}
                      >
                        <Icon name="Check" size={16} className="mr-1" />
                        Потвърди
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(booking?.id, 'cancelled')}
                        loading={updatingStatus === booking?.id}
                      >
                        <Icon name="X" size={16} className="mr-1" />
                        Откажи
                      </Button>
                    </>
                  )}
                  {booking?.status === 'confirmed' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(booking?.id, 'completed')}
                      loading={updatingStatus === booking?.id}
                    >
                      <Icon name="CheckCircle" size={16} className="mr-1" />
                      Завърши
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-6 py-4 border-t border-border">
        <Button variant="ghost" fullWidth>
          Виж всички резервации
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}