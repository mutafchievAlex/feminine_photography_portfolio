import React, { useEffect, useCallback } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImageLightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNavigate,
  inspirationBoard,
  onToggleInspiration,
  language 
}) => {
  const translations = {
    bg: {
      close: 'Затвори',
      previous: 'Предишна',
      next: 'Следваща',
      addToBoard: 'Добави към борда',
      removeFromBoard: 'Премахни от борда',
      imageDetails: 'Детайли за снимката',
      location: 'Локация',
      session: 'Сесия',
      style: 'Стил',
      season: 'Сезон'
    },
    en: {
      close: 'Close',
      previous: 'Previous',
      next: 'Next',
      addToBoard: 'Add to Board',
      removeFromBoard: 'Remove from Board',
      imageDetails: 'Image Details',
      location: 'Location',
      session: 'Session',
      style: 'Style',
      season: 'Season'
    }
  };

  const t = translations?.[language];

  const currentImage = images?.[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    
    switch (e?.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) onNavigate(currentIndex - 1);
        break;
      case 'ArrowRight':
        if (currentIndex < images?.length - 1) onNavigate(currentIndex + 1);
        break;
      default:
        break;
    }
  }, [isOpen, currentIndex, images?.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  const handlePrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < images?.length - 1) onNavigate(currentIndex + 1);
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
        title={t?.close}
      >
        <Icon name="X" size={20} />
      </Button>
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          title={t?.previous}
        >
          <Icon name="ChevronLeft" size={24} />
        </Button>
      )}
      {currentIndex < images?.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          title={t?.next}
        >
          <Icon name="ChevronRight" size={24} />
        </Button>
      )}
      {/* Main Content */}
      <div className="max-w-7xl max-h-full w-full flex items-center justify-center">
        <div className="relative max-w-4xl max-h-full">
          {/* Image */}
          <div className="relative">
            <Image
              src={currentImage?.src}
              alt={currentImage?.alt}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-strong"
            />
            
            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-sophisticated">
              {currentIndex + 1} / {images?.length}
            </div>

            {/* Inspiration Board Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleInspiration(currentImage?.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full ${
                inspirationBoard?.includes(currentImage?.id)
                  ? 'bg-accent text-sophisticated-dark' :'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={inspirationBoard?.includes(currentImage?.id) ? t?.removeFromBoard : t?.addToBoard}
            >
              <Icon 
                name={inspirationBoard?.includes(currentImage?.id) ? "Heart" : "HeartOff"} 
                size={20} 
              />
            </Button>
          </div>

          {/* Image Details */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-lg font-heading font-medium mb-4">
              {t?.imageDetails}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Icon name="Camera" size={16} className="mr-2 opacity-70" />
                  <span className="opacity-70">{t?.session}:</span>
                  <span className="ml-2 font-sophisticated">{currentImage?.category}</span>
                </div>
                
                {currentImage?.location && (
                  <div className="flex items-center">
                    <Icon name="MapPin" size={16} className="mr-2 opacity-70" />
                    <span className="opacity-70">{t?.location}:</span>
                    <span className="ml-2 font-sophisticated">{currentImage?.location}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {currentImage?.style && (
                  <div className="flex items-center">
                    <Icon name="Palette" size={16} className="mr-2 opacity-70" />
                    <span className="opacity-70">{t?.style}:</span>
                    <span className="ml-2 font-sophisticated">{currentImage?.style}</span>
                  </div>
                )}
                
                {currentImage?.season && (
                  <div className="flex items-center">
                    <Icon name="Calendar" size={16} className="mr-2 opacity-70" />
                    <span className="opacity-70">{t?.season}:</span>
                    <span className="ml-2 font-sophisticated">{currentImage?.season}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial */}
            {currentImage?.testimonial && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="italic opacity-90">"{currentImage?.testimonial}"</p>
                {currentImage?.client && (
                  <p className="text-sm font-sophisticated mt-2 opacity-70">
                    - {currentImage?.client}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Touch/Swipe Indicators for Mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 md:hidden">
        <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full text-white text-xs">
          <Icon name="ChevronLeft" size={12} />
          <span>Swipe</span>
          <Icon name="ChevronRight" size={12} />
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;