import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useInstagramFeed from '../../../hooks/useInstagramFeed';

const InstagramFeed = () => {
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const { posts: instagramPostsData, isLoading, error, refetch } = useInstagramFeed({
    limit: 6,
    username: 'elenarose_photography',
  });

  const localizeContent = (value) => {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      return value?.[language] ?? value?.caption ?? value?.text ?? Object.values(value)?.[0] ?? '';
    }

    return '';
  };

  const instagramPosts = useMemo(() => {
    const rawPosts = Array.isArray(instagramPostsData)
      ? instagramPostsData
      : instagramPostsData?.items ?? instagramPostsData?.data ?? instagramPostsData?.posts ?? [];

    return (
      rawPosts
        ?.map((post, index) => ({
          id: post?.id ?? post?.postId ?? post?.mediaId ?? `post-${index}`,
          image: post?.image ?? post?.imageUrl ?? post?.mediaUrl ?? post?.thumbnailUrl,
          caption: localizeContent(post?.caption) || localizeContent(post?.description),
          likes: post?.likes ?? post?.likeCount ?? post?.engagement?.likes ?? 0,
          comments: post?.comments ?? post?.commentCount ?? post?.engagement?.comments ?? 0,
          timestamp: post?.timestamp ?? post?.createdAt ?? post?.publishedAt,
          permalink: post?.permalink ?? post?.url ?? post?.link ?? null,
        }))
        ?.filter((post) => post?.id)
    ) ?? [];
  }, [instagramPostsData, language]);

  const skeletonPosts = useMemo(() => Array.from({ length: 6 }), []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = timestamp ? new Date(timestamp) : null;
    const diffInHours = postTime ? Math.floor((now - postTime) / (1000 * 60 * 60)) : 0;

    if (!postTime || Number.isNaN(diffInHours)) {
      return language === 'bg' ? 'скоро' : 'recently';
    }

    if (language === 'bg') {
      if (diffInHours < 1) return 'преди малко';
      if (diffInHours < 24) return `преди ${diffInHours}ч`;
      const days = Math.floor(diffInHours / 24);
      return `преди ${days}д`;
    }

    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-20 bg-surface-elevation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Icon name="Instagram" size={32} className="text-accent" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sophisticated-dark">
              @elenarose_photography
            </h2>
          </div>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg'
              ? 'Следете ме в Instagram за ежедневни вдъхновения, зад кулисите моменти и най-новите ми творения.'
              : 'Follow me on Instagram for daily inspiration, behind-the-scenes moments and my latest creations.'}
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading && (
            <>
              {skeletonPosts.map((_, index) => (
                <motion.article
                  key={`instagram-skeleton-${index}`}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl shadow-soft overflow-hidden"
                >
                  <div className="relative aspect-square bg-surface-elevation animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-surface-elevation animate-pulse rounded-full" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-surface-elevation animate-pulse rounded" />
                          <div className="h-2 w-16 bg-surface-elevation animate-pulse rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-12 bg-surface-elevation animate-pulse rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-surface-elevation animate-pulse rounded" />
                      <div className="h-3 w-5/6 bg-surface-elevation animate-pulse rounded" />
                      <div className="h-3 w-2/3 bg-surface-elevation animate-pulse rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-20 bg-surface-elevation animate-pulse rounded" />
                      <div className="h-3 w-10 bg-surface-elevation animate-pulse rounded" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}

          {!isLoading && error && (
            <motion.article variants={itemVariants} className="md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
                <h3 className="font-heading text-2xl text-sophisticated-dark">
                  {language === 'bg' ? 'Instagram не отговори навреме' : 'Instagram feed is unavailable'}
                </h3>
                <p className="text-hierarchy-secondary font-sophisticated">
                  {language === 'bg'
                    ? 'Опитайте да обновите страницата или презаредете емисията след малко.'
                    : 'Please refresh the page or try reloading the feed in a moment.'}
                </p>
                <Button variant="outline" onClick={refetch} className="elegant-hover">
                  <Icon name="RefreshCcw" size={16} className="mr-2" />
                  {language === 'bg' ? 'Презареди емисията' : 'Reload feed'}
                </Button>
              </div>
            </motion.article>
          )}

          {!isLoading && !error && instagramPosts.length === 0 && (
            <motion.article variants={itemVariants} className="md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                <Icon name="CameraOff" size={36} className="mx-auto text-accent" />
                <h3 className="font-heading text-2xl text-sophisticated-dark">
                  {language === 'bg' ? 'Все още няма публикации' : 'No posts available yet'}
                </h3>
                <p className="text-hierarchy-secondary font-sophisticated">
                  {language === 'bg'
                    ? 'Следете профила ни в Instagram за най-новото съдържание.'
                    : 'Follow us on Instagram to see the latest posts as they arrive.'}
                </p>
              </div>
            </motion.article>
          )}

          {!isLoading && !error && instagramPosts.map((post) => (
            <motion.article
              key={post?.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-soft overflow-hidden elegant-hover"
            >
              {/* Post Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={post?.image ?? '/assets/images/no_image.png'}
                  alt="Instagram post"
                  className="w-full h-full object-cover gallery-image"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center space-x-2">
                      <Icon name="Heart" size={20} />
                      <span className="font-sophisticated">{post?.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MessageCircle" size={20} />
                      <span className="font-sophisticated">{post?.comments ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Instagram Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="Instagram" size={16} className="text-sophisticated-dark" />
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                      <Icon name="Camera" size={16} className="text-sophisticated-dark" />
                    </div>
                    <div>
                      <p className="font-sophisticated font-medium text-sophisticated-dark text-sm">
                        elenarose_photography
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        {formatTimeAgo(post?.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sophisticated-dark font-sophisticated text-sm leading-relaxed line-clamp-3">
                  {post?.caption || (language === 'bg' ? 'Вдъхновението е на път!' : 'Fresh inspiration is on its way!')}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                      <Icon name="Heart" size={16} />
                      <span className="text-sm font-sophisticated">{post?.likes ?? 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                      <Icon name="MessageCircle" size={16} />
                      <span className="text-sm font-sophisticated">{post?.comments ?? 0}</span>
                    </button>
                  </div>
                  {post?.permalink ? (
                    <button
                      className="text-hierarchy-secondary hover:text-accent transition-colors duration-300"
                      onClick={() => window.open(post?.permalink, '_blank')}
                      aria-label={language === 'bg' ? 'Отвори публикацията' : 'Open post'}
                    >
                      <Icon name="Share" size={16} />
                    </button>
                  ) : (
                    <button className="text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                      <Icon name="Share" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            variant="default"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-lg magnetic-hover pulse-cta"
            onClick={() => window.open('https://instagram.com/elenarose_photography', '_blank')}
          >
            <Icon name="Instagram" size={20} className="mr-2" />
            {language === 'bg' ? 'Последвай в Instagram' : 'Follow on Instagram'}
          </Button>

          <p className="mt-4 text-hierarchy-secondary font-sophisticated">
            {language === 'bg' ? 'Присъединете се към 12.5К последователи' : 'Join 12.5K followers'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
