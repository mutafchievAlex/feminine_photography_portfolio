import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import ApproachSection from './components/ApproachSection';
import RecognitionSection from './components/RecognitionSection';

import { useLanguage } from '../../hooks/useLanguage';

const AboutPage = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('aboutTitle')} - {t('photographerName')} | {t('professionalPhotographer')}</title>
        <meta name="description" content={t('aboutDescription')} />
        <meta name="keywords" content={t('metaKeywords')} />
        <meta property="og:title" content={t('aboutTitle')} />
        <meta property="og:description" content={t('aboutDescription')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/about" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          <HeroSection />
          <StorySection />
          <ApproachSection />
          <RecognitionSection />
        </main>

        {/* Footer */}
        <footer className="bg-sophisticated-dark text-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading text-xl mb-4">{t('photographerName')}</h3>
                <p className="text-background/80 text-sm">
                  {t('aboutDescription')}
                </p>
              </div>
              
              <div>
                <h4 className="font-sophisticated text-lg mb-4">{t('contactMe')}</h4>
                <div className="space-y-2 text-sm text-background/80">
                  <p>📧 elena@elenarose.bg</p>
                  <p>📱 +359 888 123 456</p>
                  <p>📍 {t('locationSofiaBulgaria')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-sophisticated text-lg mb-4">{t('followMe')}</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-background/80 hover:text-background transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="text-background/80 hover:text-background transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="text-background/80 hover:text-background transition-colors">
                    Pinterest
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-background/20 mt-8 pt-8 text-center">
              <p className="text-background/60 text-sm">
                © {new Date()?.getFullYear()} {t('photographerName')} Photography. {t('allRightsReserved')}.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;