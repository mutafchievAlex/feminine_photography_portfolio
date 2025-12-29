import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { realtimeService } from '../../../services/realtimeService';
import { AppImage } from '../../../components/AppImage';
import { galleryService } from '../../../services/galleryService';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GalleryGrid({
  selectedCategory = 'all',
  searchQuery,
  images: propImages,
  loading: propLoading,
  onImageClick
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [images, setImages] = useState(propImages || []);
  const [loading, setLoading] = useState(propLoading ?? true);

  // Зарежда снимки, ако не са подадени като проп
  useEffect(() => {
    if (propImages) {
      setImages(propImages);
      setLoading(!!propLoading);
      console.log('GalleryGrid received propImages:', propImages?.length, propImages);
      return;
    }
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await galleryService.getAll(
          selectedCategory === 'all' ? null : selectedCategory
        );
        console.log('GalleryGrid fetched images:', data);
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [propImages, propLoading, selectedCategory, searchQuery]);

  // Реално‑времеви абонамент за нови снимки/публикации
  useEffect(() => {
    const subscription = realtimeService.subscribeToGalleryDeliveries((data) => {
      const { image, type } = data;
      if (!image) return;
      // нормализиране на snake_case полетата към camelCase
      const normalizedImage = {
        id: image.id,
        title: image.title,
        description: image.description,
        imageUrl: image.image_url ?? image.imageUrl,
        thumbnailUrl: image.thumbnail_url ?? image.thumbnailUrl,
        category: image.category,
        albumId: image.album_id ?? image.albumId,
        altText: image.alt_text ?? image.altText,
        displayOrder: image.display_order ?? image.displayOrder,
        isFeatured: image.is_featured ?? image.isFeatured,
        createdAt: image.created_at ?? image.createdAt
      };
      // добавя или обновява само ако попада в текущата категория
      if (selectedCategory !== 'all' && normalizedImage.category !== selectedCategory) {
        return;
      }
      if (type === 'published' || !type) {
        setImages((prev) => {
          const idx = prev.findIndex((img) => img.id === normalizedImage.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = normalizedImage;
            return updated;
          }
          return [normalizedImage, ...prev];
        });
      }
    });
    return () => subscription?.unsubscribe();
  }, [selectedCategory, propImages]);

  const handleClick = (image) => {
    if (typeof onImageClick === 'function') {
      onImageClick(image);
    } else {
      const albumId = image?.albumId;
      if (!albumId) {
        alert(t('album_not_available', 'Album not available for this image.'));
        return;
      }
      navigate(`/individual-photography-album/${albumId}`, {
        state: { imageId: image.id }
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-hierarchy-secondary text-lg">
          {t('no_images', 'Няма налични снимки в тази категория')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, idx) => {
        console.log(`Image ${idx}:`, {
          id: image.id,
          title: image.title,
          imageUrl: image.imageUrl,
          thumbnailUrl: image.thumbnailUrl
        });
        return (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer"
            onClick={() => handleClick(image)}
          >
            <AppImage
              src={image.thumbnailUrl || image.imageUrl}
              alt={image.altText}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-heading font-semibold text-lg mb-1">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
