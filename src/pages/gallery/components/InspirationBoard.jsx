import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InspirationBoard = ({ 
  isOpen, 
  onClose, 
  inspirationImages, 
  onRemoveImage, 
  onClearBoard,
  onRequestConsultation,
  language 
}) => {
  const translations = {
    bg: {
      title: 'Моят борд за вдъхновение',
      subtitle: 'Запазени снимки за консултация',
      empty: 'Няма запазени снимки',
      emptyDescription: 'Започнете да добавяте снимки към вашия борд за вдъхновение, като кликнете върху иконата сърце.',
      remove: 'Премахни',
      clearAll: 'Изчисти всички',
      requestConsultation: 'Заяви консултация',
      close: 'Затвори',
      imagesSelected: 'избрани снимки'
    },
    en: {
      title: 'My Inspiration Board',
      subtitle: 'Saved images for consultation',
      empty: 'No saved images',
      emptyDescription: 'Start adding images to your inspiration board by clicking the heart icon.',
      remove: 'Remove',
      clearAll: 'Clear All',
      requestConsultation: 'Request Consultation',
      close: 'Close',
      imagesSelected: 'images selected'
    }
  };

  const t = translations?.[language];

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-strong max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-medium text-sophisticated-dark">
              {t?.title}
            </h2>
            <p className="text-sm text-hierarchy-secondary mt-1">
              {inspirationImages?.length} {t?.imagesSelected}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {inspirationImages?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearBoard}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
                className="elegant-hover"
              >
                {t?.clearAll}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="elegant-hover"
              title={t?.close}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {inspirationImages?.length === 0 ? (
            /* Empty State */
            (<div className="text-center py-12">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={24} className="text-sophisticated-dark" />
              </div>
              <h3 className="text-lg font-heading font-medium text-sophisticated-dark mb-2">
                {t?.empty}
              </h3>
              <p className="text-hierarchy-secondary max-w-md mx-auto">
                {t?.emptyDescription}
              </p>
            </div>)
          ) : (
            /* Images Grid */
            (<div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {inspirationImages?.map((image) => (
                  <div key={image?.id} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg shadow-soft group-hover:shadow-medium transition-all duration-elegant">
                      <Image
                        src={image?.src}
                        alt={image?.alt}
                        className="w-full h-full object-cover gallery-image"
                      />
                      
                      {/* Remove Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-elegant flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveImage(image?.id)}
                          className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-red-500 hover:text-white"
                          title={t?.remove}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image Info */}
                    <div className="mt-2">
                      <p className="text-xs font-sophisticated text-sophisticated-dark">
                        {image?.category}
                      </p>
                      {image?.location && (
                        <p className="text-xs text-hierarchy-secondary flex items-center mt-1">
                          <Icon name="MapPin" size={10} className="mr-1" />
                          {image?.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Summary */}
              <div className="bg-warm-section rounded-lg p-4 mb-6">
                <h4 className="font-sophisticated font-medium text-sophisticated-dark mb-2">
                  {t?.subtitle}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(inspirationImages.map(img => img.category)))?.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-accent rounded-full text-xs font-sophisticated text-sophisticated-dark"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>)
          )}
        </div>

        {/* Footer */}
        {inspirationImages?.length > 0 && (
          <div className="p-6 border-t border-border bg-surface-elevation">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                className="elegant-hover"
              >
                {t?.close}
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={onRequestConsultation}
                iconName="Calendar"
                iconPosition="left"
                className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
              >
                {t?.requestConsultation}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspirationBoard;