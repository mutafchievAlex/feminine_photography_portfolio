import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RevenueChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('6months');

  const monthlyData = [
    { month: 'Мар', revenue: 3200, sessions: 8, bookings: 12 },
    { month: 'Апр', revenue: 4100, sessions: 11, bookings: 15 },
    { month: 'Май', revenue: 3800, sessions: 9, bookings: 13 },
    { month: 'Юни', revenue: 5200, sessions: 14, bookings: 18 },
    { month: 'Юли', revenue: 4900, sessions: 13, bookings: 16 },
    { month: 'Авг', revenue: 4850, sessions: 12, bookings: 17 }
  ];

  const sessionTypeData = [
    { type: 'Сватби', revenue: 12500, percentage: 45, sessions: 5 },
    { type: 'Семейни', revenue: 6800, percentage: 25, sessions: 19 },
    { type: 'Матернитет', revenue: 4200, percentage: 15, sessions: 14 },
    { type: 'Корпоративни', revenue: 2800, percentage: 10, sessions: 12 },
    { type: 'Други', revenue: 1400, percentage: 5, sessions: 8 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-medium p-3">
          <p className="text-sm font-medium text-sophisticated-dark">{`${label}`}</p>
          <p className="text-sm text-hierarchy-secondary">
            {`Приходи: €${payload?.[0]?.value?.toLocaleString()}`}
          </p>
          {payload?.[0]?.payload?.sessions && (
            <p className="text-sm text-hierarchy-secondary">
              {`Сесии: ${payload?.[0]?.payload?.sessions}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const totalRevenue = monthlyData?.reduce((sum, item) => sum + item?.revenue, 0);
  const totalSessions = monthlyData?.reduce((sum, item) => sum + item?.sessions, 0);
  const averagePerSession = totalRevenue / totalSessions;

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
              Финансов преглед
            </h3>
            <p className="text-sm text-hierarchy-secondary mt-1">
              Приходи и статистики за последните 6 месеца
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
                <p className="text-sm text-hierarchy-secondary">Общо приходи</p>
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
                <p className="text-sm text-hierarchy-secondary">Общо сесии</p>
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
                <p className="text-sm text-hierarchy-secondary">Средно на сесия</p>
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
        </div>

        {/* Session Type Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-sophisticated-dark mb-3">
            Разпределение по тип сесии
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
            Данните са актуализирани преди 2 часа
          </p>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Експортирай отчет
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;