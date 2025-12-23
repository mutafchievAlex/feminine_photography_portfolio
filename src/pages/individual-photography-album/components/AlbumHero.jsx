import React from 'react';
import { motion } from 'framer-motion';

const AlbumHero = ({ image, album, showNavigation }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full Screen Image */}
      <div className="absolute inset-0">
        <img
          src={image?.imageUrl || image?.thumbnailUrl}
          alt={image?.altText || image?.title || 'Album photo'}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>
      {/* Album Title Overlay - Only show after navigation appears */}
      {showNavigation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-20 left-0 right-0 text-center text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-4">{album?.title}</h1>
          {album?.description && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {album?.description}
            </p>
          )}
          {album?.sessionDate && (
            <p className="text-sm md:text-base text-white/70 mt-2">
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