import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import Header from '../../components/ui/Header';
import HeroGallery from './components/HeroGallery';
import RecentStories from './components/RecentStories';
import WhyChooseSection from './components/WhyChooseSection';
import BookingWidget from './components/BookingWidget';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';

const Homepage = () => {
  const { language, isEnglish, t } = useLanguage();
  
  // Scroll reveal refs for different sections
  const heroRef = useScrollReveal({ threshold: 0.1 });
  const storiesRef = useScrollReveal({ threshold: 0.15 });
  const whyChooseRef = useScrollReveal({ threshold: 0.15 });
  const bookingRef = useScrollReveal({ threshold: 0.2 });
  const instagramRef = useScrollReveal({ threshold: 0.15 });

  // Animation variants for staggered entrance
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{isEnglish ? 'Elena Rose Photography - Professional Photography with a Feminine Touch' : 'Elena Rose Photography - Професионална фотография с женствен поглед'}</title>
        <meta name="description" content={isEnglish ? 'Professional photographer in Sofia, Bulgaria. Wedding, portrait and family photography with artistic vision and personalized approach.' : 'Професионална фотографка в София, България. Сватбена, портретна и семейна фотография с артистична визия и персонализиран подход.'} />
        <meta name="keywords" content={isEnglish ? 'photographer sofia, wedding photography, portrait photography, maternity sessions, family photography' : 'фотограф софия, сватбена фотография, портретна фотография, матернити сесии, семейна фотография'} />
        <meta property="og:title" content={isEnglish ? 'Elena Rose Photography - Professional Photography' : 'Elena Rose Photography - Професионална фотография'} />
        <meta property="og:description" content={t('heroSubtitle')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elenarose-photography.bg" />
        <link rel="canonical" href="https://elenarose-photography.bg" />
      </Helmet>

      <div>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Gallery Section */}
          <div ref={heroRef.ref}>
            <HeroGallery />
          </div>

          {/* Recent Stories Section */}
          <motion.div
            ref={storiesRef.ref}
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate={storiesRef.isVisible ? 'visible' : 'hidden'}
          >
            <RecentStories />
          </motion.div>

          {/* Why Choose Section */}
          <motion.div
            ref={whyChooseRef.ref}
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate={whyChooseRef.isVisible ? 'visible' : 'hidden'}
          >
            <WhyChooseSection />
          </motion.div>

          {/* Booking Widget Section */}
          <motion.div
            ref={bookingRef.ref}
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate={bookingRef.isVisible ? 'visible' : 'hidden'}
          >
            <BookingWidget />
          </motion.div>

          {/* Instagram Feed Section */}
          <motion.div
            ref={instagramRef.ref}
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate={instagramRef.isVisible ? 'visible' : 'hidden'}
          >
            <InstagramFeed />
          </motion.div>
        </main>

        {/* Footer */}
        <div className="bg-gallery-canvas">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Homepage;