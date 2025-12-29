import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ErrorBoundary from '../../components/ErrorBoundary';
import DashboardStats from './components/DashboardStats';
import RecentBookings from './components/RecentBookings';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import UpcomingSchedule from './components/UpcomingSchedule';
import RevenueChart from './components/RevenueChart';
import { activityService } from '../../services/activityService';
import { galleryService } from '../../services/galleryService';
import { albumService } from '../../services/albumService';
import { bookingService } from '../../services/bookingService';
import { useLanguage } from '../../hooks/useLanguage';
import pkg from '../../../package.json';
import { useTheme } from '../../contexts/ThemeContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [systemInfo, setSystemInfo] = useState({
    lastBackup: null,
    imagesCount: 0,
    albumsCount: 0,
    bookingsCount: 0,
    version: pkg?.version || 'v?.?.?'
  });

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

  // Fetch notifications (recent activities) and simple system metrics
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Fetch activities separately and with error handling
        let acts = [];
        try {
          acts = await activityService?.getRecentActivities?.(5) || [];
        } catch (err) {
          console.warn('Error loading activities:', err?.message);
        }
        
        if (!mounted) return;
        
        const notifs = (acts || []).map(a => ({
          id: a?.id,
          type: a?.activityType || 'info',
          message: a?.description || '',
          timestamp: a?.createdAt
        }));
        setNotifications(notifs);

        // Fetch system counts separately with fallbacks
        let images = [];
        let albums = [];
        let stats = { total: 0 };
        
        try {
          images = await galleryService?.getAll?.() || [];
        } catch (err) {
          console.warn('Error loading gallery:', err?.message);
        }
        
        try {
          albums = await albumService?.getAll?.() || [];
        } catch (err) {
          console.warn('Error loading albums:', err?.message);
        }
        
        try {
          stats = await bookingService?.getStats?.() || { total: 0 };
        } catch (err) {
          console.warn('Error loading booking stats:', err?.message);
        }

        if (!mounted) return;

        // find last backup-like activity if any (fallback to most recent activity)
        const backupAct = (acts || []).find(x => (x?.activityType || '').toLowerCase().includes('backup')) || acts?.[0];

        setSystemInfo({
          lastBackup: backupAct?.createdAt || null,
          imagesCount: images?.length || 0,
          albumsCount: albums?.length || 0,
          bookingsCount: stats?.total || 0,
          version: pkg?.version || 'v?.?.?'
        });
      } catch (err) {
        console.warn('Error loading dashboard metadata', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

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
                    <p className="text-sm text-hierarchy-secondary">{t('systemInfo')}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-sophisticated-dark">{t('allRightsReserved')}</span>
                    </div>
                    <p className="text-xs text-hierarchy-secondary mt-1">
                      {systemInfo?.bookingsCount || 0} {t('bookingsCount')} • {systemInfo?.imagesCount || 0} {t('imagesCount')} • {systemInfo?.albumsCount || 0} {t('albumsCount')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                      <Icon name="Contrast" size={16} className="mr-2" />
                      {theme === 'bw' ? 'Класическа тема: ВКЛ' : 'Класическа тема: ИЗКЛ'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Notifications (DEV only) */}
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
                            {new Date(notification?.timestamp)?.toLocaleTimeString('bg-BG', {
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
                        {systemInfo?.lastBackup ? new Date(systemInfo.lastBackup).toLocaleString('bg-BG') : 'Няма данни'}
                      </p>
                    </div>
                  </div>
                  <Icon name="CheckCircle" size={20} className={systemInfo?.lastBackup ? 'text-green-600' : 'text-gray-400'} />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-elevation rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Cloud" size={20} className="text-hierarchy-secondary" />
                    <div>
                      <p className="text-sm font-medium text-sophisticated-dark">
                        Облачно съхранение
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        {systemInfo?.imagesCount || 0} снимки • {systemInfo?.albumsCount || 0} албума
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
                      Версия на системата: {systemInfo?.version}
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
              {t('adminDashboardTitle')} • 
              © {new Date()?.getFullYear()} {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminDashboardWrapped = () => (
  <ErrorBoundary>
    <AdminDashboard />
  </ErrorBoundary>
);

export default AdminDashboardWrapped;