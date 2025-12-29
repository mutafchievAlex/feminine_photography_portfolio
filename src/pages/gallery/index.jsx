import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import GalleryFilter from './components/GalleryFilter';
import GalleryGrid from './components/GalleryGrid';
import ImageLightbox from './components/ImageLightbox';

import CategoryIntro from './components/CategoryIntro';
import { galleryService } from '../../services/galleryService';
import { albumService } from '../../services/albumService';


import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [publishedAlbums, setPublishedAlbums] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch gallery images (for category filtering)
      const galleryData = await galleryService?.getAll();
      console.log('Gallery data loaded:', galleryData);
      setImages(galleryData || []);
      
      // Fetch published albums (excluding Hero)
      const albumsData = await albumService?.getPublishedAlbums();
      const filteredAlbums = albumsData?.filter(album => album?.title !== 'Hero') || [];
      console.log('Albums data loaded:', filteredAlbums);
      setPublishedAlbums(filteredAlbums);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      setImages([]);
      setPublishedAlbums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'all' ? 'all' : category);
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images?.filter(img => img?.category === selectedCategory);

  const handleImageClick = (image) => {
     const albumId = image?.albumId || image?.album_id;
    navigate(`/individual-photography-album/${albumId}`, {
      state: { imageId: image?.id }
    });
  };

  const handleAlbumClick = useCallback((album) => {
    navigate(`/individual-photography-album/${album?.id}`);
  }, [navigate]);

  const handleLanguageToggle = () => {
    // Language toggle logic would be implemented here
  };

  const handleRemoveFromBoard = (imageId) => {
    // Board removal logic would be implemented here
  };

  const handleClearBoard = () => {
    // Board clearing logic would be implemented here
  };

  const handleRequestConsultation = () => {
    // Consultation request logic would be implemented here
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Elena Rose Photography</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-sophisticated-dark mb-4">
                  Gallery
                </h1>
                <p className="text-lg text-hierarchy-secondary max-w-2xl mx-auto">
                  Browse our projects
                </p>
              </div>

              {/* Published Albums Section */}
              {publishedAlbums?.length > 0 && (
                <section className="py-12 mb-12">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif text-[#8B7355] mb-4">
                      Featured Albums
                    </h2>
                    <p className="text-[#8B7355]/70 max-w-2xl mx-auto">
                      Explore our curated collections of memorable moments
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publishedAlbums?.map((album) => (
                      <div
                        key={album?.id}
                        onClick={() => handleAlbumClick(album)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                          <img
                            src={album?.coverImageUrl || album?.photos?.[0]?.imageUrl}
                            alt={album?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <h3 className="text-xl font-medium text-[#8B7355] mb-2">
                          {album?.title}
                        </h3>
                        {album?.description && (
                          <p className="text-[#8B7355]/70 text-sm mb-2 line-clamp-2">
                            {album?.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-[#8B7355]/60">
                          <span>{album?.photos?.length} photos</span>
                          {album?.sessionDate && (
                            <span>
                              {new Date(album?.sessionDate)?.toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <CategoryIntro category={selectedCategory} language="en" />

              <GalleryFilter 
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                activeCategory={selectedCategory}
                activeStyle={null}
                onStyleChange={() => {}}
                activeSeason={null}
                onSeasonChange={() => {}}
                language="en"
              />

              {error && (
                <div className="mt-8 mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-center">Грешка при зареждане: {error}</p>
                </div>
              )}

              <div className="mt-12">
                <GalleryGrid 
                  images={filteredImages}
                  onImageClick={handleImageClick}
                  loading={loading}
                />
              </div>

              {selectedImage && (
                <ImageLightbox
                  image={selectedImage}
                  images={images}
                  isOpen={true}
                  onClose={() => setSelectedImage(null)}
                  inspirationBoard={[]}
                  onToggleInspiration={() => {}}
                  language="en"
                  onNavigate={() => {}}
                  currentIndex={images?.findIndex(img => img === selectedImage)}
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}