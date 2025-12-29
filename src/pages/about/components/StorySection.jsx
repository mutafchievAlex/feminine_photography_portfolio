import React from 'react';
import Image from '../../../components/AppImage';
import EditableText from '../../../components/EditableText';
import { useLanguage } from '../../../hooks/useLanguage';
import { usePageContent } from '../../../hooks/usePageContent';

const StorySection = () => {
  const { t, language } = useLanguage();
  const { getText, updateContent } = usePageContent('about', language);
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
          <EditableText
            contentKey="story_title"
            onUpdate={updateContent}
            getText={getText}
            className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6"
            as="h2"
          >
            {getText('story_title', t('myStory'))}
          </EditableText>
          <EditableText
            contentKey="story_description"
            onUpdate={updateContent}
            getText={getText}
            className="text-lg text-hierarchy-secondary max-w-3xl mx-auto"
            as="p"
            multiline={true}
          >
            {getText('story_description', t('storyDescription'))}
          </EditableText>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Story Content */}
          <div className="space-y-8">
            <div className="prose prose-lg text-hierarchy-secondary max-w-none">
              <EditableText
                contentKey="story_paragraph_1"
                onUpdate={updateContent}
                getText={getText}
                className="text-lg leading-relaxed mb-4"
                as="p"
                multiline={true}
              >
                {getText('story_paragraph_1', t('storyParagraph1'))}
              </EditableText>
              <EditableText
                contentKey="story_paragraph_2"
                onUpdate={updateContent}
                getText={getText}
                className="text-lg leading-relaxed mb-4"
                as="p"
                multiline={true}
              >
                {getText('story_paragraph_2', t('storyParagraph2'))}
              </EditableText>
              <EditableText
                contentKey="story_paragraph_3"
                onUpdate={updateContent}
                getText={getText}
                className="text-lg leading-relaxed"
                as="p"
                multiline={true}
              >
                {getText('story_paragraph_3', t('storyParagraph3'))}
              </EditableText>
            </div>

            {/* Personal Touch */}
            <div className="bg-warm-section p-6 rounded-2xl">
              <EditableText
                contentKey="why_i_chose_photography"
                onUpdate={updateContent}
                getText={getText}
                className="text-xl font-heading text-sophisticated-dark mb-4"
                as="h3"
              >
                {getText('why_i_chose_photography', t('whyIChosePhotography'))}
              </EditableText>
              <EditableText
                contentKey="photography_quote"
                onUpdate={updateContent}
                getText={getText}
                className="text-hierarchy-secondary"
                as="p"
                multiline={true}
              >
                {getText('photography_quote', t('photographyQuote'))}
              </EditableText>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <EditableText
              contentKey="key_moments_title"
              onUpdate={updateContent}
              getText={getText}
              className="text-2xl font-heading text-sophisticated-dark mb-8"
              as="h3"
            >
              {getText('key_moments_title', t('keyMoments'))}
            </EditableText>
            
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
                      <EditableText
                        contentKey={`milestone_${milestone?.year}_title`}
                        onUpdate={updateContent}
                        getText={getText}
                        className="text-lg font-heading text-sophisticated-dark mb-2"
                        as="h4"
                      >
                        {getText(`milestone_${milestone?.year}_title`, milestone?.title)}
                      </EditableText>
                      <EditableText
                        contentKey={`milestone_${milestone?.year}_description`}
                        onUpdate={updateContent}
                        getText={getText}
                        className="text-hierarchy-secondary text-sm"
                        as="p"
                        multiline={true}
                      >
                        {getText(`milestone_${milestone?.year}_description`, milestone?.description)}
                      </EditableText>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;