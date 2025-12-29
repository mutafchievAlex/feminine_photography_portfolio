import React from 'react';
import Icon from '../../../components/AppIcon';
import EditableText from '../../../components/EditableText';
import { useLanguage } from '../../../hooks/useLanguage';
import { usePageContent } from '../../../hooks/usePageContent';

const ApproachSection = () => {
  const { t, language } = useLanguage();
  const { getText, updateContent } = usePageContent('about', language);
  const approachPrinciples = [
    {
      icon: "Heart",
      title: getText('approach_principle_1_title', t('authenticity')),
      description: getText('approach_principle_1_description', t('authenticityDescription'))
    },
    {
      icon: "Users",
      title: getText('approach_principle_2_title', t('collaboration')),
      description: getText('approach_principle_2_description', t('collaborationDescription'))
    },
    {
      icon: "Sparkles",
      title: getText('approach_principle_3_title', t('attentionToDetail')),
      description: getText('approach_principle_3_description', t('attentionToDetailDescription'))
    },
    {
      icon: "Clock",
      title: getText('approach_principle_4_title', t('patience')),
      description: getText('approach_principle_4_description', t('patienceDescription'))
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: getText('process_step_1_title', t('initialConsultation')),
      description: getText('process_step_1_description', t('initialConsultationDescription')),
      duration: getText('process_step_1_duration', t('duration3060min'))
    },
    {
      step: "02", 
      title: getText('process_step_2_title', t('planning')),
      description: getText('process_step_2_description', t('planningDescription')),
      duration: getText('process_step_2_duration', t('duration12weeks'))
    },
    {
      step: "03",
      title: getText('process_step_3_title', t('photoshoot')),
      description: getText('process_step_3_description', t('photoshootDescription')),
      duration: getText('process_step_3_duration', t('duration14hours'))
    },
    {
      step: "04",
      title: getText('process_step_4_title', t('processing')),
      description: getText('process_step_4_description', t('processingDescription')),
      duration: getText('process_step_4_duration', t('duration23weeks'))
    },
    {
      step: "05",
      title: getText('process_step_5_title', t('delivery')),
      description: getText('process_step_5_description', t('deliveryDescription')),
      duration: getText('process_step_5_duration', t('durationImmediate'))
    }
  ];

  return (
    <section className="py-20 bg-warm-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <EditableText
            contentKey="approach_title"
            onUpdate={updateContent}
            getText={getText}
            className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6"
            as="h2"
          >
            {getText('approach_title', t('myApproach'))}
          </EditableText>
          <EditableText
            contentKey="approach_description"
            onUpdate={updateContent}
            getText={getText}
            className="text-lg text-hierarchy-secondary max-w-3xl mx-auto"
            as="p"
            multiline={true}
          >
            {getText('approach_description', t('approachDescription'))}
          </EditableText>
        </div>

        {/* Philosophy */}
        <div className="mb-20">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-medium">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <EditableText
                  contentKey="my_philosophy_title"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-2xl font-heading text-sophisticated-dark mb-6"
                  as="h3"
                >
                  {getText('my_philosophy_title', t('myPhilosophy'))}
                </EditableText>
                <div className="prose prose-lg text-hierarchy-secondary max-w-none space-y-4">
                  <EditableText
                    contentKey="philosophy_paragraph_1"
                    onUpdate={updateContent}
                    getText={getText}
                    className="text-lg leading-relaxed"
                    as="p"
                    multiline={true}
                  >
                    {getText('philosophy_paragraph_1', t('philosophyParagraph1'))}
                  </EditableText>
                  <EditableText
                    contentKey="philosophy_paragraph_2"
                    onUpdate={updateContent}
                    getText={getText}
                    className="text-lg leading-relaxed"
                    as="p"
                    multiline={true}
                  >
                    {getText('philosophy_paragraph_2', t('philosophyParagraph2'))}
                  </EditableText>
                  <EditableText
                    contentKey="philosophy_paragraph_3"
                    onUpdate={updateContent}
                    getText={getText}
                    className="text-lg leading-relaxed"
                    as="p"
                    multiline={true}
                  >
                    {getText('philosophy_paragraph_3', t('philosophyParagraph3'))}
                  </EditableText>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {approachPrinciples?.map((principle, index) => (
                  <div key={index} className="bg-surface-elevation p-6 rounded-2xl text-center elegant-hover">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={principle?.icon} size={24} className="text-sophisticated-dark" />
                    </div>
                    <EditableText
                      contentKey={`approach_principle_${index + 1}_title`}
                      onUpdate={updateContent}
                      getText={getText}
                      className="font-heading text-sophisticated-dark mb-2"
                      as="h4"
                    >
                      {principle?.title}
                    </EditableText>
                    <EditableText
                      contentKey={`approach_principle_${index + 1}_description`}
                      onUpdate={updateContent}
                      getText={getText}
                      className="text-sm text-hierarchy-secondary"
                      as="p"
                      multiline={true}
                    >
                      {principle?.description}
                    </EditableText>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div>
          <EditableText
            contentKey="how_we_work_title"
            onUpdate={updateContent}
            getText={getText}
            className="text-2xl font-heading text-sophisticated-dark text-center mb-12"
            as="h3"
          >
            {getText('how_we_work_title', t('howWeWorkTogether'))}
          </EditableText>
          
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
                          <EditableText
                            contentKey={`process_step_${index + 1}_title`}
                            onUpdate={updateContent}
                            getText={getText}
                            className="text-xl font-heading text-sophisticated-dark mb-2"
                            as="h4"
                          >
                            {step?.title}
                          </EditableText>
                          <EditableText
                            contentKey={`process_step_${index + 1}_description`}
                            onUpdate={updateContent}
                            getText={getText}
                            className="text-hierarchy-secondary"
                            as="p"
                            multiline={true}
                          >
                            {step?.description}
                          </EditableText>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="bg-feminine-accent px-4 py-2 rounded-full">
                            <EditableText
                              contentKey={`process_step_${index + 1}_duration`}
                              onUpdate={updateContent}
                              getText={getText}
                              className="text-sm font-sophisticated text-sophisticated-dark"
                              as="span"
                            >
                              {step?.duration}
                            </EditableText>
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
            <EditableText
              contentKey="call_to_action_title"
              onUpdate={updateContent}
              getText={getText}
              className="text-2xl font-heading text-sophisticated-dark mb-4"
              as="h3"
            >
              {getText('call_to_action_title', t('readyToCreateTogether'))}
            </EditableText>
            <EditableText
              contentKey="call_to_action_description"
              onUpdate={updateContent}
              getText={getText}
              className="text-hierarchy-secondary mb-6 max-w-2xl mx-auto text-lg"
              as="p"
              multiline={true}
            >
              {getText('call_to_action_description', t('readyToCreateDescription'))}
            </EditableText>
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