import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../hooks/useLanguage';

const TrustSignals = () => {
  const { t } = useLanguage();
  const trustFeatures = [
    {
      icon: 'Shield',
      title: t('secureBookingTitle'),
      description: t('secureBookingDesc')
    },
    {
      icon: 'RefreshCw',
      title: t('flexibleReschedulingTitle'),
      description: t('flexibleReschedulingDesc')
    },
    {
      icon: 'Phone',
      title: t('directContactTitle'),
      description: t('directContactDesc')
    },
    {
      icon: 'Award',
      title: t('qualityGuaranteedTitle'),
      description: t('qualityGuaranteedDesc')
    }
  ];

  const policies = [
    {
      title: t('cancellationPolicy'),
      items: [
        t('cancellationItem1'),
        t('cancellationItem2'),
        t('cancellationItem3')
      ]
    },
    {
      title: t('privacyPolicyTitle'),
      items: [
        t('privacyItem1'),
        t('privacyItem2'),
        t('privacyItem3')
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
            {t('whyChooseMe')}
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary">
            {t('whyChooseMeDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-soft">
                  <Icon name={feature?.icon} size={18} className="text-sophisticated-dark" />
                </div>
              </div>
              <div>
                <h4 className="text-sophisticated font-medium text-sophisticated-dark mb-1">
                  {feature?.title}
                </h4>
                <p className="text-sm text-hierarchy-secondary">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {policies?.map((policy, index) => (
          <div key={index} className="bg-warm-section rounded-xl shadow-soft p-6">
            <h3 className="text-sophisticated font-medium text-sophisticated-dark mb-4 flex items-center">
              <Icon name="FileText" size={18} className="mr-2" />
              {policy?.title}
            </h3>
            <ul className="space-y-2">
              {policy?.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-2">
                  <Icon name="Check" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-hierarchy-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Contact Information */}
      <div className="bg-gradient-to-r from-accent to-secondary rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-3">
            {t('haveQuestions')}
          </h3>
          <p className="text-sophisticated text-sophisticated-dark mb-6">
            {t('contactDirectly')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
            <a 
              href="tel:+359888123456" 
              className="flex items-center space-x-2 text-sophisticated-dark hover:text-hierarchy-secondary transition-colors elegant-hover"
            >
              <Icon name="Phone" size={18} />
              <span className="font-sophisticated">+359 888 123 456</span>
            </a>
            
            <a 
              href="mailto:elena@elenarosephotography.bg" 
              className="flex items-center space-x-2 text-sophisticated-dark hover:text-hierarchy-secondary transition-colors elegant-hover"
            >
              <Icon name="Mail" size={18} />
              <span className="font-sophisticated">elena@elenarosephotography.bg</span>
            </a>
            
            <a 
              href="https://instagram.com/elenarosephotography" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sophisticated-dark hover:text-hierarchy-secondary transition-colors elegant-hover"
            >
              <Icon name="Instagram" size={18} />
              <span className="font-sophisticated">@elenarosephotography</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;