import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const value = {
    language,
    setLanguage,
    toggleLanguage,
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
  
  const translations = {
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
      termsOfService: 'Условия за ползване'
    },
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
      termsOfService: 'Terms of Service'
    }
  };
  
  const t = (key) => {
    return translations?.[language]?.[key] || translations?.bg?.[key] || key;
  };
  
  return { t, translations: translations?.[language] };
};