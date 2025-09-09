import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GalleryFilter from './components/GalleryFilter';
import GalleryGrid from './components/GalleryGrid';
import ImageLightbox from './components/ImageLightbox';
import InspirationBoard from './components/InspirationBoard';
import CategoryIntro from './components/CategoryIntro';

const Gallery = () => {
  const [language, setLanguage] = useState('bg');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStyle, setActiveStyle] = useState('all');
  const [activeSeason, setActiveSeason] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inspirationBoard, setInspirationBoard] = useState([]);
  const [boardOpen, setBoardOpen] = useState(false);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  // Mock gallery data
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      alt: "Romantic wedding ceremony",
      category: language === 'bg' ? 'Сватби' : 'Weddings',
      style: 'romantic',
      season: 'summer',
      location: language === 'bg' ? 'София, България' : 'Sofia, Bulgaria',
      testimonial: language === 'bg' ? 'Елена улови всеки магически момент от нашия специален ден!' : 'Elena captured every magical moment of our special day!',
      client: language === 'bg' ? 'Мария и Петър' : 'Maria & Peter',
      categoryKey: 'weddings'
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
      alt: "Maternity portrait in nature",
      category: language === 'bg' ? 'Бременност' : 'Maternity',
      style: 'romantic',
      season: 'spring',
      location: language === 'bg' ? 'Витоша, България' : 'Vitosha, Bulgaria',
      testimonial: language === 'bg' ? 'Чувствах се толкова красива и уверена по време на сесията.' : 'I felt so beautiful and confident during the session.',
      client: language === 'bg' ? 'Анна' : 'Anna',
      categoryKey: 'maternity'
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=700",
      alt: "Happy family portrait",
      category: language === 'bg' ? 'Семейство' : 'Family',
      style: 'candid',
      season: 'autumn',
      location: language === 'bg' ? 'Борисова градина' : 'Borisova Garden',
      testimonial: language === 'bg' ? 'Децата се чувстваха свободно и естествено.' : 'The children felt free and natural.',
      client: language === 'bg' ? 'Семейство Иванови' : 'Ivanov Family',
      categoryKey: 'family'
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      alt: "Professional business headshot",
      category: language === 'bg' ? 'Портрети' : 'Headshots',
      style: 'editorial',
      season: 'winter',
      location: language === 'bg' ? 'Студио София' : 'Sofia Studio',
      testimonial: language === 'bg' ? 'Перфектни снимки за моя LinkedIn профил!' : 'Perfect photos for my LinkedIn profile!',
      client: language === 'bg' ? 'Димитър' : 'Dimitar',
      categoryKey: 'headshots'
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600",
      alt: "Romantic couples session",
      category: language === 'bg' ? 'Двойки' : 'Couples',
      style: 'romantic',
      season: 'summer',
      location: language === 'bg' ? 'Стария град, Пловдив' : 'Old Town, Plovdiv',
      testimonial: language === 'bg' ? 'Елена улови нашата любов по най-красивия начин.' : 'Elena captured our love in the most beautiful way.',
      client: language === 'bg' ? 'Елена и Георги' : 'Elena & Georgi',
      categoryKey: 'couples'
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800",
      alt: "Wedding reception dance",
      category: language === 'bg' ? 'Сватби' : 'Weddings',
      style: 'candid',
      season: 'autumn',
      location: language === 'bg' ? 'Хотел Маринела' : 'Hotel Marinela',
      categoryKey: 'weddings'
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500",
      alt: "Maternity silhouette",
      category: language === 'bg' ? 'Бременност' : 'Maternity',
      style: 'editorial',
      season: 'winter',
      location: language === 'bg' ? 'Студио' : 'Studio',
      categoryKey: 'maternity'
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=700",
      alt: "Family playing in park",
      category: language === 'bg' ? 'Семейство' : 'Family',
      style: 'candid',
      season: 'spring',
      location: language === 'bg' ? 'Южен парк' : 'South Park',
      categoryKey: 'family'
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500",
      alt: "Professional woman portrait",
      category: language === 'bg' ? 'Портрети' : 'Headshots',
      style: 'editorial',
      season: 'spring',
      location: language === 'bg' ? 'Офис център' : 'Business Center',
      categoryKey: 'headshots'
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
      alt: "Engagement session in city",
      category: language === 'bg' ? 'Двойки' : 'Couples',
      style: 'editorial',
      season: 'autumn',
      location: language === 'bg' ? 'НДК, София' : 'NDK, Sofia',
      categoryKey: 'couples'
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
      alt: "Wedding ceremony outdoor",
      category: language === 'bg' ? 'Сватби' : 'Weddings',
      style: 'romantic',
      season: 'summer',
      location: language === 'bg' ? 'Замък Равадиново' : 'Ravadinovo Castle',
      categoryKey: 'weddings'
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
      alt: "Maternity couple portrait",
      category: language === 'bg' ? 'Бременност' : 'Maternity',
      style: 'romantic',
      season: 'summer',
      location: language === 'bg' ? 'Морската градина' : 'Sea Garden',
      categoryKey: 'maternity'
    }
  ];

  const translations = {
    bg: {
      title: 'Галерия',
      subtitle: 'Открийте моята колекция от незабравими моменти',
      inspirationBoard: 'Борд за вдъхновение',
      viewBoard: 'Виж борда',
      languageToggle: 'EN',
      backToTop: 'Нагоре'
    },
    en: {
      title: 'Gallery',
      subtitle: 'Discover my collection of unforgettable moments',
      inspirationBoard: 'Inspiration Board',
      viewBoard: 'View Board',
      languageToggle: 'БГ',
      backToTop: 'Back to Top'
    }
  };

  const t = translations?.[language];

  // Filter images based on active filters
  const filteredImages = galleryImages?.filter(image => {
    const categoryMatch = activeCategory === 'all' || image?.categoryKey === activeCategory;
    const styleMatch = activeStyle === 'all' || image?.style === activeStyle;
    const seasonMatch = activeSeason === 'all' || image?.season === activeSeason;
    
    return categoryMatch && styleMatch && seasonMatch;
  });

  const handleLanguageToggle = () => {
    const newLanguage = language === 'bg' ? 'en' : 'bg';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleImageClick = (image, index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNavigate = (newIndex) => {
    setCurrentImageIndex(newIndex);
  };

  const handleToggleInspiration = (imageId) => {
    setInspirationBoard(prev => 
      prev?.includes(imageId) 
        ? prev?.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleRemoveFromBoard = (imageId) => {
    setInspirationBoard(prev => prev?.filter(id => id !== imageId));
  };

  const handleClearBoard = () => {
    setInspirationBoard([]);
  };

  const handleRequestConsultation = () => {
    setBoardOpen(false);
    window.location.href = '/booking';
  };

  const inspirationImages = galleryImages?.filter(img => 
    inspirationBoard?.includes(img?.id)
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{language === 'bg' ? 'Галерия - Elena Rose Photography' : 'Gallery - Elena Rose Photography'}</title>
        <meta 
          name="description" 
          content={language === 'bg' ?'Разгледайте моята колекция от сватбени, семейни, портретни и други фотографии. Професионална фотография в София, България.' :'Explore my collection of wedding, family, portrait and other photography. Professional photography in Sofia, Bulgaria.'
          } 
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-gallery-canvas to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-sophisticated-dark">
                  {t?.title}
                </h1>
                
                {/* Language Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLanguageToggle}
                  className="elegant-hover"
                >
                  {t?.languageToggle}
                </Button>
              </div>
              
              <p className="text-lg text-hierarchy-secondary max-w-2xl mx-auto">
                {t?.subtitle}
              </p>
            </div>

            {/* Inspiration Board Button */}
            {inspirationBoard?.length > 0 && (
              <div className="flex justify-center mb-8">
                <Button
                  variant="default"
                  onClick={() => setBoardOpen(true)}
                  iconName="Heart"
                  iconPosition="left"
                  className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
                >
                  {t?.viewBoard} ({inspirationBoard?.length})
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Category Introduction */}
          <CategoryIntro category={activeCategory} language={language} />

          {/* Gallery Filter */}
          <GalleryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activeStyle={activeStyle}
            onStyleChange={setActiveStyle}
            activeSeason={activeSeason}
            onSeasonChange={setActiveSeason}
            language={language}
          />

          {/* Gallery Grid */}
          <GalleryGrid
            images={filteredImages}
            onImageClick={handleImageClick}
            inspirationBoard={inspirationBoard}
            onToggleInspiration={handleToggleInspiration}
            language={language}
          />
        </main>

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={filteredImages}
          currentIndex={currentImageIndex}
          onNavigate={handleLightboxNavigate}
          inspirationBoard={inspirationBoard}
          onToggleInspiration={handleToggleInspiration}
          language={language}
        />

        {/* Inspiration Board Modal */}
        <InspirationBoard
          isOpen={boardOpen}
          onClose={() => setBoardOpen(false)}
          inspirationImages={inspirationImages}
          onRemoveImage={handleRemoveFromBoard}
          onClearBoard={handleClearBoard}
          onRequestConsultation={handleRequestConsultation}
          language={language}
        />

        {/* Back to Top Button */}
        <Button
          variant="default"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-strong magnetic-hover"
          title={t?.backToTop}
        >
          <Icon name="ChevronUp" size={20} />
        </Button>

        {/* Floating Inspiration Board Widget */}
        {inspirationBoard?.length > 0 && (
          <div className="fixed bottom-6 right-20 z-40 lg:block hidden">
            <Button
              variant="default"
              onClick={() => setBoardOpen(true)}
              iconName="Heart"
              iconPosition="left"
              iconSize={16}
              className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-strong magnetic-hover pulse-cta"
            >
              {inspirationBoard?.length}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;