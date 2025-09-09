import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilityCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState(new Set());
  const [bookedDates, setBookedDates] = useState(new Set());

  // Mock availability data
  useEffect(() => {
    const generateAvailability = () => {
      const available = new Set();
      const booked = new Set();
      const today = new Date();
      
      // Generate next 3 months of availability
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date?.setDate(today?.getDate() + i);
        
        const dayOfWeek = date?.getDay();
        const dateString = date?.toISOString()?.split('T')?.[0];
        
        // Skip Mondays (day 1) - photographer's day off
        if (dayOfWeek === 1) continue;
        
        // Random booking pattern (30% of available dates are booked)
        if (Math.random() > 0.3) {
          available?.add(dateString);
        } else {
          booked?.add(dateString);
        }
      }
      
      // Add some specific booked dates for realism
      const specificBookedDates = [
        '2024-09-15', '2024-09-22', '2024-10-05', '2024-10-12', 
        '2024-10-26', '2024-11-02', '2024-11-16', '2024-11-30'
      ];
      
      specificBookedDates?.forEach(date => {
        available?.delete(date);
        booked?.add(date);
      });
      
      setAvailableDates(available);
      setBookedDates(booked);
    };

    generateAvailability();
  }, []);

  const monthNames = [
    'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
    'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
  ];

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const dayNamesEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth?.setMonth(prev?.getMonth() + direction);
      return newMonth;
    });
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const dateString = date?.toISOString()?.split('T')?.[0];
    return availableDates?.has(dateString);
  };

  const isDateBooked = (date) => {
    if (!date) return false;
    const dateString = date?.toISOString()?.split('T')?.[0];
    return bookedDates?.has(dateString);
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date?.toISOString()?.split('T')?.[0] === selectedDate;
  };

  const isDatePast = (date) => {
    if (!date) return false;
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (!date || isDatePast(date) || isDateBooked(date) || !isDateAvailable(date)) return;
    
    const dateString = date?.toISOString()?.split('T')?.[0];
    onDateSelect(dateString);
  };

  const getDateClassName = (date) => {
    if (!date) return 'invisible';
    
    let className = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-elegant cursor-pointer';
    
    if (isDatePast(date)) {
      className += ' text-hierarchy-secondary cursor-not-allowed opacity-50';
    } else if (isDateBooked(date)) {
      className += ' bg-red-100 text-red-600 cursor-not-allowed';
    } else if (isDateSelected(date)) {
      className += ' bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-soft';
    } else if (isDateAvailable(date)) {
      className += ' text-sophisticated-dark hover:bg-accent hover:shadow-soft elegant-hover';
    } else {
      className += ' text-hierarchy-secondary cursor-not-allowed opacity-50';
    }
    
    return className;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const canGoPrevious = currentMonth?.getMonth() >= today?.getMonth() && currentMonth?.getFullYear() >= today?.getFullYear();

  return (
    <div className="bg-surface-elevation rounded-xl shadow-soft p-6">
      <div className="mb-6">
        <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
          Изберете дата / Select Date
        </h3>
        <p className="text-sophisticated text-hierarchy-secondary text-sm">
          Зелените дати са свободни за резервация / Green dates are available for booking
        </p>
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(-1)}
          disabled={!canGoPrevious}
          className="elegant-hover"
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>

        <div className="text-center">
          <h4 className="text-sophisticated font-medium text-sophisticated-dark">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </h4>
          <p className="text-xs text-hierarchy-secondary">
            {monthNamesEn?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="elegant-hover"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames?.map((day, index) => (
          <div key={day} className="text-center py-2">
            <div className="text-xs font-sophisticated text-hierarchy-secondary">
              {day}
            </div>
            <div className="text-xs text-hierarchy-secondary opacity-70">
              {dayNamesEn?.[index]}
            </div>
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days?.map((date, index) => (
          <div
            key={index}
            className={getDateClassName(date)}
            onClick={() => handleDateClick(date)}
          >
            {date && date?.getDate()}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="space-y-3">
        <h4 className="text-sophisticated font-medium text-sophisticated-dark text-sm">
          Легенда / Legend
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-accent to-secondary rounded"></div>
            <span className="text-hierarchy-secondary">Свободно / Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-hierarchy-secondary">Заето / Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-hierarchy-secondary">Недостъпно / Unavailable</span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-hierarchy-secondary mb-3">
            Не намирате подходяща дата? / Can't find a suitable date?
          </p>
          <Button
            variant="outline"
            size="sm"
            className="elegant-hover"
            onClick={() => window.location.href = 'tel:+359888123456'}
          >
            <Icon name="Phone" size={16} className="mr-2" />
            Обадете се / Call Me
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;