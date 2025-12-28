import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
      // Navigation
      home: 'Home',
      gallery: 'Gallery',
      about: 'About',
      investment: 'Investment',
      booking: 'Booking',
      
      // Common buttons
      bookConsultation: 'Book Consultation',
      viewGallery: 'View Gallery',
      learnMore: 'Learn More',
      contactMe: 'Contact Me',
      
      // Hero section
      heroTitle: 'Professional Photography with a Feminine Touch',
      heroSubtitle: 'Capturing moments, creating memories',
      heroDescription: 'Wedding, portrait and family photography with artistic vision and personalized approach.',
      
      // Services
      weddingPhotography: 'Wedding Photography',
      portraitPhotography: 'Portrait Photography',
      familyPhotography: 'Family Photography',
      maternityPhotography: 'Maternity Sessions',
      
      // About
      aboutTitle: 'My Story',
      aboutDescription: 'With over 8 years of experience in professional photography, I specialize in creating unique images that tell stories.',
      
      // Contact
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      followMe: 'Follow Me',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      
      // Collection
      collection: 'Collection',
      of: 'of',
      images: 'images',
      loading: 'Loading...',
      noImages: 'No images found in this album',
      backToGallery: 'Back to Gallery',
      imageDetails: 'Image Details',
      title: 'Title',
      description: 'Description',
      captureDate: 'Capture Date',
      location: 'Location',
      technicalDetails: 'Technical Details',
      accessibility: 'Accessibility Description',
      story: 'Story',
      categoryWeddings: 'Weddings',
      categoryMaternity: 'Maternity',
      categoryFamily: 'Family',
      categoryEvents: 'Events',
      categoryPortraits: 'Portraits',
      categoryCorporate: 'Corporate',
      
      notifications: {
        label: 'Notifications',
        title: 'Notifications',
        noNotifications: 'No notifications yet',
        markAllRead: 'Mark all as read',
        markRead: 'Mark as read',
        clearAll: 'Clear all',
        clear: 'Clear',
        justNow: 'Just now',
        minutesAgo: 'm ago',
        hoursAgo: 'h ago',
        daysAgo: 'd ago',
      }
    },
    bg: {
      // Navigation
      home: 'Начало',
      gallery: 'Галерия',
      about: 'За мен',
      investment: 'Инвестиция',
      booking: 'Резервация',
      
      // Common buttons
      bookConsultation: 'Резервирай консултация',
      viewGallery: 'Разгледай галерията',
      learnMore: 'Научи повече',
      contactMe: 'Свържи се с мен',
      
      // Hero section
      heroTitle: 'Професионална фотография с женствен поглед',
      heroSubtitle: 'Запечатвам моменти, създавам спомени',
      heroDescription: 'Сватбена, портретна и семейна фотография с артистична визия и персонализиран подход.',
      
      // Services
      weddingPhotography: 'Сватбена фотография',
      portraitPhotography: 'Портретна фотография',
      familyPhotography: 'Семейна фотография',
      maternityPhotography: 'Матернити сесии',
      
      // About
      aboutTitle: 'Моята история',
      aboutDescription: 'С над 8 години опит в професионалната фотография, специализирам в създаването на неповторими образи, които разказват истории.',
      
      // Contact
      phone: 'Телефон',
      email: 'Имейл',
      address: 'Адрес',
      followMe: 'Последвай ме',
      
      // Footer
      allRightsReserved: 'Всички права запазени',
      privacyPolicy: 'Политика за поверителност',
      termsOfService: 'Условия за ползване',
      
      // Collection
      collection: 'Колекция',
      of: 'от',
      images: 'снимки',
      loading: 'Зареждане...',
      noImages: 'Няма намерени снимки в този албум',
      backToGallery: 'Обратно към галерията',
      imageDetails: 'Детайли за снимката',
      title: 'Заглавие',
      description: 'Описание',
      captureDate: 'Дата на заснемане',
      location: 'Локация',
      technicalDetails: 'Технически детайли',
      accessibility: 'Описание за достъпност',
      story: 'История',
      categoryWeddings: 'Сватби',
      categoryMaternity: 'Бременност',
      categoryFamily: 'Семейство',
      categoryEvents: 'Събития',
      categoryPortraits: 'Портрети',
      categoryCorporate: 'Корпоративни',
      
      notifications: {
        label: 'Известия',
        title: 'Известия',
        noNotifications: 'Няма известия',
        markAllRead: 'Маркирай всички като прочетени',
        markRead: 'Маркирай като прочетено',
        clearAll: 'Изчисти всички',
        clear: 'Изчисти',
        justNow: 'Току-що',
        minutesAgo: 'мин',
        hoursAgo: 'ч',
        daysAgo: 'д',
      }
    }
  };

// Language context
const LanguageContext = createContext();

// Language provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'bg'
    return localStorage.getItem('language') || 'bg';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bg' ? 'en' : 'bg');
  };

const t = (key, fallback) =>
    translations?.[language]?.[key] ??
    translations?.bg?.[key] ??
    fallback ??
    key;

  const value = {
    language,
    setLanguage,
    toggleLanguage,
     t,
    isEnglish: language === 'en',
    isBulgarian: language === 'bg'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation hook
export const useTranslations = () => {
  const { language } = useLanguage();
  const t = (key) => {
    return translations?.[language]?.[key] || translations?.bg?.[key] || key;
  };
  
  return { t, translations: translations?.[language] };
};