import React, { useState } from 'react';

import Header from '../../components/ui/Header';
import BookingForm from './components/BookingForm';
import ConsultationProcess from './components/ConsultationProcess';
import TrustSignals from './components/TrustSignals';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import { bookingService } from '../../services/bookingService';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

import { useLanguage } from '../../hooks/useLanguage';

const BookingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await bookingService?.create(formData);
      setSubmitSuccess(true);
      
      // Show success message
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError(error?.message || 'Възникна грешка при създаването на резервацията. Моля опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await bookingService?.create(formData);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError(error?.message || 'Възникна грешка при създаването на резервацията. Моля опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const tabs = [
    { id: 'form', label: 'Резервация / Booking', icon: 'Calendar' },
    { id: 'calendar', label: 'Календар / Calendar', icon: 'Calendar' },
    { id: 'process', label: 'Процес / Process', icon: 'Info' },
    { id: 'trust', label: 'Отзиви / Reviews', icon: 'Star' }
  ];

  const { t } = useLanguage();

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
                    { icon: 'Clock', title: '60-90 мин', subtitle: 'Консултация' },
                    { icon: 'Gift', title: 'Безплатно', subtitle: 'Без задължения' },
                    { icon: 'Heart', title: 'Персонално', subtitle: 'За вашите нужди' }
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
                        alt="Консултация за фотосесия"
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-medium elegant-hover">
                      <Image
                        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop"
                        alt="Планиране на фотосесия"
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                  </div>
                  <div className="pt-8">
                    <div className="aspect-[4/6] rounded-xl overflow-hidden shadow-medium elegant-hover">
                      <Image
                        src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop"
                        alt="Професионална фотография"
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

          {submitSuccess && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-center">
                ✓ Вашата резервация беше изпратена успешно! Ще се свържем с вас скоро.
              </p>
            </div>
          )}

          {submitError && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-center">{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <BookingForm 
                onSubmit={handleBookingSubmit} 
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-surface-elevation rounded-xl shadow-soft p-6">
                <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4">
                    {t('contactMe')} / {t('phone')}
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
                        {t('phone')}
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
                        {t('email')}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Selected Date Display */}
              {selectedDate && (
                <div className="bg-gradient-to-r from-accent to-secondary rounded-xl shadow-soft p-6">
                  <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-2">
                    Избрана дата / Selected Date
                  </h3>
                  <p className="text-sophisticated text-sophisticated-dark">
                    {new Date(selectedDate)?.toLocaleDateString('bg-BG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-sophisticated-dark mt-1">
                    {new Date(selectedDate)?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Inspiration */}
              <div className="bg-warm-section rounded-xl shadow-soft p-6">
                <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4">
                  Вдъхновение / Inspiration
                </h3>
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop"
                    alt="Фотография вдъхновение"
                    className="w-full h-full object-cover gallery-image"
                  />
                </div>
                <p className="text-sm text-hierarchy-secondary">
                  "Всеки момент е уникален и заслужава да бъде запечатан с любов и внимание към детайла."
                </p>
                <p className="text-xs text-hierarchy-secondary mt-2 italic">
                  "Every moment is unique and deserves to be captured with love and attention to detail."
                </p>
              </div>
            </div>
          </div>

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
                      Бърз контакт / Quick Contact
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
                            Обадете се сега / Call now
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
                            Изпратете имейл / Send email
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Selected Date Display */}
                  {selectedDate && (
                    <div className="bg-gradient-to-r from-accent to-secondary rounded-xl shadow-soft p-6">
                      <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-2">
                        Избрана дата / Selected Date
                      </h3>
                      <p className="text-sophisticated text-sophisticated-dark">
                        {new Date(selectedDate)?.toLocaleDateString('bg-BG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-sophisticated-dark mt-1">
                        {new Date(selectedDate)?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Inspiration */}
                  <div className="bg-warm-section rounded-xl shadow-soft p-6">
                    <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4">
                      Вдъхновение / Inspiration
                    </h3>
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop"
                        alt="Фотография вдъхновение"
                        className="w-full h-full object-cover gallery-image"
                      />
                    </div>
                    <p className="text-sm text-hierarchy-secondary">
                      "Всеки момент е уникален и заслужава да бъде запечатан с любов и внимание към детайла."
                    </p>
                    <p className="text-xs text-hierarchy-secondary mt-2 italic">
                      "Every moment is unique and deserves to be captured with love and attention to detail."
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
                Готови да започнем? / Ready to Begin?
              </h2>
              <p className="text-sophisticated text-sophisticated-dark mb-8 max-w-2xl mx-auto">
                Вашата история чака да бъде разказана. Резервирайте консултацията си днес и направете първата стъпка към незабравими спомени.
              </p>
              <p className="text-sophisticated text-sophisticated-dark mb-8 max-w-2xl mx-auto">
                Your story is waiting to be told. Book your consultation today and take the first step toward unforgettable memories.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-sophisticated-dark text-gallery-canvas hover:bg-hierarchy-secondary magnetic-hover"
                  onClick={() => setActiveTab('form')}
                >
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Резервирайте сега / Book Now
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-sophisticated-dark text-sophisticated-dark hover:bg-sophisticated-dark hover:text-gallery-canvas"
                  onClick={() => window.location.href = '/gallery'}
                >
                  <Icon name="Camera" size={20} className="mr-2" />
                  Вижте работата ми / View My Work
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;