import React, { useState } from 'react';

import Header from '../../components/ui/Header';
import BookingForm from './components/BookingForm';
import ConsultationProcess from './components/ConsultationProcess';
import TrustSignals from './components/TrustSignals';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import Toast from '../../components/Toast';
import { bookingService } from '../../services/bookingService';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

import { useLanguage } from '../../hooks/useLanguage';

const BookingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      await bookingService?.create(formData);
      setToast({
        type: 'success',
        message: 'Резервацията е обработена успешно! Очаквайте потвърждение на имейла си.'
      });
      // Reset form
      setSelectedDate(null);
    } catch (error) {
      console.error('Booking error:', error);
      setToast({
        type: 'error',
        message: error?.message || 'Възникна грешка при обработката на резервацията. Моля, опитайте отново.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      await bookingService?.create(formData);
      setToast({
        type: 'success',
        message: 'Резервацията е обработена успешно! Очаквайте потвърждение на имейла си.'
      });
      // Reset form
      setSelectedDate(null);
    } catch (error) {
      console.error('Booking error:', error);
      setToast({
        type: 'error',
        message: error?.message || 'Възникна грешка при обработката на резервацията. Моля, опитайте отново.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Automatically switch to form tab when date is selected
    setActiveTab('form');
  };

  const { t } = useLanguage();

  const tabs = [
    { id: 'form', label: t('tabBooking'), icon: 'Calendar' },
    { id: 'calendar', label: t('tabCalendar'), icon: 'Calendar' },
    { id: 'process', label: t('tabProcess'), icon: 'Info' },
    { id: 'trust', label: t('tabReviews'), icon: 'Star' }
  ];

  return (
    <div className="min-h-screen bg-gallery-canvas">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="pt-20 pb-12 lg:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-elegant text-3xl lg:text-4xl xl:text-5xl text-sophisticated-dark mb-6">
                    {t('booking')}
                  </h1>
                  <h2 className="text-elegant text-2xl lg:text-3xl xl:text-4xl text-hierarchy-secondary mb-6">
                    {t('heroSubtitle')}
                  </h2>
                  <p className="text-sophisticated text-lg text-hierarchy-secondary leading-relaxed mb-4">
                    {t('heroDescription')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: 'Clock', title: t('bookingHeroFeature1Title'), subtitle: t('bookingHeroFeature1Subtitle') },
                    { icon: 'Gift', title: t('bookingHeroFeature2Title'), subtitle: t('bookingHeroFeature2Subtitle') },
                    { icon: 'Heart', title: t('bookingHeroFeature3Title'), subtitle: t('bookingHeroFeature3Subtitle') }
                  ]?.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
                        <Icon name={item?.icon} size={20} className="text-sophisticated-dark" />
                      </div>
                      <h3 className="text-sophisticated font-medium text-sophisticated-dark">
                        {item?.title}
                      </h3>
                      <p className="text-sm text-hierarchy-secondary">
                        {item?.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Images */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-medium elegant-hover">
                      <Image
                        src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"
                        alt={t('booking')}
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-medium elegant-hover">
                      <Image
                        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop"
                        alt={t('booking')}
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                  </div>
                  <div className="pt-8">
                    <div className="aspect-[4/6] rounded-xl overflow-hidden shadow-medium elegant-hover">
                      <Image
                        src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop"
                        alt={t('booking')}
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Floating element */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full shadow-strong pulse-cta"></div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Tab Navigation */}
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2 bg-surface-elevation rounded-xl p-2 shadow-soft">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-sophisticated transition-all duration-elegant ${
                        activeTab === tab?.id
                          ? 'bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-soft'
                          : 'text-hierarchy-secondary hover:text-sophisticated-dark hover:bg-gallery-canvas'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="hidden sm:inline">{tab?.id === 'form' ? t('booking') : tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {activeTab === 'form' && (
                    <BookingForm 
                      onSubmit={handleFormSubmit} 
                      isSubmitting={isSubmitting}
                      selectedDate={selectedDate}
                    />
                  )}
                  
                  {activeTab === 'calendar' && (
                    <AvailabilityCalendar 
                      onDateSelect={handleDateSelect}
                      selectedDate={selectedDate}
                    />
                  )}
                  
                  {activeTab === 'process' && <ConsultationProcess />}
                  
                  {activeTab === 'trust' && <TrustSignals />}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Contact */}
                  <div className="bg-surface-elevation rounded-xl shadow-soft p-6">
                    <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4">
                      {t('quickContact')}
                    </h3>
                    <div className="space-y-3">
                      <a 
                        href="tel:+359888123456"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gallery-canvas transition-colors elegant-hover"
                      >
                        <Icon name="Phone" size={18} className="text-accent" />
                        <div>
                          <p className="text-sm font-sophisticated text-sophisticated-dark">
                            +359 888 123 456
                          </p>
                          <p className="text-xs text-hierarchy-secondary">
                            {t('callNow')}
                          </p>
                        </div>
                      </a>
                      
                      <a 
                        href="mailto:elena@elenarosephotography.bg"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gallery-canvas transition-colors elegant-hover"
                      >
                        <Icon name="Mail" size={18} className="text-accent" />
                        <div>
                          <p className="text-sm font-sophisticated text-sophisticated-dark">
                            elena@elenarosephotography.bg
                          </p>
                          <p className="text-xs text-hierarchy-secondary">
                            {t('sendEmail')}
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Selected Date Display */}
                  {selectedDate && (
                    <div className="bg-gradient-to-r from-accent to-secondary rounded-xl shadow-soft p-6">
                      <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-2">
                        {t('selectedDate')}
                      </h3>
                      <p className="text-sophisticated text-sophisticated-dark">
                        {(() => {
                          const [year, month, day] = selectedDate.split('-');
                          const date = new Date(year, month - 1, day);
                          return date?.toLocaleDateString('bg-BG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        })()}
                      </p>
                    </div>
                  )}

                  {/* Inspiration */}
                  <div className="bg-warm-section rounded-xl shadow-soft p-6">
                    <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4">
                      {t('inspiration')}
                    </h3>
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop"
                        alt={t('inspiration')}
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                    <p className="text-sm text-hierarchy-secondary">
                      "{t('inspirationQuote')}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="py-16 bg-gradient-to-r from-accent to-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-elegant text-2xl lg:text-3xl text-sophisticated-dark mb-4">
                {t('readyToBegin')}
              </h2>
              <p className="text-sophisticated text-sophisticated-dark mb-8 max-w-2xl mx-auto">
                {t('bookingCtaDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-sophisticated-dark text-gallery-canvas hover:bg-hierarchy-secondary magnetic-hover"
                  onClick={() => setActiveTab('form')}
                >
                  <Icon name="Calendar" size={20} className="mr-2" />
                  {t('bookNow')}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-sophisticated-dark text-sophisticated-dark hover:bg-sophisticated-dark hover:text-gallery-canvas"
                  onClick={() => window.location.href = '/gallery'}
                >
                  <Icon name="Camera" size={20} className="mr-2" />
                  {t('viewMyWork')}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          autoClose={true}
          duration={4000}
        />
      )}
    </div>
  );
};

export default BookingPage;