import React from 'react';
import { motion } from 'framer-motion';

const AlbumNavigation = ({ images, currentIndex, album, onThumbnailClick }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#8B7355]/20 z-30"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Album Info */}
        <div className="mb-3 text-center">
          <h3 className="text-lg font-medium text-[#8B7355]">{album?.title}</h3>
          <p className="text-sm text-[#8B7355]/70">
            {images?.length} {images?.length === 1 ? 'Photo' : 'Photos'}
            {album?.location && ` • ${album?.location}`}
          </p>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images?.map((image, index) => (
            <button
              key={image?.id || index}
              onClick={() => onThumbnailClick?.(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-[#8B7355] scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image?.thumbnailUrl || image?.imageUrl}
                alt={image?.altText || image?.title || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AlbumNavigation;