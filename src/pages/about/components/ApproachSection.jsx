import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../hooks/useLanguage';

const ApproachSection = () => {
  const { t } = useLanguage();
  const approachPrinciples = [
    {
      icon: "Heart",
      title: t('authenticity'),
      description: t('authenticityDescription')
    },
    {
      icon: "Users",
      title: t('collaboration'),
      description: t('collaborationDescription')
    },
    {
      icon: "Sparkles",
      title: t('attentionToDetail'),
      description: t('attentionToDetailDescription')
    },
    {
      icon: "Clock",
      title: t('patience'),
      description: t('patienceDescription')
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: t('initialConsultation'),
      description: t('initialConsultationDescription'),
      duration: t('duration3060min')
    },
    {
      step: "02", 
      title: t('planning'),
      description: t('planningDescription'),
      duration: t('duration12weeks')
    },
    {
      step: "03",
      title: t('photoshoot'),
      description: t('photoshootDescription'),
      duration: t('duration14hours')
    },
    {
      step: "04",
      title: t('processing'),
      description: t('processingDescription'),
      duration: t('duration23weeks')
    },
    {
      step: "05",
      title: t('delivery'),
      description: t('deliveryDescription'),
      duration: t('durationImmediate')
    }
  ];

  return (
    <section className="py-20 bg-warm-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            {t('myApproach')}
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {t('approachDescription')}
          </p>
        </div>

        {/* Philosophy */}
        <div className="mb-20">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-medium">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-heading text-sophisticated-dark mb-6">
                  {t('myPhilosophy')}
                </h3>
                <div className="prose prose-lg text-hierarchy-secondary max-w-none space-y-4">
                  <p>
                    {t('philosophyParagraph1')}
                  </p>
                  <p>
                    {t('philosophyParagraph2')}
                  </p>
                  <p>
                    {t('philosophyParagraph3')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {approachPrinciples?.map((principle, index) => (
                  <div key={index} className="bg-surface-elevation p-6 rounded-2xl text-center elegant-hover">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={principle?.icon} size={24} className="text-sophisticated-dark" />
                    </div>
                    <h4 className="font-heading text-sophisticated-dark mb-2">
                      {principle?.title}
                    </h4>
                    <p className="text-sm text-hierarchy-secondary">
                      {principle?.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div>
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            {t('howWeWorkTogether')}
          </h3>
          
          <div className="space-y-8">
            {processSteps?.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-background rounded-2xl p-6 md:p-8 shadow-soft elegant-hover">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-soft">
                        <span className="text-xl font-heading text-sophisticated-dark">
                          {step?.step}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-heading text-sophisticated-dark mb-2">
                            {step?.title}
                          </h4>
                          <p className="text-hierarchy-secondary">
                            {step?.description}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="bg-feminine-accent px-4 py-2 rounded-full">
                            <span className="text-sm font-sophisticated text-sophisticated-dark">
                              {step?.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < processSteps?.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-accent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-accent to-secondary p-8 rounded-3xl shadow-medium">
            <h3 className="text-2xl font-heading text-sophisticated-dark mb-4">
              {t('readyToCreateTogether')}
            </h3>
            <p className="text-hierarchy-secondary mb-6 max-w-2xl mx-auto">
              {t('readyToCreateDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-sophisticated-dark text-background px-8 py-3 rounded-full font-sophisticated elegant-hover">
                {t('bookConsultation')}
              </button>
              <button className="border border-sophisticated-dark text-sophisticated-dark px-8 py-3 rounded-full font-sophisticated elegant-hover">
                {t('viewPortfolio')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;