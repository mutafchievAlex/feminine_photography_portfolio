import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AlbumHero = ({ images = [], currentIndex, onImageChange, album, showNavigation }) => {
  const [dragStartX, setDragStartX] = useState(0);
  const sliderRef = useRef(null);
  const [clonesReady, setClonesReady] = useState(false);

  // Seamless loop scroll-by-drag (mouse grab) similar to Instagram feed
  const handleDragMove = (e) => {
    if (!sliderRef.current) return;
    if (e.buttons !== 1) return; // only while mouse down
    const walk = dragStartX - e.clientX;
    sliderRef.current.scrollLeft += walk;
    setDragStartX(e.clientX);
  };

  const handleDragStart = (e) => {
    setDragStartX(e.clientX);
  };

  const handleDragEnd = () => {
    if (sliderRef.current && images.length > 0) {
      const cardWidth = sliderRef.current.clientWidth;
      const nextIndex = Math.round(sliderRef.current.scrollLeft / cardWidth) % images.length;
      onImageChange?.(nextIndex);
    }
    setDragStartX(0);
  };

  // Keep slider position in sync with currentIndex for accessibility controls
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || images.length === 0) return;

    // Prepare seamless loop by positioning on first set
    const cardWidth = slider.clientWidth;
    slider.scrollLeft = currentIndex * cardWidth;
    setClonesReady(true);
  }, [images.length, currentIndex]);

  // Snap back when passing the duplicated set to maintain seamless loop
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !clonesReady || images.length === 0) return;

    const cardWidth = slider.clientWidth;
    const singleRowWidth = cardWidth * images.length;

    const onScroll = () => {
      if (slider.scrollLeft >= singleRowWidth) {
        slider.scrollLeft -= singleRowWidth;
      } else if (slider.scrollLeft < 0) {
        slider.scrollLeft += singleRowWidth;
      }
    };

    slider.addEventListener('scroll', onScroll);
    return () => slider.removeEventListener('scroll', onScroll);
  }, [clonesReady, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Horizontal Image Carousel */}
      <div
        ref={sliderRef}
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDragMove}
      >
        <div className="flex h-full" style={{ scrollSnapType: 'x mandatory' }}>
          {(images?.length > 0 ? [...images, ...images] : [])?.map((image, index) => {
            const baseIndex = index % images.length;
            const baseImage = images[baseIndex];
            return (
              <div
                key={`${baseImage?.id || image?.id || index}-${index}`}
                className="w-full h-full flex-shrink-0 flex items-center justify-center"
                style={{ scrollSnapAlign: 'center' }}
                onClick={() => onImageChange?.(baseIndex)}
              >
                <img
                  src={baseImage?.imageUrl || baseImage?.thumbnailUrl}
                  alt={baseImage?.altText || baseImage?.title || `Photo ${baseIndex + 1}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

        {/* Minimal text overlay at bottom */}
        {album && (
          <div className="absolute inset-x-0 bottom-0 p-6 pb-10 flex flex-col items-center text-white pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium tracking-wide">
              {album?.title}
            </div>
            {album?.description && (
              <p className="mt-2 text-xs text-white/80 text-center max-w-2xl overflow-hidden text-ellipsis">
                {album?.description}
              </p>
            )}
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default AlbumHero;