import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GalleryFilter from './components/GalleryFilter';
import GalleryGrid from './components/GalleryGrid';
import ImageLightbox from './components/ImageLightbox';
import InspirationBoard from './components/InspirationBoard';
import CategoryIntro from './components/CategoryIntro';
import useGallery from '../../hooks/useGallery';

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

  const galleryOptions = {
    limit: 48,
    locale: language,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    style: activeStyle !== 'all' ? activeStyle : undefined,
    season: activeSeason !== 'all' ? activeSeason : undefined,
  };

  const {
    gallery: galleryData,
    isLoading: isGalleryLoading,
    error: galleryError,
    refetch: refetchGallery,
  } = useGallery(galleryOptions);

  const localizeField = (value) => {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      return value?.[language] ?? value?.name ?? value?.label ?? value?.title ?? Object.values(value)?.[0] ?? '';
    }

    return '';
  };

  const galleryImages = useMemo(() => {
    const rawGallery = Array.isArray(galleryData)
      ? galleryData
      : galleryData?.items ?? galleryData?.data ?? galleryData?.gallery ?? [];

    return (
      rawGallery
        ?.map((item, index) => {
          const baseImage = item?.image ?? item?.photo ?? item?.media ?? {};
          const imageSource =
            item?.src ??
            item?.url ??
            item?.imageUrl ??
            item?.image ??
            baseImage?.url ??
            baseImage?.src ??
            baseImage?.originalUrl ??
            baseImage?.previewUrl;

          if (!imageSource) {
            return null;
          }

          const categoryKey =
            item?.categoryKey ??
            (typeof item?.category === 'object'
              ? item?.category?.key ?? item?.category?.slug
              : item?.categorySlug ?? item?.categoryId ?? item?.category);

          const styleKey = item?.style ?? item?.styleKey ?? item?.styleSlug ?? baseImage?.style ?? 'all';
          const seasonKey = item?.season ?? item?.seasonKey ?? item?.seasonSlug ?? baseImage?.season ?? 'all';

          return {
            id: item?.id ?? item?.imageId ?? item?.photoId ?? item?.mediaId ?? `gallery-${index}`,
            src: imageSource,
            alt:
              item?.alt ??
              baseImage?.alt ??
              item?.title ??
              (language === 'bg' ? 'Галерия изображение' : 'Gallery image'),
            category:
              localizeField(item?.categoryLabel ?? item?.categoryName ?? item?.category) ||
              categoryKey ||
              (language === 'bg' ? 'Галерия' : 'Gallery'),
            style: styleKey,
            season: seasonKey,
            location:
              localizeField(item?.location ?? item?.locationName ?? baseImage?.location) ||
              (language === 'bg' ? 'София, България' : 'Sofia, Bulgaria'),
            testimonial: localizeField(item?.testimonial ?? item?.quote),
            client: localizeField(item?.client ?? item?.clientName ?? item?.subject),
            categoryKey: categoryKey ?? 'all',
          };
        })
        ?.filter(Boolean)
    ) ?? [];
  }, [galleryData, language]);

  const gallerySkeletonItems = useMemo(() => Array.from({ length: 12 }), []);

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
  const filteredImages = useMemo(() => (
    galleryImages?.filter((image) => {
      const categoryMatch = activeCategory === 'all' || image?.categoryKey === activeCategory;
      const styleMatch = activeStyle === 'all' || image?.style === activeStyle;
      const seasonMatch = activeSeason === 'all' || image?.season === activeSeason;

      return categoryMatch && styleMatch && seasonMatch;
    }) ?? []
  ), [galleryImages, activeCategory, activeStyle, activeSeason]);

  useEffect(() => {
    if (filteredImages?.length === 0) {
      if (lightboxOpen) {
        setLightboxOpen(false);
      }

      if (currentImageIndex !== 0) {
        setCurrentImageIndex(0);
      }

      return;
    }

    if (currentImageIndex >= filteredImages.length) {
      setCurrentImageIndex(0);
    }
  }, [filteredImages, currentImageIndex, lightboxOpen]);

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

  const inspirationImages = useMemo(
    () => galleryImages?.filter((img) => inspirationBoard?.includes(img?.id)) ?? [],
    [galleryImages, inspirationBoard]
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
          {isGalleryLoading && (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {gallerySkeletonItems.map((_, index) => (
                <div
                  key={`gallery-skeleton-${index}`}
                  className="break-inside-avoid overflow-hidden rounded-lg shadow-soft bg-surface-elevation animate-pulse h-72"
                >
                  <div className="h-full w-full" />
                </div>
              ))}
            </div>
          )}

          {!isGalleryLoading && galleryError && (
            <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
              <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
              <h3 className="font-heading text-2xl text-sophisticated-dark">
                {language === 'bg' ? 'Не успяхме да заредим галерията' : 'We couldn\'t load the gallery'}
              </h3>
              <p className="text-hierarchy-secondary font-sophisticated">
                {language === 'bg'
                  ? 'Проверете връзката си и опитайте отново. Ако проблемът продължи, свържете се с нас.'
                  : 'Please check your connection and try again. If the issue persists, get in touch with us.'}
              </p>
              <Button variant="outline" onClick={refetchGallery} className="elegant-hover">
                <Icon name="RefreshCcw" size={16} className="mr-2" />
                {language === 'bg' ? 'Опитай отново' : 'Try again'}
              </Button>
            </div>
          )}

          {!isGalleryLoading && !galleryError && filteredImages?.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
              <Icon name="Images" size={36} className="mx-auto text-accent" />
              <h3 className="font-heading text-2xl text-sophisticated-dark">
                {language === 'bg' ? 'Няма резултати за избраните филтри' : 'No results for your current filters'}
              </h3>
              <p className="text-hierarchy-secondary font-sophisticated">
                {language === 'bg'
                  ? 'Опитайте с други комбинации от категория, стил или сезон, за да откриете повече вдъхновение.'
                  : 'Try adjusting the category, style or season to explore more inspiration.'}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveStyle('all');
                  setActiveSeason('all');
                }}
                className="elegant-hover"
              >
                {language === 'bg' ? 'Изчисти филтрите' : 'Clear filters'}
              </Button>
            </div>
          )}

          {!isGalleryLoading && !galleryError && filteredImages?.length > 0 && (
            <GalleryGrid
              images={filteredImages}
              onImageClick={handleImageClick}
              inspirationBoard={inspirationBoard}
              onToggleInspiration={handleToggleInspiration}
              language={language}
            />
          )}
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