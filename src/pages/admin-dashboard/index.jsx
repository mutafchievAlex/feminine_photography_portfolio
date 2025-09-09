import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardStats from './components/DashboardStats';
import RecentBookings from './components/RecentBookings';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import UpcomingSchedule from './components/UpcomingSchedule';
import RevenueChart from './components/RevenueChart';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      message: 'Стефан Николов изисква потвърждение за утрешната сесия',
      timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      id: 2,
      type: 'info',
      message: 'Нова галерия за Мария Петрова е готова за доставка',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Напомняне: Резервно копие на снимките днес в 18:00',
      timestamp: new Date(Date.now() - 7200000) // 2 hours ago
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Добро утро';
    if (hour < 18) return 'Добър ден';
    return 'Добър вечер';
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return 'AlertTriangle';
      case 'info': return 'Info';
      case 'reminder': return 'Bell';
      default: return 'MessageSquare';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'reminder': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gallery-canvas">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-background rounded-lg shadow-soft border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-semibold text-sophisticated-dark">
                    {getGreeting()}, Елена!
                  </h1>
                  <p className="text-hierarchy-secondary mt-1">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                  <p className="text-sm text-hierarchy-secondary mt-2">
                    Управлявайте вашия фотографски бизнес от една централна локация
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-hierarchy-secondary">Статус на системата</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-sophisticated-dark">Всичко работи</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notifications?.length > 0 && (
            <div className="mb-8">
              <div className="space-y-3">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`border rounded-lg p-4 ${getNotificationColor(notification?.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={20} 
                          className="mt-0.5" 
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {notification?.message}
                          </p>
                          <p className="text-xs opacity-75 mt-1">
                            {notification?.timestamp?.toLocaleTimeString('bg-BG', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification?.id)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              <RecentBookings />
              <RevenueChart />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              <QuickActions />
              <UpcomingSchedule />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity />
            
            {/* System Status & Backup Info */}
            <div className="bg-background rounded-lg shadow-soft border border-border">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
                  Системна информация
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-elevation rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Database" size={20} className="text-hierarchy-secondary" />
                    <div>
                      <p className="text-sm font-medium text-sophisticated-dark">
                        Последно резервно копие
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        Днес в 03:00 • Успешно
                      </p>
                    </div>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-elevation rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Cloud" size={20} className="text-hierarchy-secondary" />
                    <div>
                      <p className="text-sm font-medium text-sophisticated-dark">
                        Облачно съхранение
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        2.3 TB използвани от 5 TB
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-9 h-2 bg-accent rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-elevation rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={20} className="text-hierarchy-secondary" />
                    <div>
                      <p className="text-sm font-medium text-sophisticated-dark">
                        Сигурност
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        SSL активен • Автоматични актуализации
                      </p>
                    </div>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-hierarchy-secondary">
                      Версия на системата: v2.1.4
                    </p>
                    <Button variant="outline" size="sm">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Проверка за актуализации
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-hierarchy-secondary">
              Административен панел • Elena Rose Photography • 
              © {new Date()?.getFullYear()} Всички права запазени
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;