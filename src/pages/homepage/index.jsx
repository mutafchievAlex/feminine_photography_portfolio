import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage, useTranslations } from '../../hooks/useLanguage';
import Header from '../../components/ui/Header';
import HeroGallery from './components/HeroGallery';
import RecentStories from './components/RecentStories';
import WhyChooseSection from './components/WhyChooseSection';
import BookingWidget from './components/BookingWidget';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';

const Homepage = () => {
  const { language, isEnglish } = useLanguage();
  const { t } = useTranslations();

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

      <div className="min-h-screen bg-gallery-canvas">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Gallery Section */}
          <HeroGallery />

          {/* Recent Stories Section */}
          <RecentStories />

          {/* Why Choose Section */}
          <WhyChooseSection />

          {/* Booking Widget Section */}
          <BookingWidget />

          {/* Instagram Feed Section */}
          <InstagramFeed />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;