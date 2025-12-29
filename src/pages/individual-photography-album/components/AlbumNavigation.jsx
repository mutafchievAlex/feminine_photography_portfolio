import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AlbumNavigation = ({ images, currentIndex, album, onThumbnailClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show menu if mouse is in bottom 150px of viewport
      const isNearBottom = window.innerHeight - e.clientY < 150;
      if (isNearBottom) {
        setIsHovered(true);
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Set timeout to hide menu after 3 seconds when hovered
    if (isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isHovered ? 0 : 100, opacity: isHovered ? 1 : 0 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, type: 'tween' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm z-30 will-change-transform py-4"
    >
      {/* Thumbnail Strip - No Background Box */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6 justify-center">
        {images?.map((image, index) => (
          <motion.button
            key={image?.id || index}
            onClick={() => onThumbnailClick?.(index)}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
              index === currentIndex
                ? 'ring-2 ring-white/80 opacity-100 scale-105'
                : 'opacity-50 hover:opacity-75'
            }`}
          >
            <img
              src={image?.thumbnailUrl || image?.imageUrl}
              alt={image?.altText || image?.title || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default AlbumNavigation;