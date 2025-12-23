import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { albumService } from '../../../services/albumService';

const RecentStories = () => {
  const [language, setLanguage] = useState('bg');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const fetchRecentAlbums = async () => {
      try {
        setLoading(true);
        const publishedAlbums = await albumService?.getPublishedAlbums();
        
        // Get last 4 albums sorted by created_at
        const recentAlbums = publishedAlbums
          ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
          ?.slice(0, 4);
        
        // Transform albums to stories format
        const transformedStories = recentAlbums?.map(album => ({
          id: album?.id,
          title: {
            bg: album?.title || 'Без заглавие',
            en: album?.title || 'Untitled'
          },
          description: {
            bg: album?.description || 'Красива фотосесия',
            en: album?.description || 'Beautiful photo session'
          },
          image: album?.coverImageUrl || album?.photos?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552',
          category: album?.sessionType || 'wedding',
          date: album?.sessionDate || album?.createdAt,
          location: album?.location || language === 'bg' ? 'България' : 'Bulgaria',
          albumId: album?.id
        }));
        
        setStories(transformedStories);
      } catch (error) {
        console.error('Error fetching recent albums:', error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlbums();
  }, [language]);

  const handleViewAlbum = (albumId) => {
    navigate(`/individual-photography-album/${albumId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gallery-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-hierarchy-secondary font-sophisticated">
              {language === 'bg' ? 'Зареждане...' : 'Loading...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (stories?.length === 0) {
    return (
      <section className="py-20 bg-gallery-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-hierarchy-secondary font-sophisticated">
              {language === 'bg' ? 'Няма налични истории' : 'No stories available'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gallery-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sophisticated-dark mb-6">
            {language === 'bg' ? 'Последни истории' : 'Recent Stories'}
          </h2>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg' ?'Всяка сесия е уникална история, пълна с емоции и спомени. Разгледайте някои от най-новите ми творения и се вдъхновете за вашата собствена фотосесия.' :'Every session is a unique story full of emotions and memories. Browse some of my latest creations and get inspired for your own photo session.'
            }
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {stories?.map((story, index) => (
            <motion.article
              key={story?.id}
              variants={itemVariants}
              className={`group ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-12'}`}
            >
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden elegant-hover">
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden cursor-pointer" onClick={() => handleViewAlbum(story?.albumId)}>
                  <Image
                    src={story?.image}
                    alt={story?.title?.[language]}
                    className="w-full h-full object-cover gallery-image"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-sophisticated text-sophisticated-dark">
                      {story?.category?.charAt(0)?.toUpperCase() + story?.category?.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <Icon name="MapPin" size={16} />
                      <span className="font-sophisticated">{story?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl md:text-2xl text-sophisticated-dark">
                      {story?.title?.[language]}
                    </h3>
                    <span className="text-sm text-hierarchy-secondary font-sophisticated">
                      {new Date(story?.date)?.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US')}
                    </span>
                  </div>
                  
                  <p className="text-hierarchy-secondary font-sophisticated leading-relaxed mb-6 whitespace-pre-line line-clamp-3">
                    {story?.description?.[language]}
                  </p>

                  <Button
                    variant="outline"
                    className="group-hover:bg-accent group-hover:border-accent group-hover:text-sophisticated-dark transition-all duration-300"
                    onClick={() => handleViewAlbum(story?.albumId)}
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    {language === 'bg' ? 'Виж повече' : 'View More'}
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            variant="default"
            className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark px-8 py-3 text-lg magnetic-hover pulse-cta"
            onClick={() => navigate('/gallery')}
          >
            <Icon name="Camera" size={20} className="mr-2" />
            {language === 'bg' ? 'Разгледай всички истории' : 'View All Stories'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentStories;