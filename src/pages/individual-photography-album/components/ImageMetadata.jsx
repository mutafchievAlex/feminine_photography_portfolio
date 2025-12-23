import React from 'react';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';

const ImageMetadata = ({ image, onClose }) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-sm shadow-2xl z-40 overflow-y-auto"
    >
      <div className="p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#8B7355]/10 rounded-full transition-colors"
          aria-label="Close metadata"
        >
          <X className="w-5 h-5 text-[#8B7355]" />
        </button>

        {/* Image Title */}
        <h3 className="text-2xl font-serif text-[#8B7355] mb-6 pr-8">
          {image?.title || 'Untitled'}
        </h3>

        {/* Image Description */}
        {image?.description && (
          <div className="mb-6">
            <p className="text-[#8B7355]/80 leading-relaxed">
              {image?.description}
            </p>
          </div>
        )}

        {/* Caption */}
        {image?.caption && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#8B7355] mb-2 uppercase tracking-wide">
              Caption
            </h4>
            <p className="text-[#8B7355]/80 italic">
              {image?.caption}
            </p>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="space-y-4 border-t border-[#8B7355]/20 pt-6">
          {/* Display Order */}
          {image?.displayOrder !== undefined && (
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-[#8B7355] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#8B7355]">Position</p>
                <p className="text-sm text-[#8B7355]/70">#{image?.displayOrder + 1}</p>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {image?.isFeatured && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-[#8B7355]">Featured Photo</p>
                <p className="text-sm text-[#8B7355]/70">Highlighted in album</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageMetadata;