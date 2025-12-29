import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch hero images from the database
 * Images are fetched from gallery_images table with is_featured=true
 * Or from a designated 'hero' album if it exists
 * Returns images sorted by display_order
 */
export const useHeroGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get images from a 'hero' album
      const { data: heroAlbum } = await supabase
        ?.from('albums')
        ?.select(`
          id,
          album_photos(
            id,
            display_order,
            gallery_images(
              id,
              image_url,
              thumbnail_url,
              title,
              alt_text,
              description
            )
          )
        `)
        ?.eq('title', 'Hero')
        ?.eq('is_published', true)
        ?.single();

      if (heroAlbum?.album_photos && heroAlbum.album_photos.length > 0) {
        // Use images from hero album
        const heroImages = heroAlbum.album_photos
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map((photo, index) => ({
            id: photo?.id,
            src: photo?.gallery_images?.image_url,
            alt: photo?.gallery_images?.alt_text || photo?.gallery_images?.title || 'Hero image',
            title: photo?.gallery_images?.title,
            description: photo?.gallery_images?.description,
            category: 'hero',
            displayOrder: photo?.display_order || index
          }))
          .filter(img => img.src); // Only include images with valid URLs

        setImages(heroImages);
      } else {
        // Fallback: Get featured images from gallery_images table
        const { data: featuredImages } = await supabase
          ?.from('gallery_images')
          ?.select('*')
          ?.eq('is_featured', true)
          ?.order('display_order', { ascending: true })
          ?.limit(4);

        if (featuredImages && featuredImages.length > 0) {
          const images = featuredImages.map(img => ({
            id: img?.id,
            src: img?.image_url,
            alt: img?.alt_text || img?.title || 'Featured image',
            title: img?.title,
            description: img?.description,
            category: img?.category || 'featured',
            displayOrder: img?.display_order || 0
          }));
          setImages(images);
        } else {
          // If no featured images and no hero album, return empty array
          // (component will need to handle this gracefully)
          setImages([]);
        }
      }
    } catch (err) {
      console.error('Error fetching hero images:', err);
      setError(err?.message);
      setImages([]); // Return empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refetchImages = () => {
    fetchHeroImages();
  };

  return { images, loading, error, refetch: refetchImages };
};
