import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AlbumHero = ({ images = [], currentIndex, onImageChange, album, showNavigation }) => {
  const [dragStartX, setDragStartX] = useState(0);

  const handleDragStart = (e) => {
    setDragStartX(e.clientX);
  };

  const handleDragEnd = (e) => {
    const dragEndX = e.clientX;
    const diff = dragStartX - dragEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        // Swiped left, show next image
        onImageChange?.(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swiped right, show previous image
        onImageChange?.(currentIndex - 1);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative w-full bg-[#FBF7F4]"
      style={{ aspectRatio: '16/10' }}
    >
      {/* Horizontal Image Carousel */}
      <div
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
      >
        <motion.div
          className="flex h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 40, mass: 2 }}
          draggable
        >
          {images?.map((image, index) => (
            <div
              key={image?.id || index}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={image?.imageUrl || image?.thumbnailUrl}
                alt={image?.altText || image?.title || `Photo ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Album Title Overlay - Only show after navigation appears */}
      {showNavigation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-8 left-0 right-0 text-center text-white px-6 pointer-events-none"
        >
          <h1 className="text-3xl md:text-5xl font-serif mb-2">{album?.title}</h1>
          {album?.description && (
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              {album?.description}
            </p>
          )}
          {album?.sessionDate && (
            <p className="text-xs md:text-sm text-white/70 mt-2">
              {new Date(album?.sessionDate)?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlbumHero;