import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { albumService } from '../../services/albumService';
import { useLanguage } from '../../hooks/useLanguage';
import AlbumHero from './components/AlbumHero';
import AlbumNavigation from './components/AlbumNavigation';
import ImageViewer from './components/ImageViewer';
import ImageMetadata from './components/ImageMetadata';

const IndividualPhotographyAlbum = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);

  // Get initial image from navigation state or default to first image
  const initialImageId = location?.state?.imageId;

  // Define loadAlbumData BEFORE it's used in useEffect
  const loadAlbumData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await albumService?.getById(albumId);
      
      if (!data) {
        throw new Error('Album not found');
      }
      
      setAlbum(data);
      
      // Ensure photos is always an array
      const photos = Array.isArray(data?.photos) ? data?.photos : [];
      setImages(photos);
      
      // Set initial image if provided
      if (initialImageId && photos?.length > 0) {
        const imageIndex = photos?.findIndex(img => img?.imageId === initialImageId);
        if (imageIndex >= 0) {
          setCurrentIndex(imageIndex);
        }
      }
    } catch (error) {
      console.error('Error loading album:', error);
      setImages([]);
      setAlbum(null);
    } finally {
      setLoading(false);
    }
  }, [albumId, initialImageId]);

  useEffect(() => {
    loadAlbumData();
  }, [loadAlbumData]);

  useEffect(() => {
    // Show navigation after hero moment (3 seconds) or on scroll
    const timer = setTimeout(() => {
      setShowNavigation(true);
    }, 3000);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNavigation(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navigation handlers - simplified with proper state management
  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => {
      const length = images?.length;
      return length > 0 ? (prev - 1 + length) % length : 0;
    });
  }, [images?.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      const length = images?.length;
      return length > 0 ? (prev + 1) % length : 0;
    });
  }, [images?.length]);

  const handleToggleSlideshow = useCallback(() => {
    setIsSlideshow(prev => !prev);
  }, []);

  const handleToggleMetadata = useCallback(() => {
    setShowMetadata(prev => !prev);
  }, []);

  const handleBackToGallery = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  const handleThumbnailClick = useCallback((index) => {
    if (typeof index === 'number' && index >= 0 && index < images?.length) {
      setCurrentIndex(index);
    }
  }, [images?.length]);

  useEffect(() => {
    // Keyboard shortcuts - use direct state updates instead of callbacks
    const handleKeyPress = (e) => {
      if (!e) return;
      
      const length = images?.length;
      if (length === 0) return;
      
      switch(e?.key) {
        case 'ArrowLeft':
          setCurrentIndex(prev => (prev - 1 + length) % length);
          break;
        case 'ArrowRight':
          setCurrentIndex(prev => (prev + 1) % length);
          break;
        case 'Escape': navigate('/gallery');
          break;
        case 'i': case'I':
          setShowMetadata(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images?.length, navigate]);

  useEffect(() => {
    // Slideshow functionality with proper cleanup
    if (!isSlideshow || images?.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const length = images?.length;
        return length > 0 ? (prev + 1) % length : 0;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSlideshow, images?.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] flex items-center justify-center">
        <div className="text-[#8B7355] text-lg">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  if (!album || !images || images?.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center justify-center">
        <p className="text-[#8B7355] text-lg mb-4">{t('noImages', 'No images found in this album')}</p>
        <button
          onClick={handleBackToGallery}
          className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5B47] transition-colors"
        >
          {t('backToGallery', 'Back to Gallery')}
        </button>
      </div>
    );
  }

  const currentImage = images?.[currentIndex];

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      {/* Hero Section - Horizontal Image Carousel */}
      <AlbumHero 
        images={images}
        currentIndex={currentIndex}
        onImageChange={setCurrentIndex}
        album={album}
        showNavigation={showNavigation}
      />
      {/* Floating Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showNavigation ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleBackToGallery}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Back to Gallery"
      >
        <X className="w-6 h-6 text-[#8B7355]" />
      </motion.button>
      {/* Image Viewer Controls */}
      <AnimatePresence>
        {showNavigation && (
          <ImageViewer
            currentImage={currentImage}
            currentIndex={currentIndex}
            totalImages={images?.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isSlideshow={isSlideshow}
            onToggleSlideshow={handleToggleSlideshow}
            onToggleMetadata={handleToggleMetadata}
          />
        )}
      </AnimatePresence>
      {/* Image Metadata Overlay */}
      <AnimatePresence>
        {showMetadata && showNavigation && (
          <ImageMetadata
            image={currentImage}
            onClose={handleToggleMetadata}
          />
        )}
      </AnimatePresence>
      {/* Navigation Menu with Thumbnails */}
      <AnimatePresence>
        {showNavigation && (
          <AlbumNavigation
            images={images}
            currentIndex={currentIndex}
            album={album}
            onThumbnailClick={handleThumbnailClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndividualPhotographyAlbum;