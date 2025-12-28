import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { realtimeService } from '../../../services/realtimeService';
import { AppImage } from '../../../components/AppImage';
import { galleryService } from '../../../services/galleryService';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GalleryGrid({ selectedCategory, searchQuery }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch initial images
  useEffect(() => {
    fetchImages();
  }, [selectedCategory, searchQuery]);

  // Setup real-time subscription for gallery updates
  useEffect(() => {
    const subscription = realtimeService?.subscribeToGalleryDeliveries((data) => {
      const { image, type } = data;
        const normalizedImage = image
        ? {
            id: image?.id,
            title: image?.title,
            description: image?.description,
            imageUrl: image?.image_url ?? image?.imageUrl,
            thumbnailUrl: image?.thumbnail_url ?? image?.thumbnailUrl,
            category: image?.category,
            albumId: image?.album_id ?? image?.albumId,
            altText: image?.alt_text ?? image?.altText,
            displayOrder: image?.display_order ?? image?.displayOrder,
            isFeatured: image?.is_featured ?? image?.isFeatured,
            createdAt: image?.created_at ?? image?.createdAt
          }
        : null;

      // Only add/update if it matches current category or category is 'all'
      if (selectedCategory === 'all' || normalizedImage?.category === selectedCategory) {
        if (type === 'published' || !type) {
          setImages(prev => {
             const exists = prev?.find(img => img?.id === normalizedImage?.id);
            if (exists) {
              return prev?.map(img => (img?.id === image?.id ? image : img));
            }
            return normalizedImage ? [normalizedImage, ...prev] : prev;
          });
        }
      }
    });

    return () => subscription?.unsubscribe();
  }, [selectedCategory, searchQuery]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Fixed: Use getAll() instead of getAllImages() or getImagesByCategory()
      const data = await galleryService?.getAll(selectedCategory === 'all' ? null : selectedCategory);
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    // Navigate to individual album page with category and image ID
    const albumId = image?.albumId || image?.album_id;
    navigate(`/individual-photography-album/${image?.albumId}`, {
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

  if (images?.length === 0) {
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