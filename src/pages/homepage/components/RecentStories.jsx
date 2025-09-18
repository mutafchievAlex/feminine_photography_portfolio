import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useStories from '../../../hooks/useStories';

const RecentStories = () => {
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const storyOptions = useMemo(
    () => ({ limit: 4, locale: language }),
    [language]
  );

  const { stories: storiesData, isLoading, error, refetch } = useStories(storyOptions);

  const localizeContent = (value) => {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      return value?.[language] ?? value?.name ?? value?.label ?? value?.title ?? Object.values(value)?.[0] ?? '';
    }

    return '';
  };

  const stories = useMemo(() => {
    const rawStories = Array.isArray(storiesData)
      ? storiesData
      : storiesData?.items ?? storiesData?.data ?? storiesData?.stories ?? [];

    return (
      rawStories
        ?.map((story, index) => {
        const fallbackImage = story?.coverImageUrl ?? story?.imageUrl ?? story?.image ?? story?.coverImage?.url;
        const fallbackCategory =
          typeof story?.category === 'object'
            ? story?.category?.key ?? story?.category?.slug ?? story?.category?.id
            : story?.category ?? story?.categoryKey ?? story?.categorySlug;

        return {
          id: story?.id ?? story?.storyId ?? story?.slug ?? `story-${index}`,
          title: localizeContent(story?.title) || (language === 'bg' ? 'Без заглавие' : 'Untitled'),
          description: localizeContent(story?.description),
          image: fallbackImage ?? story?.featuredImage ?? story?.mediaUrl ?? story?.thumbnailUrl,
          category:
            localizeContent(story?.categoryLabel ?? story?.categoryName ?? story?.category) ||
            fallbackCategory ||
            (language === 'bg' ? 'История' : 'Story'),
          date: story?.date ?? story?.eventDate ?? story?.publishedAt ?? story?.createdAt,
          location: localizeContent(story?.location) ?? localizeContent(story?.eventLocation),
        };
        })
        ?.filter((story) => story?.id)
    ) ?? [];
  }, [storiesData, language]);

  const skeletonCards = useMemo(() => Array.from({ length: 4 }), []);

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
          {isLoading && (
            <>
              {skeletonCards.map((_, index) => (
                <motion.article
                  key={`story-skeleton-${index}`}
                  variants={itemVariants}
                  className={`group ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-12'}`}
                >
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="h-64 md:h-80 bg-surface-elevation animate-pulse" />
                    <div className="p-6 md:p-8 space-y-4">
                      <div className="h-6 w-3/4 bg-surface-elevation animate-pulse rounded" />
                      <div className="h-4 w-1/3 bg-surface-elevation animate-pulse rounded" />
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-surface-elevation animate-pulse rounded" />
                        <div className="h-4 w-5/6 bg-surface-elevation animate-pulse rounded" />
                        <div className="h-4 w-2/3 bg-surface-elevation animate-pulse rounded" />
                      </div>
                      <div className="h-10 w-32 bg-surface-elevation animate-pulse rounded-full" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}

          {!isLoading && error && (
            <motion.article
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
                <h3 className="font-heading text-2xl text-sophisticated-dark">
                  {language === 'bg' ? 'Неуспешно зареждане на историите' : 'Stories failed to load'}
                </h3>
                <p className="text-hierarchy-secondary font-sophisticated">
                  {language === 'bg'
                    ? 'Моля, опитайте отново малко по-късно. Ако проблемът продължи, свържете се с нас.'
                    : 'Please try again shortly. If the issue persists, feel free to get in touch.'}
                </p>
                <Button variant="outline" onClick={refetch} className="elegant-hover">
                  <Icon name="RefreshCcw" size={16} className="mr-2" />
                  {language === 'bg' ? 'Опитай отново' : 'Try again'}
                </Button>
              </div>
            </motion.article>
          )}

          {!isLoading && !error && stories?.length === 0 && (
            <motion.article
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                <Icon name="BookOpen" size={36} className="mx-auto text-accent" />
                <h3 className="font-heading text-2xl text-sophisticated-dark">
                  {language === 'bg' ? 'Скоро ще споделим нови истории' : 'New stories coming soon'}
                </h3>
                <p className="text-hierarchy-secondary font-sophisticated">
                  {language === 'bg'
                    ? 'Следете галерията, за да откриете най-новите ни вдъхновяващи истории.'
                    : 'Check back soon to explore our latest inspiring stories.'}
                </p>
              </div>
            </motion.article>
          )}

          {!isLoading && !error && stories?.slice(0, 4)?.map((story, index) => (
            <motion.article
              key={story?.id}
              variants={itemVariants}
              className={`group ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-12'}`}
            >
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden elegant-hover">
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={story?.image ?? '/assets/images/no_image.png'}
                    alt={story?.title}
                    className="w-full h-full object-cover gallery-image"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-sophisticated text-sophisticated-dark">
                      {story?.category?.charAt?.(0)?.toUpperCase?.() + story?.category?.slice?.(1) || story?.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <Icon name="MapPin" size={16} />
                      <span className="font-sophisticated">{story?.location || (language === 'bg' ? 'България' : 'Bulgaria')}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl md:text-2xl text-sophisticated-dark">
                      {story?.title}
                    </h3>
                    <span className="text-sm text-hierarchy-secondary font-sophisticated">
                      {story?.date
                        ? new Date(story.date)?.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US')
                        : language === 'bg'
                          ? 'Съвсем скоро'
                          : 'Recently'}
                    </span>
                  </div>

                  <p className="text-hierarchy-secondary font-sophisticated leading-relaxed mb-6 whitespace-pre-line">
                    {story?.description || (language === 'bg' ? 'Описаниета скоро ще бъде налично.' : 'Description coming soon.')}
                  </p>

                  <Button
                    variant="outline"
                    className="group-hover:bg-accent group-hover:border-accent group-hover:text-sophisticated-dark transition-all duration-300"
                    onClick={() => window.location.href = '/gallery'}
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
            onClick={() => window.location.href = '/gallery'}
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