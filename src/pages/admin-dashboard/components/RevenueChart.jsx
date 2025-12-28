import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useBookings } from '../../../hooks/useBookings';
import { useLanguage } from '../../../hooks/useLanguage';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-2 shadow-md">
        <p className="text-sm text-sophisticated-dark font-medium">
          €{payload[0]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const { t } = useLanguage();
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('6months');
  const { data: bookings = [], isLoading, isError } = useBookings({ retry: 1 });

  // Mock pricing by session type (in euros)
  const SESSION_PRICING = {
    wedding: 1500,
    maternity: 600,
    family: 400,
    engagement: 500,
    individual: 350,
    corporate: 800,
    newborn: 500,
    other: 400
  };

  // Generate monthly data from bookings
  const { monthlyData, sessionTypeData, totalRevenue, totalSessions, averagePerSession } = useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return {
        monthlyData: [],
        sessionTypeData: [],
        totalRevenue: 0,
        totalSessions: 0,
        averagePerSession: 0
      };
    }

    // Filter confirmed/completed bookings only
    const confirmedBookings = bookings.filter(b => 
      b?.status === 'confirmed' || b?.status === 'completed'
    );

    // Group by month
    const monthlyMap = {};
    confirmedBookings.forEach(booking => {
      if (!booking?.preferredDate) return;
      const date = new Date(booking.preferredDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('bg-BG', { month: 'short' });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthLabel, revenue: 0, sessions: 0, bookings: 0 };
      }
      const price = SESSION_PRICING[booking.sessionType] || 400;
      monthlyMap[monthKey].revenue += price;
      monthlyMap[monthKey].sessions += 1;
      monthlyMap[monthKey].bookings += 1;
    });

    const monthlyDataList = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    // Group by session type
    const sessionTypeMap = {};
    confirmedBookings.forEach(booking => {
      const type = booking.sessionType || 'other';
      const price = SESSION_PRICING[type] || 400;
      
      if (!sessionTypeMap[type]) {
        sessionTypeMap[type] = { 
          type: type.charAt(0).toUpperCase() + type.slice(1), 
          revenue: 0, 
          sessions: 0 
        };
      }
      sessionTypeMap[type].revenue += price;
      sessionTypeMap[type].sessions += 1;
    });

    const sessionTypeList = Object.values(sessionTypeMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map(item => ({
        ...item,
        percentage: Math.round((item.revenue / 
          Object.values(sessionTypeMap).reduce((sum, s) => sum + s.revenue, 0)) * 100)
      }));

    const totalRev = monthlyDataList.reduce((sum, item) => sum + item.revenue, 0);
    const totalSess = monthlyDataList.reduce((sum, item) => sum + item.sessions, 0);

    return {
      monthlyData: monthlyDataList.length ? monthlyDataList : [],
      sessionTypeData: sessionTypeList,
      totalRevenue: totalRev,
      totalSessions: totalSess,
      averagePerSession: totalSess > 0 ? Math.round(totalRev / totalSess) : 0
    };
  }, [bookings]);

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
              {t('financialOverview')}
            </h3>
            <p className="text-sm text-hierarchy-secondary mt-1">
              {t('revenueAndStats')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <Icon name="BarChart3" size={16} />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <Icon name="TrendingUp" size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-accent rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-hierarchy-secondary">{t('totalRevenue')}</p>
                <p className="text-2xl font-heading font-semibold text-sophisticated-dark">
                  €{totalRevenue?.toLocaleString()}
                </p>
              </div>
              <Icon name="DollarSign" size={24} className="text-sophisticated-dark" />
            </div>
          </div>
          
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-hierarchy-secondary">{t('totalSessions')}</p>
                <p className="text-2xl font-heading font-semibold text-sophisticated-dark">
                  {totalSessions}
                </p>
              </div>
              <Icon name="Camera" size={24} className="text-sophisticated-dark" />
            </div>
          </div>
          
          <div className="bg-surface-elevation rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-hierarchy-secondary">{t('averagePerSession')}</p>
                <p className="text-2xl font-heading font-semibold text-sophisticated-dark">
                  €{Math.round(averagePerSession)}
                </p>
              </div>
              <Icon name="TrendingUp" size={24} className="text-sophisticated-dark" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 mb-6">
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-surface-elevation rounded-lg">
              <p className="text-hierarchy-secondary">{t('noRevenueData')}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFD5D5" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#EFD5D5" 
                    radius={[4, 4, 0, 0]}
                    stroke="#2C3E50"
                    strokeWidth={1}
                  />
                </BarChart>
              ) : (
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFD5D5" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2C3E50" 
                    strokeWidth={3}
                    dot={{ fill: '#EFD5D5', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#2C3E50' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Session Type Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-sophisticated-dark mb-3">
            {t('sessionTypeBreakdown')}
          </h4>
          <div className="space-y-3">
            {sessionTypeData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 60}, 50%, 60%)` }}
                  ></div>
                  <span className="text-sm text-sophisticated-dark">{item?.type}</span>
                  <span className="text-xs text-hierarchy-secondary">({item?.sessions} сесии)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-sophisticated-dark">
                    €{item?.revenue?.toLocaleString()}
                  </span>
                  <span className="text-xs text-hierarchy-secondary">
                    {item?.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border bg-surface-elevation rounded-b-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-hierarchy-secondary">
            {t('dataUpdated')}
          </p>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            {t('exportReport')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;