import React from 'react';
import Image from '../../../components/AppImage';
import { useLanguage } from '../../../hooks/useLanguage';

const StorySection = () => {
  const { t } = useLanguage();
  const storyMilestones = [
    {
      year: "2016",
      title: t('milestone2016Title'),
      description: t('milestone2016Description')
    },
    {
      year: "2018",
      title: t('milestone2018Title'),
      description: t('milestone2018Description')
    },
    {
      year: "2020",
      title: t('milestone2020Title'),
      description: t('milestone2020Description')
    },
    {
      year: "2022",
      title: t('milestone2022Title'),
      description: t('milestone2022Description')
    },
    {
      year: "2024",
      title: t('milestone2024Title'),
      description: t('milestone2024Description')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            {t('myStory')}
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {t('storyDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Story Content */}
          <div className="space-y-8">
            <div className="prose prose-lg text-hierarchy-secondary max-w-none">
              <p>{t('storyParagraph1')}</p>
              <p>{t('storyParagraph2')}</p>
              <p>{t('storyParagraph3')}</p>
            </div>

            {/* Personal Touch */}
            <div className="bg-warm-section p-6 rounded-2xl">
              <h3 className="text-xl font-heading text-sophisticated-dark mb-4">
                {t('whyIChosePhotography')}
              </h3>
              <p className="text-hierarchy-secondary">
                {t('photographyQuote')}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading text-sophisticated-dark mb-8">
              {t('keyMoments')}
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent"></div>
              
              {storyMilestones?.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6 pb-8">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-sm font-sophisticated text-sophisticated-dark">
                      {milestone?.year?.slice(-2)}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-elevation p-6 rounded-xl shadow-soft elegant-hover">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-sophisticated text-accent">
                          {milestone?.year}
                        </span>
                      </div>
                      <h4 className="text-lg font-heading text-sophisticated-dark mb-2">
                        {milestone?.title}
                      </h4>
                      <p className="text-hierarchy-secondary text-sm">
                        {milestone?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behind the Scenes Images */}
        <div className="mt-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            {t('behindTheScenes')}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt={t('studioWorkAlt')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">{t('inTheStudio')}</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1554048612-b6a482b224b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt={t('weddingPhotoshootAlt')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">{t('atAWedding')}</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt={t('outdoorPhotoshootAlt')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">{t('onLocationText')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;