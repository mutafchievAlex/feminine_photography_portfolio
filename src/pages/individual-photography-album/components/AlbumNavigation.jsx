import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AlbumNavigation = ({ images, currentIndex, album, onThumbnailClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scheduleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  // Show by default for 3s on load
  useEffect(() => {
    setIsHovered(true);
    scheduleHide();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show menu if mouse is in bottom 150px of viewport
      const isNearBottom = window.innerHeight - e.clientY < 150;
      if (isNearBottom) {
        setIsHovered(true);
        scheduleHide();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Drag-to-scroll like Instagram feed
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.1;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scheduleHide();
  };

  const handleHoverLeave = () => {
    scheduleHide();
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isHovered ? 0 : 100, opacity: isHovered ? 1 : 0 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, type: 'tween' }}
      onMouseEnter={() => { setIsHovered(true); scheduleHide(); }}
      onMouseLeave={() => { handleMouseLeave(); scheduleHide(); }}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm z-30 will-change-transform py-4"
    >
      {/* Thumbnail Strip - No Background Box */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6 justify-center cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onMouseEnter={() => { setIsHovered(true); scheduleHide(); }}
        onMouseLeave={() => { handleMouseLeave(); scheduleHide(); }}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
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