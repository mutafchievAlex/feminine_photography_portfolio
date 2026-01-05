import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { useHeroGallery } from '../../../hooks/useHeroGallery';

const HeroGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState('bg');
  const { images: heroImages, loading, error } = useHeroGallery();

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: 'easeOut' }
    }
  };

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
    if (!heroImages || heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
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
      {/* Loading or No Images State */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50 z-40 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="font-sophisticated">{language === 'bg' ? 'Зареждане...' : 'Loading...'}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50 z-40 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="font-sophisticated text-red-400">
              {language === 'bg' ? 'Грешка при зареждане на снимки' : 'Error loading images'}
            </p>
          </div>
        </div>
      )}

      {heroImages && heroImages.length > 0 ? (
        <>
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
        </>
      ) : (
        // Fallback UI when no images are available
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
          <div className="text-center text-white max-w-2xl mx-auto px-6">
            <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="font-sophisticated text-lg text-gray-300">
              {language === 'bg' 
                ? 'Нямам карирани снимки. Добавете един в "Hero" албум в администраторския панел.' 
                : 'No images available. Please add images to the "Hero" album in the admin panel.'}
            </p>
          </div>
        </div>
      )}
      {heroImages && heroImages.length > 0 && (
        <>
          {/* Hero Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <motion.div
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.h1
                  variants={textItemVariants}
                  className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium leading-tight"
                >
                  {taglines?.[language]?.main}
                </motion.h1>
                <motion.p
                  variants={textItemVariants}
                  className="font-sophisticated text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
                >
                  {taglines?.[language]?.sub}
                </motion.p>
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
        </>
      )}
    </div>
  );
};

export default HeroGallery;