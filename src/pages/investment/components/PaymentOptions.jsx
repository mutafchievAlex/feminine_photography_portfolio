import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../hooks/useLanguage';

const PaymentOptions = ({ onBookConsultation }) => {
  const { t } = useLanguage();
  const paymentPlans = [
    {
      id: 1,
      name: "Full Payment",
      discount: t('fullPaymentDiscount'),
      description: t('fullPaymentDescription'),
      icon: "CreditCard",
      popular: false
    },
    {
      id: 2,
      name: "Payment Plan",
      discount: t('paymentPlanDiscount'),
      description: t('paymentPlanDescription'),
      icon: "Calendar",
      popular: true
    },
    {
      id: 3,
      name: "Extended Plan",
      discount: t('extendedPlanDiscount'),
      description: t('extendedPlanDescription'),
      icon: "Clock",
      popular: false
    }
  ];

  return (
    <div className="bg-warm-section rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl font-medium text-sophisticated-dark mb-4">
          {t('paymentOptions')}
        </h3>
        <p className="text-hierarchy-secondary leading-relaxed max-w-2xl mx-auto">
          {t('paymentOptionsDescription')}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {paymentPlans?.map((plan) => (
          <div 
            key={plan?.id}
            className={`relative bg-background rounded-xl p-6 shadow-soft elegant-hover ${
              plan?.popular ? 'ring-2 ring-accent' : ''
            }`}
          >
            {plan?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-sophisticated-dark text-xs font-sophisticated px-3 py-1 rounded-full">
                  {t('mostPopular')}
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon 
                  name={plan?.icon} 
                  size={20} 
                  className="text-sophisticated-dark" 
                />
              </div>
              
              <h4 className="font-sophisticated font-medium text-sophisticated-dark mb-1">
                {plan?.name}
              </h4>
              <span className="text-sm text-accent font-medium">
                {plan?.discount}
              </span>
            </div>
            
            <p className="text-sm text-hierarchy-secondary text-center leading-relaxed">
              {plan?.description}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button
          variant="default"
          className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover"
          onClick={onBookConsultation}
        >
          {t('discussPaymentOptions')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;