import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState('bg');

  const heroImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80",
      alt: "Romantic wedding moment",
      category: "wedding"
    },
    {
      id: 2,
      src: "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=2000&q=80",
      alt: "Glowing maternity portrait",
      category: "maternity"
    },
    {
      id: 3,
      src: "https://images.pixabay.com/photo/2016/11/29/20/22/family-1871178_1280.jpg?auto=compress&cs=tinysrgb&w=2000&q=80",
      alt: "Joyful family interaction",
      category: "family"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      alt: "Intimate couple portrait",
      category: "couple"
    }
  ];

  const taglines = {
    bg: {
      main: "Запечатвам моменти, създавам спомени",
      sub: "Професионална фотография с женствен поглед"
    },
    en: {
      main: "Capturing moments, creating memories",
      sub: "Professional photography with a feminine touch"
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages?.length]);

  const toggleLanguage = () => {
    const newLanguage = language === 'bg' ? 'en' : 'bg';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages?.length) % heroImages?.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={heroImages?.[currentSlide]?.src}
              alt={heroImages?.[currentSlide]?.alt}
              className="w-full h-full object-cover ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 elegant-hover"
        aria-label="Previous image"
      >
        <Icon name="ChevronLeft" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 elegant-hover"
        aria-label="Next image"
      >
        <Icon name="ChevronRight" size={24} />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroImages?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' :'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-sophisticated text-sm hover:bg-white/30 transition-all duration-300 elegant-hover"
        >
          {language === 'bg' ? 'EN' : 'БГ'}
        </button>
      </div>
      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium leading-tight">
              {taglines?.[language]?.main}
            </h1>
            <p className="font-sophisticated text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {taglines?.[language]?.sub}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                variant="default"
                className="bg-white text-sophisticated-dark hover:bg-white/90 px-8 py-3 text-lg magnetic-hover"
                onClick={() => window.location.href = '/gallery'}
              >
                <Icon name="Camera" size={20} className="mr-2" />
                {language === 'bg' ? 'Разгледай галерията' : 'View Gallery'}
              </Button>
              
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-sophisticated-dark px-8 py-3 text-lg elegant-hover"
                onClick={() => window.location.href = '/booking'}
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                {language === 'bg' ? 'Резервирай консултация' : 'Book Consultation'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 z-20 hidden lg:flex flex-col items-center text-white/70">
        <span className="font-sophisticated text-sm mb-2 rotate-90 origin-center whitespace-nowrap">
          {language === 'bg' ? 'Скролирай надолу' : 'Scroll down'}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-white/50"
        />
      </div>
    </div>
  );
};

export default HeroGallery;