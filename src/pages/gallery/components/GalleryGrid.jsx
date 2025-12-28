import React from 'react';
import { AppImage } from '../../../components/AppImage';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GalleryGrid({ images, loading, onImageClick }) {
  const navigate = useNavigate();
  const handleImageClick = (image) => {
    if (onImageClick) {
      onImageClick(image);
      return;
    }
    const albumId = image?.albumId || image?.album_id;
    if (!albumId) {
      window.alert('Album not available for this image.');
      return;
    }
    navigate(`/individual-photography-album/${albumId}`, {
      state: { imageId: image?.id }
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6]?.map((i) => (
          <div
            key={i}
            className="relative aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!images || images?.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-hierarchy-secondary text-lg">
          Няма налични снимки в тази категория
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images?.map((image) => (
        <motion.div
          key={image?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer"
          onClick={() => handleImageClick(image)}
        >
          <AppImage
            src={image?.thumbnailUrl || image?.imageUrl}
            alt={image?.altText}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-heading font-semibold text-lg mb-1">
                {image?.title}
              </h3>
              {image?.description && (
                <p className="text-white/80 text-sm line-clamp-2">
                  {image?.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}