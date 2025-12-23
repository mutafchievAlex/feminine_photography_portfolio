import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Info } from 'lucide-react';

const ImageViewer = ({
  currentImage,
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  isSlideshow,
  onToggleSlideshow,
  onToggleMetadata
}) => {
  return (
    <>
      {/* Navigation Arrows */}
      <motion.button
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        onClick={onPrevious}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-[#8B7355]" />
      </motion.button>
      <motion.button
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        onClick={onNext}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-[#8B7355]" />
      </motion.button>
      {/* Control Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-6 right-20 z-40 flex items-center gap-3"
      >
        {/* Slideshow Toggle */}
        <button
          onClick={onToggleSlideshow}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
          aria-label={isSlideshow ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isSlideshow ? (
            <Pause className="w-5 h-5 text-[#8B7355]" />
          ) : (
            <Play className="w-5 h-5 text-[#8B7355]" />
          )}
        </button>

        {/* Info Toggle */}
        <button
          onClick={onToggleMetadata}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
          aria-label="Toggle image information"
        >
          <Info className="w-5 h-5 text-[#8B7355]" />
        </button>

        {/* Image Counter */}
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-[#8B7355] text-sm font-medium">
            {currentIndex + 1} / {totalImages}
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default ImageViewer;