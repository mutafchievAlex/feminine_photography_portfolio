import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../hooks/useLanguage';

const ConsultationProcess = () => {
  const { t } = useLanguage();
  const processSteps = [
    {
      id: 1,
      icon: 'MessageCircle',
      title: t('initialConversationTitle'),
      description: t('initialConversationDesc'),
      duration: t('initialConversationDuration')
    },
    {
      id: 2,
      icon: 'MapPin',
      title: t('locationPlanningTitle'),
      description: t('locationPlanningDesc'),
      duration: t('locationPlanningDuration')
    },
    {
      id: 3,
      icon: 'Palette',
      title: t('stylingPrepTitle'),
      description: t('stylingPrepDesc'),
      duration: t('stylingPrepDuration')
    },
    {
      id: 4,
      icon: 'Calendar',
      title: t('finalizingDetailsTitle'),
      description: t('finalizingDetailsDesc'),
      duration: t('finalizingDetailsDuration')
    }
  ];

  const whatToExpect = [
    {
      icon: 'Clock',
      title: t('expectDurationTitle'),
      description: t('expectDurationDesc')
    },
    {
      icon: 'Video',
      title: t('expectFormatTitle'),
      description: t('expectFormatDesc')
    },
    {
      icon: 'Gift',
      title: t('expectComplimentaryTitle'),
      description: t('expectComplimentaryDesc')
    },
    {
      icon: 'Heart',
      title: t('expectPersonalizedTitle'),
      description: t('expectPersonalizedDesc')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Process Overview */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-8">
          <h3 className="text-elegant text-2xl text-sophisticated-dark mb-3">
            {t('consultationProcess')}
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary max-w-2xl mx-auto">
            {t('consultationProcessDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processSteps?.map((step, index) => (
            <div key={step?.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-soft">
                    <Icon name={step?.icon} size={20} className="text-sophisticated-dark" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sophisticated font-medium text-sophisticated-dark">
                      {step?.title}
                    </h4>
                    <span className="text-xs text-hierarchy-secondary bg-warm-section px-2 py-1 rounded-full">
                      {step?.duration}
                    </span>
                  </div>
                  <p className="text-sm text-hierarchy-secondary leading-relaxed whitespace-pre-line">
                    {step?.description}
                  </p>
                </div>
              </div>
              
              {/* Connection line for desktop */}
              {index < processSteps?.length - 1 && (
                <div className="hidden md:block absolute top-12 left-6 w-0.5 h-16 bg-gradient-to-b from-accent to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* What to Expect */}
      <div className="bg-warm-section rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
            {t('whatToExpect')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatToExpect?.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
                <Icon name={item?.icon} size={18} className="text-sophisticated-dark" />
              </div>
              <h4 className="text-sophisticated font-medium text-sophisticated-dark mb-1 text-sm">
                {item?.title}
              </h4>
              <p className="text-xs text-hierarchy-secondary">
                {item?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Timeline */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
            {t('timeline')}
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary">
            {t('timelineDescription')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-secondary to-accent"></div>
          
          <div className="space-y-6">
            {[
              {
                day: t('timelineDay1'),
                title: t('timelineDay1Title'),
                description: t('timelineDay1Desc')
              },
              {
                day: t('timelineDay2'),
                title: t('timelineDay2Title'),
                description: t('timelineDay2Desc')
              },
              {
                day: t('timelineDay3'),
                title: t('timelineDay3Title'),
                description: t('timelineDay3Desc')
              }
            ]?.map((item, index) => (
              <div key={index} className="relative flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-soft z-10">
                  <div className="w-3 h-3 bg-sophisticated-dark rounded-full"></div>
                </div>
                <div className="ml-6">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-sophisticated text-hierarchy-secondary bg-gallery-canvas px-2 py-1 rounded-full">
                      {item?.day}
                    </span>
                    <h4 className="text-sophisticated font-medium text-sophisticated-dark">
                      {item?.title}
                    </h4>
                  </div>
                  <p className="text-sm text-hierarchy-secondary">
                    {item?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationProcess;