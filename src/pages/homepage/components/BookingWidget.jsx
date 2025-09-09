import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingWidget = () => {
  const [language, setLanguage] = useState('bg');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  // Mock availability data
  const availableDates = [
    { date: '2024-09-05', slots: ['10:00', '14:00', '16:00'] },
    { date: '2024-09-07', slots: ['11:00', '15:00'] },
    { date: '2024-09-10', slots: ['09:00', '13:00', '17:00'] },
    { date: '2024-09-12', slots: ['10:00', '14:00'] },
    { date: '2024-09-15', slots: ['11:00', '15:00', '16:30'] },
    { date: '2024-09-18', slots: ['09:30', '14:00'] },
    { date: '2024-09-20', slots: ['10:00', '13:00', '16:00'] }
  ];

  const sessionTypes = [
    {
      id: 'consultation',
      name: {
        bg: 'Безплатна консултация',
        en: 'Free Consultation'
      },
      duration: '30 мин / 30 min',
      price: {
        bg: 'Безплатно',
        en: 'Free'
      },
      icon: 'MessageCircle'
    },
    {
      id: 'portrait',
      name: {
        bg: 'Портретна сесия',
        en: 'Portrait Session'
      },
      duration: '1 час / 1 hour',
      price: {
        bg: '150 лв',
        en: '150 BGN'
      },
      icon: 'User'
    },
    {
      id: 'couple',
      name: {
        bg: 'Двойка сесия',
        en: 'Couple Session'
      },
      duration: '1.5 часа / 1.5 hours',
      price: {
        bg: '220 лв',
        en: '220 BGN'
      },
      icon: 'Heart'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (language === 'bg') {
      return date?.toLocaleDateString('bg-BG', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // In a real app, this would handle the booking
      window.location.href = '/booking';
    }
  };

  return (
    <section className="py-20 bg-gallery-canvas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-medium p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl text-sophisticated-dark mb-4">
              {language === 'bg' ? 'Резервирайте вашата сесия' : 'Book Your Session'}
            </h2>
            <p className="font-sophisticated text-hierarchy-secondary">
              {language === 'bg' ?'Изберете удобно време за вас и нека създадем нещо красиво заедно' :'Choose a convenient time for you and let\'s create something beautiful together'
              }
            </p>
          </div>

          {/* Session Types */}
          <div className="mb-8">
            <h3 className="font-heading text-xl text-sophisticated-dark mb-4">
              {language === 'bg' ? 'Тип сесия' : 'Session Type'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessionTypes?.map((type) => (
                <motion.div
                  key={type?.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Icon name={type?.icon} size={20} className="text-sophisticated-dark" />
                    </div>
                    <div>
                      <h4 className="font-sophisticated font-medium text-sophisticated-dark">
                        {type?.name?.[language]}
                      </h4>
                      <p className="text-sm text-hierarchy-secondary">
                        {type?.duration}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-sophisticated font-medium text-accent">
                      {type?.price?.[language]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Available Dates */}
          <div className="mb-8">
            <h3 className="font-heading text-xl text-sophisticated-dark mb-4">
              {language === 'bg' ? 'Налични дати' : 'Available Dates'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {availableDates?.map((dateObj) => (
                <motion.button
                  key={dateObj?.date}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDate(dateObj?.date);
                    setSelectedTime(null);
                  }}
                  className={`p-3 rounded-lg text-center transition-all duration-300 ${
                    selectedDate === dateObj?.date
                      ? 'bg-accent text-sophisticated-dark shadow-soft'
                      : 'bg-surface-elevation hover:bg-accent/20 text-hierarchy-secondary hover:text-sophisticated-dark'
                  }`}
                >
                  <div className="font-sophisticated text-sm">
                    {formatDate(dateObj?.date)}
                  </div>
                  <div className="text-xs mt-1">
                    {dateObj?.slots?.length} {language === 'bg' ? 'слота' : 'slots'}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Available Times */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h3 className="font-heading text-xl text-sophisticated-dark mb-4">
                {language === 'bg' ? 'Налични часове' : 'Available Times'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableDates?.find(d => d?.date === selectedDate)
                  ?.slots?.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg font-sophisticated transition-all duration-300 ${
                        selectedTime === time
                          ? 'bg-accent text-sophisticated-dark shadow-soft'
                          : 'bg-surface-elevation hover:bg-accent/20 text-hierarchy-secondary hover:text-sophisticated-dark'
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Booking Summary & CTA */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                {selectedDate && selectedTime ? (
                  <div>
                    <p className="font-sophisticated text-sophisticated-dark">
                      <Icon name="Calendar" size={16} className="inline mr-2" />
                      {formatDate(selectedDate)} {language === 'bg' ? 'в' : 'at'} {selectedTime}
                    </p>
                    <p className="text-sm text-hierarchy-secondary mt-1">
                      {language === 'bg' ?'Ще получите потвърждение по имейл' :'You will receive email confirmation'
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-hierarchy-secondary font-sophisticated">
                    {language === 'bg' ?'Изберете дата и час за резервация' :'Select date and time to book'
                    }
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/investment'}
                  className="elegant-hover"
                >
                  <Icon name="DollarSign" size={16} className="mr-2" />
                  {language === 'bg' ? 'Виж цени' : 'View Pricing'}
                </Button>

                <Button
                  variant="default"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className={`${
                    selectedDate && selectedTime 
                      ? 'bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta' :'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Icon name="Calendar" size={16} className="mr-2" />
                  {language === 'bg' ? 'Резервирай сега' : 'Book Now'}
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-hierarchy-secondary font-sophisticated mb-4">
              {language === 'bg' ?'Имате въпроси? Свържете се с мен директно' :'Have questions? Contact me directly'
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a 
                href="tel:+359888123456"
                className="flex items-center text-sophisticated-dark hover:text-accent transition-colors duration-300"
              >
                <Icon name="Phone" size={16} className="mr-2" />
                <span className="font-sophisticated">+359 888 123 456</span>
              </a>
              <a 
                href="mailto:elena@photography.bg"
                className="flex items-center text-sophisticated-dark hover:text-accent transition-colors duration-300"
              >
                <Icon name="Mail" size={16} className="mr-2" />
                <span className="font-sophisticated">elena@photography.bg</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingWidget;