import React from 'react';
import Image from '../../../components/AppImage';
import EditableText from '../../../components/EditableText';
import { useLanguage } from '../../../hooks/useLanguage';
import { usePageContent } from '../../../hooks/usePageContent';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const { getText, updateContent } = usePageContent('about', language);
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gallery-canvas overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-accent rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-secondary rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-sophisticated-dark leading-tight">
                {t('helloIAm')}
                <span className="block text-accent font-medium">{t('photographerName')}</span>
              </h1>
              <EditableText
                contentKey="hero_subtitle"
                onUpdate={updateContent}
                getText={getText}
                className="text-xl md:text-2xl text-hierarchy-secondary font-sophisticated"
                as="p"
              >
                {getText('hero_subtitle', t('heroSubtitle'))}
              </EditableText>
            </div>
            
            <div className="prose prose-lg text-hierarchy-secondary max-w-none">
              <EditableText
                contentKey="hero_prose_text"
                onUpdate={updateContent}
                getText={getText}
                className="text-lg leading-relaxed"
                as="p"
                multiline={true}
              >
                {getText('hero_prose_text', t('heroProseText'))}
              </EditableText>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="text-center">
                <EditableText
                  contentKey="hero_stat_clients_value"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-3xl font-heading text-sophisticated-dark"
                  as="div"
                >
                  {getText('hero_stat_clients_value', '500+')}
                </EditableText>
                <EditableText
                  contentKey="hero_stat_clients_label"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-sm text-hierarchy-secondary"
                  as="div"
                >
                  {getText('hero_stat_clients_label', t('happyClients'))}
                </EditableText>
              </div>
              <div className="hidden sm:block w-px bg-border"></div>
              <div className="text-center">
                <EditableText
                  contentKey="hero_stat_experience_value"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-3xl font-heading text-sophisticated-dark"
                  as="div"
                >
                  {getText('hero_stat_experience_value', '8+')}
                </EditableText>
                <EditableText
                  contentKey="hero_stat_experience_label"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-sm text-hierarchy-secondary"
                  as="div"
                >
                  {getText('hero_stat_experience_label', t('yearsExperience'))}
                </EditableText>
              </div>
              <div className="hidden sm:block w-px bg-border"></div>
              <div className="text-center">
                <EditableText
                  contentKey="hero_stat_awards_value"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-3xl font-heading text-sophisticated-dark"
                  as="div"
                >
                  {getText('hero_stat_awards_value', '15+')}
                </EditableText>
                <EditableText
                  contentKey="hero_stat_awards_label"
                  onUpdate={updateContent}
                  getText={getText}
                  className="text-sm text-hierarchy-secondary"
                  as="div"
                >
                  {getText('hero_stat_awards_label', t('awards'))}
                </EditableText>
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative">
            <div className="relative z-10 aspect-[3/4] max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-secondary rounded-2xl transform rotate-3 shadow-soft"></div>
              <div className="relative bg-background rounded-2xl overflow-hidden shadow-medium elegant-hover">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616c9c1e5e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt={`${t('photographerName')} - ${t('professionalPhotographer')}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-feminine-accent rounded-full flex items-center justify-center shadow-soft">
              <span className="text-2xl">📸</span>
            </div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-soft">
              <span className="text-xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;