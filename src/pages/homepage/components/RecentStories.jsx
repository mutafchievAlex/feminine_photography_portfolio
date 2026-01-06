import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { albumService } from '../../../services/albumService';
import { useLanguage } from '../../../hooks/useLanguage';

const RecentStories = () => {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStory, setHoveredStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentAlbums = async () => {
      try {
        setLoading(true);
        const publishedAlbums = await albumService?.getPublishedAlbums();
        
        // Filter out Hero album (should never appear in recent stories)
        const nonHeroAlbums = publishedAlbums?.filter(album => album?.title !== 'Hero');
        
        // Get last 4 albums sorted by created_at
        const recentAlbums = nonHeroAlbums
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
          secondImage: album?.photos?.[1]?.imageUrl || album?.coverImageUrl || album?.photos?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552',
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
          viewport={{ amount: 0.3 }}
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

        {/* Stories Grid - 2x2 with hover description */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {stories?.slice(0, 4)?.map((story, index) => (
            <motion.article
              key={story?.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ amount: 0.3 }}
              className="group cursor-pointer"
              onClick={() => handleViewAlbum(story?.albumId)}
              onMouseEnter={() => setHoveredStory(story?.id)}
              onMouseLeave={() => setHoveredStory(null)}
            >
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={hoveredStory === story?.id ? story?.secondImage : story?.image}
                    alt={story?.title?.[language]}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-5 py-4 bg-white transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100">
                  <h3 className="font-heading text-lg text-sophisticated-dark mb-2">
                    {story?.title?.[language]}
                  </h3>
                  <p className="text-sm text-hierarchy-secondary font-sophisticated leading-relaxed line-clamp-3">
                    {story?.description?.[language]}
                  </p>
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
          viewport={{ amount: 0.3 }}
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