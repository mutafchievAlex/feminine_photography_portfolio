import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import ApproachSection from './components/ApproachSection';
import RecognitionSection from './components/RecognitionSection';
import LocationsSection from './components/LocationsSection';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>За мен - Елена Роуз | Професионален фотограф</title>
        <meta name="description" content="Запознайте се с Елена Роуз - професионален фотограф със специализация в сватбена, семейна и портретна фотография. Над 8 години опит и 500+ щастливи клиенти." />
        <meta name="keywords" content="фотограф България, сватбена фотография, портретна фотография, семейна фотография, професионален фотограф София" />
        <meta property="og:title" content="За мен - Елена Роуз | Професионален фотограф" />
        <meta property="og:description" content="Моята история, подход и философия в света на фотографията. Създавам автентични снимки, които разказват истории." />
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
          <LocationsSection />
        </main>

        {/* Footer */}
        <footer className="bg-sophisticated-dark text-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading text-xl mb-4">Елена Роуз</h3>
                <p className="text-background/80 text-sm">
                  Професионален фотограф със специализация в сватбена, 
                  семейна и портретна фотография.
                </p>
              </div>
              
              <div>
                <h4 className="font-sophisticated text-lg mb-4">Контакти</h4>
                <div className="space-y-2 text-sm text-background/80">
                  <p>📧 elena@elenarose.bg</p>
                  <p>📱 +359 888 123 456</p>
                  <p>📍 София, България</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-sophisticated text-lg mb-4">Следвайте ме</h4>
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
                © {new Date()?.getFullYear()} Елена Роуз Photography. Всички права запазени.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;