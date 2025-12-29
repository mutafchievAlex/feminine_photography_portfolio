import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AppImage } from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useInstagramFeed from '../../../hooks/useInstagramFeed';

// Instagram Profile Configuration
const INSTAGRAM_CONFIG = {
  username: 'tepavicharovaphotography',
  profileUrl: 'https://www.instagram.com/tepavicharovaphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  followersCount: '—'
};

const InstagramFeed = () => {
  const [language, setLanguage] = useState('bg');
  const sliderRef = useRef(null);
  const [directPosts, setDirectPosts] = useState([]);
  const [directLoading, setDirectLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
  const useDirectFetch = !!accessToken;

  const { posts: backendPosts, isLoading: backendLoading } = useInstagramFeed({
    username: INSTAGRAM_CONFIG.username,
    limit: 12,
    enabled: !useDirectFetch,
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (!useDirectFetch) return;

    const fetchInstagramDirect = async () => {
      setDirectLoading(true);
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`
        );
        const json = await response.json();
        setDirectPosts(json?.data || []);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setDirectPosts([]);
      } finally {
        setDirectLoading(false);
      }
    };

    fetchInstagramDirect();
  }, [accessToken, useDirectFetch]);

  const normalizedPosts = useMemo(() => {
    const source = useDirectFetch ? directPosts : backendPosts;
    const rawList = Array.isArray(source)
      ? source
      : Array.isArray(source?.data)
        ? source.data
        : Array.isArray(source?.items)
          ? source.items
          : Array.isArray(source?.edges)
            ? source.edges.map((edge) => edge?.node ?? edge)
            : [];

    return rawList.map((post, index) => {
      const image =
        post?.media_url ||
        post?.mediaUrl ||
        post?.thumbnail_url ||
        post?.image ||
        post?.url ||
        post?.source;

      const rawCaption =
        (typeof post?.caption === 'string' && post?.caption) ||
        post?.caption?.[language] ||
        post?.caption?.bg ||
        post?.caption?.en ||
        '';

      return {
        id: post?.id || `post-${index}`,
        image,
        caption: rawCaption,
        likes: post?.like_count ?? post?.likes,
        comments: post?.comments_count ?? post?.comments,
        timestamp: post?.timestamp || post?.taken_at || post?.createdAt,
        url: post?.permalink || post?.url || INSTAGRAM_CONFIG.profileUrl,
      };
    });
  }, [language, directPosts, backendPosts, useDirectFetch]);

  const isLoading = useDirectFetch ? directLoading : backendLoading;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (language === 'bg') {
      if (diffInHours < 1) return 'преди малко';
      if (diffInHours < 24) return `преди ${diffInHours}ч`;
      const days = Math.floor(diffInHours / 24);
      return `преди ${days}д`;
    } else {
      if (diffInHours < 1) return 'just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scrollByCards = (direction = 1) => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.getBoundingClientRect()?.width || 300;
    el.scrollBy({ left: direction * (cardWidth + 24) * 2, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.userSelect = 'auto';
    }
    // Изчистваме hasDragged след малко забавяне
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // По-плавно движение
    
    // Проверка дали потребителят реално е раздвижил мишката
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const openModal = (post, index) => {
    setSelectedPost(post);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < normalizedPosts.length) {
      setCurrentImageIndex(newIndex);
      setSelectedPost(normalizedPosts[newIndex]);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section className="py-20 bg-black">
      {/* Section Header with Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <a 
            href={INSTAGRAM_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-3 mb-4 hover:opacity-80 transition-opacity"
          >
            <Icon name="Instagram" size={32} className="text-accent" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sophisticated-dark hover:text-accent transition-colors">
              @{INSTAGRAM_CONFIG.username}
            </h2>
          </a>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg' 
              ? 'Следете ме в Instagram за ежедневни вдъхновения, зад кулисите моменти и най-новите ми творения.' 
              : 'Follow me on Instagram for daily inspiration, behind-the-scenes moments and my latest creations.'
            }
          </p>
        </motion.div>
      </div>

      {/* Instagram Carousel (single row with navigation) - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative mb-12"
      >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-hierarchy-secondary">{language === 'bg' ? 'Зареждане...' : 'Loading...'}</p>
            </div>
          ) : normalizedPosts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-hierarchy-secondary text-center">
                {language === 'bg' ? 'Няма налични Instagram постове за показване.' : 'No Instagram posts available to display.'}
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none px-4 sm:px-6 lg:px-8"
                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
              >
                {normalizedPosts?.map((post, index) => (
                  <motion.div
                    key={post?.id}
                    onClick={() => !hasDragged && openModal(post, index)}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="group relative flex-shrink-0 w-72 sm:w-80 lg:w-96 h-[420px] overflow-hidden bg-black cursor-pointer"
                  >
                    <AppImage
                      src={post?.image}
                      alt={post?.caption || 'Instagram post'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

                    <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 z-[3]">
                      <Icon name="Copy" size={20} className="text-white drop-shadow-lg" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2]">
                      <div className="flex items-center space-x-8 text-white">
                        {(post?.likes !== undefined || post?.like_count !== undefined) && (
                          <div className="flex items-center space-x-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span className="text-2xl font-bold">{post?.like_count || post?.likes || 0}</span>
                          </div>
                        )}
                        {(post?.comments !== undefined || post?.comments_count !== undefined) && (
                          <div className="flex items-center space-x-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                            </svg>
                            <span className="text-2xl font-bold">{post?.comments_count || post?.comments || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
      </motion.div>

      {/* Follow Button CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a 
            href={INSTAGRAM_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="default"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-lg magnetic-hover pulse-cta hover:shadow-lg transition-shadow"
            >
              <Icon name="Instagram" size={20} className="mr-2" />
              {language === 'bg' ? 'Последвай в Instagram' : 'Follow on Instagram'}
            </Button>
          </a>

          <p className="mt-4 text-hierarchy-secondary font-sophisticated">
            {language === 'bg' 
              ? `Присъединете се към ${INSTAGRAM_CONFIG.followersCount} последователи` 
              : `Join ${INSTAGRAM_CONFIG.followersCount} followers`
            }
          </p>
        </motion.div>
      </div>

      {/* Instagram Post Modal */}
      {selectedPost && (
        <InstagramModal
          selectedPost={selectedPost}
          currentImageIndex={currentImageIndex}
          normalizedPosts={normalizedPosts}
          closeModal={closeModal}
          navigateImage={navigateImage}
          language={language}
        />
      )}
    </section>
  );
};

export default InstagramFeed;

// Modal Component (moved outside main component for better organization)
const InstagramModal = ({ selectedPost, currentImageIndex, normalizedPosts, closeModal, navigateImage, language }) => {
  if (!selectedPost) return null;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (language === 'bg') {
      if (diffInHours < 1) return 'преди малко';
      if (diffInHours < 24) return `преди ${diffInHours}ч`;
      const days = Math.floor(diffInHours / 24);
      return `преди ${days}д`;
    } else {
      if (diffInHours < 1) return 'just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={closeModal}
    >
      <div 
        className="relative max-w-6xl w-full h-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            >
              <Icon name="X" size={24} className="text-white" />
            </button>

            {/* Navigation Arrows */}
            {currentImageIndex > 0 && (
              <button
                onClick={() => navigateImage(-1)}
                className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
              >
                <Icon name="ChevronLeft" size={28} className="text-white" />
              </button>
            )}

            {currentImageIndex < normalizedPosts.length - 1 && (
              <button
                onClick={() => navigateImage(1)}
                className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
              >
                <Icon name="ChevronRight" size={28} className="text-white" />
              </button>
            )}

            {/* Main Content - Instagram-style layout */}
            <div className="bg-black w-full h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center bg-black p-4 md:p-8">
                <AppImage
                  src={selectedPost?.image}
                  alt={selectedPost?.caption || 'Instagram post'}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Details Section - Instagram-style sidebar */}
              <div className="w-full md:w-[400px] bg-white flex flex-col max-h-[50vh] md:max-h-full">
                {/* Header */}
                <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Icon name="Instagram" size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-sophisticated-dark">
                      {INSTAGRAM_CONFIG.username}
                    </p>
                  </div>
                  <a
                    href={selectedPost?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {language === 'bg' ? 'Виж в Instagram' : 'View on Instagram'}
                  </a>
                </div>

                {/* Caption */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-sophisticated-dark mr-2">
                          {INSTAGRAM_CONFIG.username}
                        </span>
                        <span className="text-gray-700 whitespace-pre-wrap">
                          {selectedPost?.caption || (language === 'bg' ? 'Без описание' : 'No caption')}
                        </span>
                      </p>
                      {selectedPost?.timestamp && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimeAgo(selectedPost?.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="border-t border-gray-200 p-4 space-y-2">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:opacity-70 transition-opacity">
                      <Icon name="Heart" size={24} className="text-sophisticated-dark" />
                      {selectedPost?.likes !== undefined && (
                        <span className="text-sm font-semibold">{selectedPost?.likes}</span>
                      )}
                    </button>
                    <button className="flex items-center space-x-1 hover:opacity-70 transition-opacity">
                      <Icon name="MessageCircle" size={24} className="text-sophisticated-dark" />
                      {selectedPost?.comments !== undefined && (
                        <span className="text-sm font-semibold">{selectedPost?.comments}</span>
                      )}
                    </button>
                    <a
                      href={selectedPost?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto hover:opacity-70 transition-opacity"
                    >
                      <Icon name="ExternalLink" size={22} className="text-sophisticated-dark" />
                    </a>
                  </div>
                  {selectedPost?.timestamp && (
                    <p className="text-xs text-gray-500 uppercase">
                      {new Date(selectedPost?.timestamp).toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default InstagramFeed;