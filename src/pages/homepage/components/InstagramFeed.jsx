import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AppImage } from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useInstagramFeed from '../../../hooks/useInstagramFeed';
import { useLanguage } from '../../../hooks/useLanguage';

// Instagram Profile Configuration
const INSTAGRAM_CONFIG = {
  username: 'tepavicharovaphotography',
  profileUrl: 'https://www.instagram.com/tepavicharovaphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  followersCount: '—'
};

const InstagramFeed = () => {
  const { language } = useLanguage();
  const sliderRef = useRef(null);
  const [directPosts, setDirectPosts] = useState([]);
  const [directLoading, setDirectLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [postMedias, setPostMedias] = useState([]);
  const [loadingPostMedias, setLoadingPostMedias] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

  useEffect(() => {
    if (!useDirectFetch) return;

    const fetchInstagramProfile = async () => {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me?fields=profile_picture_url&access_token=${accessToken}`
        );
        const json = await response.json();
        if (json?.profile_picture_url) {
          setProfileImage(json.profile_picture_url);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    const fetchInstagramDirect = async () => {
      setDirectLoading(true);
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}&limit=12`
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

    fetchInstagramProfile();
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
      const isVideo = post?.media_type === 'VIDEO';
      const image = isVideo
        ? post?.thumbnail_url || post?.media_url
        : post?.media_url ||
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
        videoUrl: isVideo ? post?.media_url : null,
        thumbnail: post?.thumbnail_url || image,
        caption: rawCaption,
        likes: post?.like_count ?? post?.likes,
        comments: post?.comments_count ?? post?.comments,
        timestamp: post?.timestamp || post?.taken_at || post?.createdAt,
        url: post?.permalink || post?.url || INSTAGRAM_CONFIG.profileUrl,
        mediaType: post?.media_type || 'IMAGE',
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

  const openModal = async (post, index) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
    setPostMedias([{ 
      image: post.image, 
      mediaType: post.mediaType,
      videoUrl: post.videoUrl || (post.mediaType === 'VIDEO' ? post.image : null),
      thumbnail: post.thumbnail || post.image 
    }]);
    document.body.style.overflow = 'hidden';

    // Fetch all media from the post if it's a carousel
    if (useDirectFetch && accessToken) {
      setLoadingPostMedias(true);
      try {
        // First get the post details to check media type
        const postResponse = await fetch(
          `https://graph.instagram.com/${post.id}?fields=id,media_type,media_url,thumbnail_url&access_token=${accessToken}`
        );
        const postData = await postResponse.json();
        
        // If it's a carousel album, fetch all children
        if (postData.media_type === 'CAROUSEL_ALBUM') {
          const response = await fetch(
            `https://graph.instagram.com/${post.id}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${accessToken}`
          );
          const json = await response.json();
          if (json?.data && json.data.length > 0) {
            const medias = json.data.map((media) => ({
              image: media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url,
              videoUrl: media.media_type === 'VIDEO' ? media.media_url : null,
              thumbnail: media.thumbnail_url || media.media_url,
              mediaType: media.media_type,
              id: media.id,
            }));
            setPostMedias(medias);
          }
        }
        // Otherwise keep the single media we already have
      } catch (error) {
        console.error('Error fetching post media:', error);
      } finally {
        setLoadingPostMedias(false);
      }
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setPostMedias([]);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < postMedias.length) {
      setCurrentImageIndex(newIndex);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Ensure we start in the middle copy for seamless looping
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || normalizedPosts.length === 0) return;

    const cardWidth = slider.firstChild?.getBoundingClientRect()?.width || 300;
    const styles = getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap) || 12;
    const scrollAmount = cardWidth + gap;
    const singleRowWidth = scrollAmount * normalizedPosts.length;

    // Start centered on the middle copy
    if (slider.scrollLeft < singleRowWidth || slider.scrollLeft > singleRowWidth * 2) {
      slider.scrollLeft = singleRowWidth;
    }
  }, [normalizedPosts.length]);

  // Auto-scroll effect with seamless loop - every 3 seconds
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || normalizedPosts.length === 0) return;

    const interval = setInterval(() => {
      const cardWidth = slider.firstChild?.getBoundingClientRect()?.width || 300;
      const styles = getComputedStyle(slider);
      const gap = parseFloat(styles.columnGap) || 12; // read actual flex gap
      const scrollAmount = cardWidth + gap;
      const singleRowWidth = scrollAmount * normalizedPosts.length;

      // Keep scrollLeft within the middle copy range for infinite loop
      if (slider.scrollLeft >= singleRowWidth * 2) {
        slider.scrollLeft -= singleRowWidth;
      } else if (slider.scrollLeft <= 0) {
        slider.scrollLeft += singleRowWidth;
      }

      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(interval);
  }, [normalizedPosts.length]);

  return (
    <section className="py-20 bg-black">
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
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none px-4 sm:px-6 lg:px-8"
                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
              >
                {(normalizedPosts?.length > 0 ? [...normalizedPosts, ...normalizedPosts, ...normalizedPosts] : [])?.map((post, index) => {
                  const baseIndex = index % normalizedPosts.length;
                  const basePost = normalizedPosts[baseIndex];
                  return (
                  <motion.div
                    key={`${post?.id || basePost?.id}-${index}`}
                    onClick={() => !hasDragged && openModal(basePost || post, baseIndex)}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="group relative flex-shrink-0 w-72 sm:w-80 lg:w-96 h-[420px] overflow-hidden bg-black cursor-pointer"
                  >
                    <AppImage
                      src={basePost?.image || post?.image}
                      alt={basePost?.caption || post?.caption || 'Instagram post'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

                    {(basePost?.caption || post?.caption) && (
                      <div className="absolute top-0 left-0 right-0 pt-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]">
                        <p className="text-white text-xs text-center line-clamp-2">
                          {basePost?.caption || post?.caption}
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]">
                      <div className="flex items-center space-x-4 text-white">
                        {post?.mediaType === 'VIDEO' ? (
                          <Icon name="Play" size={20} className="text-white fill-white" />
                        ) : (
                          <>
                            {post?.likes !== undefined && post?.likes !== null && (
                              <div className="flex items-center space-x-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                <span className="text-xs font-medium">{post?.likes || 0}</span>
                              </div>
                            )}
                            {post?.comments !== undefined && post?.comments !== null && (
                              <div className="flex items-center space-x-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                                </svg>
                                <span className="text-xs font-medium">{post?.comments || 0}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </div>
          )}
      </motion.div>

      {/* Instagram Post Modal */}
      {selectedPost && (
        <InstagramModal
          selectedPost={selectedPost}
          currentImageIndex={currentImageIndex}
          postMedias={postMedias}
          closeModal={closeModal}
          navigateImage={navigateImage}
          language={language}
          profileImage={profileImage}
        />
      )}
    </section>
  );
};

export default InstagramFeed;

// Modal Component (moved outside main component for better organization)
const InstagramModal = ({ selectedPost, currentImageIndex, postMedias, closeModal, navigateImage, language, profileImage }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const commentsRef = useRef(null);
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

  const fetchComments = async () => {
    if (loadingComments || comments.length > 0) return;
    
    setLoadingComments(true);
    try {
      const url = `https://graph.instagram.com/${selectedPost?.id}/comments?fields=text,from.fields(username),timestamp&limit=20&access_token=${accessToken}`;
      console.log('Fetching comments from:', url);
      
      const response = await fetch(url);
      const json = await response.json();
      
      console.log('Comments response:', json);
      
      if (json?.data && json.data.length > 0) {
        // Transform the data to match our expected format
        const transformedComments = json.data.map(comment => ({
          text: comment.text,
          username: comment.from?.username || 'Unknown',
          timestamp: comment.timestamp
        }));
        setComments(transformedComments);
        console.log('Transformed comments:', transformedComments);
      } else if (json?.data && json.data.length === 0) {
        // No comments found - show empty state
        console.log('No comments found for this post');
        setComments([]);
      } else if (json?.error) {
        console.error('Instagram API Error:', json.error);
        // Show fallback message with error details
        setComments([]);
      }
      
      // Scroll to comments with smooth animation
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleShowComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };
  
  if (!selectedPost || postMedias.length === 0) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={closeModal}
    >
      <div 
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
            {/* Main Content - Instagram-style layout */}
            <div className="relative w-full flex flex-col md:flex-row items-stretch bg-transparent">
              {/* Close Button - in top right corner of the post */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors"
              >
                <Icon name="X" size={16} className="text-white" />
              </button>
              {/* Image Section with Carousel */}
              <div className="relative flex items-center justify-center">
                {/* Navigation Arrows - Inside Image Section */}
                {postMedias.length > 1 && currentImageIndex > 0 && (
                  <button
                    onClick={() => navigateImage(-1)}
                    className="absolute left-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
                  >
                    <Icon name="ChevronLeft" size={20} className="text-white" />
                  </button>
                )}

                {postMedias.length > 1 && currentImageIndex < postMedias.length - 1 && (
                  <button
                    onClick={() => navigateImage(1)}
                    className="absolute right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
                  >
                    <Icon name="ChevronRight" size={20} className="text-white" />
                  </button>
                )}

                {/* Main Media (Image or Video) */}
                {postMedias[currentImageIndex]?.mediaType === 'VIDEO' ? (
                  <video
                    key={postMedias[currentImageIndex]?.videoUrl}
                    src={postMedias[currentImageIndex]?.videoUrl || postMedias[currentImageIndex]?.image}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="h-[76vh] w-auto object-contain"
                    poster={postMedias[currentImageIndex]?.thumbnail}
                    onError={(e) => {
                      console.error('Video load error:', e);
                      console.log('Video URL:', postMedias[currentImageIndex]?.videoUrl);
                      console.log('Image URL:', postMedias[currentImageIndex]?.image);
                    }}
                    onLoadedData={() => {
                      console.log('Video loaded successfully');
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <AppImage
                    src={postMedias[currentImageIndex]?.image}
                    alt={selectedPost?.caption || 'Instagram post'}
                    className="h-[76vh] w-auto object-contain"
                  />
                )}

                {/* Media Dots Navigation */}
                {postMedias.length > 1 && (
                  <div className="flex items-center justify-center gap-1 absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                    {postMedias.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => navigateImage(index - currentImageIndex)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-4'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}


              </div>

              {/* Details Section - Instagram-style sidebar */}
              <div className="w-full md:w-[280px] bg-black flex flex-col max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center space-x-3 p-4 border-b border-gray-800">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Instagram" size={20} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <a
                      href={INSTAGRAM_CONFIG.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sm text-white hover:opacity-70 transition-opacity"
                    >
                      {INSTAGRAM_CONFIG.username}
                    </a>
                  </div>
                </div>

                {/* Caption */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">
                      {selectedPost?.caption || (language === 'bg' ? 'Без описание' : 'No caption')}
                    </p>
                    {selectedPost?.timestamp && (
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTimeAgo(selectedPost?.timestamp)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-800"></div>

                {/* Share and View on Instagram buttons */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Instagram Post',
                            url: selectedPost?.url
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 text-white hover:opacity-70 transition-opacity"
                    >
                      <Icon name="Share2" size={18} />
                      <span className="text-sm font-medium">{language === 'bg' ? 'Сподели' : 'Share'}</span>
                    </button>
                    <a
                      href={selectedPost?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white hover:opacity-70 transition-opacity"
                    >
                      <Icon name="Instagram" size={18} />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-800" ref={commentsRef}>
                  <button
                    onClick={handleShowComments}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="MessageCircle" size={18} className="text-white" />
                      <span className="text-sm font-medium text-white">
                        {language === 'bg' ? 'Коментари' : 'Comments'}
                        {selectedPost?.comments !== undefined && (
                          <span className="text-gray-400 ml-1">({selectedPost?.comments})</span>
                        )}
                      </span>
                    </div>
                    <Icon 
                      name={showComments ? "ChevronUp" : "ChevronDown"} 
                      size={18} 
                      className="text-gray-400" 
                    />
                  </button>

                  {showComments && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-800"
                    >
                      <div className="px-4 py-4 max-h-48 overflow-y-auto space-y-3">
                        {loadingComments ? (
                          <p className="text-sm text-gray-400 text-center py-4">
                            {language === 'bg' ? 'Зареждане коментари...' : 'Loading comments...'}
                          </p>
                        ) : comments.length > 0 ? (
                          comments.map((comment, idx) => (
                            <div key={idx} className="space-y-1 pb-3 border-b border-gray-800 last:border-b-0">
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-white">
                                  {comment.username}
                                </span>
                                {comment.timestamp && (
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(comment.timestamp)}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-300">
                                {comment.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-400 mb-2">
                              {language === 'bg' 
                                ? '📝 Няма коментари на този пост' 
                                : '📝 No comments on this post'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {language === 'bg' 
                                ? 'Коментарите ще се покажат тук, когато хората напишат коментари' 
                                : 'Comments will appear here once people comment'}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};