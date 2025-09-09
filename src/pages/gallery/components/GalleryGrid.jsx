import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GalleryGrid = ({ 
  images, 
  onImageClick, 
  inspirationBoard, 
  onToggleInspiration,
  language 
}) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(12);

  const translations = {
    bg: {
      loadMore: 'Зареди още',
      addToBoard: 'Добави към борда',
      removeFromBoard: 'Премахни от борда',
      viewLarger: 'Виж по-голямо'
    },
    en: {
      loadMore: 'Load More',
      addToBoard: 'Add to Board',
      removeFromBoard: 'Remove from Board',
      viewLarger: 'View Larger'
    }
  };

  const t = translations?.[language];

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const loadMoreImages = () => {
    setVisibleImages(prev => Math.min(prev + 12, images?.length));
  };

  const displayedImages = images?.slice(0, visibleImages);

  return (
    <div>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {displayedImages?.map((image, index) => (
          <div
            key={image?.id}
            className="break-inside-avoid relative group cursor-pointer elegant-hover"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: loadedImages?.has(image?.id) ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg shadow-soft group-hover:shadow-medium transition-all duration-elegant">
              <Image
                src={image?.src}
                alt={image?.alt}
                className="w-full h-auto object-cover gallery-image"
                loading="lazy"
                onLoad={() => handleImageLoad(image?.id)}
                onClick={() => onImageClick(image, index)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-elegant">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-sm font-sophisticated font-medium">
                        {image?.category}
                      </p>
                      {image?.location && (
                        <p className="text-xs opacity-80 flex items-center mt-1">
                          <Icon name="MapPin" size={12} className="mr-1" />
                          {image?.location}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onToggleInspiration(image?.id);
                        }}
                        className={`w-8 h-8 rounded-full ${
                          inspirationBoard?.includes(image?.id)
                            ? 'bg-accent text-sophisticated-dark' :'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        title={inspirationBoard?.includes(image?.id) ? t?.removeFromBoard : t?.addToBoard}
                      >
                        <Icon 
                          name={inspirationBoard?.includes(image?.id) ? "Heart" : "HeartOff"} 
                          size={14} 
                        />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onImageClick(image, index)}
                        className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                        title={t?.viewLarger}
                      >
                        <Icon name="Expand" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading Placeholder */}
              {!loadedImages?.has(image?.id) && (
                <div className="absolute inset-0 bg-surface-elevation animate-pulse flex items-center justify-center">
                  <div className="elegant-loader"></div>
                </div>
              )}

              {/* Inspiration Board Indicator */}
              {inspirationBoard?.includes(image?.id) && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-soft">
                  <Icon name="Heart" size={12} className="text-sophisticated-dark" />
                </div>
              )}
            </div>

            {/* Image Info */}
            {image?.testimonial && (
              <div className="mt-3 p-3 bg-warm-section rounded-lg">
                <p className="text-xs text-hierarchy-secondary italic">
                  "{image?.testimonial}"
                </p>
                {image?.client && (
                  <p className="text-xs font-sophisticated text-sophisticated-dark mt-1">
                    - {image?.client}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {visibleImages < images?.length && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMoreImages}
            iconName="ChevronDown"
            iconPosition="right"
            className="elegant-hover"
          >
            {t?.loadMore} ({images?.length - visibleImages} {language === 'bg' ? 'още' : 'more'})
          </Button>
        </div>
      )}
      {/* End of Gallery Message */}
      {visibleImages >= images?.length && images?.length > 12 && (
        <div className="text-center mt-12 p-6 bg-warm-section rounded-lg">
          <Icon name="Camera" size={32} className="text-accent mx-auto mb-3" />
          <p className="text-sophisticated-dark font-sophisticated">
            {language === 'bg' ?'Видяхте всички снимки в тази категория' :'You\'ve seen all images in this category'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;