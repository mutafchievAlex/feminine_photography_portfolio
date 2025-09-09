import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Сигурно резервиране / Secure Booking',
      description: 'Вашите данни са защитени с SSL криптиране / Your data is protected with SSL encryption'
    },
    {
      icon: 'RefreshCw',
      title: 'Гъвкаво пренасрочване / Flexible Rescheduling',
      description: 'Безплатно пренасрочване до 48 часа преди сесията / Free rescheduling up to 48 hours before session'
    },
    {
      icon: 'Phone',
      title: 'Директен контакт / Direct Contact',
      description: 'Винаги можете да се свържете директно с мен / You can always contact me directly'
    },
    {
      icon: 'Award',
      title: 'Гарантирано качество / Quality Guaranteed',
      description: '100% гаранция за удовлетвореност / 100% satisfaction guarantee'
    }
  ];

  const policies = [
    {
      title: 'Политика за отмяна / Cancellation Policy',
      items: [
        'Безплатна отмяна до 48 часа преди сесията / Free cancellation up to 48 hours before session',
        'Пълно възстановяване при отмяна от фотографа / Full refund if cancelled by photographer',
        'Гъвкави опции при непредвидени обстоятелства / Flexible options for unforeseen circumstances'
      ]
    },
    {
      title: 'Политика за поверителност / Privacy Policy',
      items: [
        'Вашите снимки няма да бъдат споделени без разрешение / Your photos won\'t be shared without permission',
        'Лични данни се използват само за комуникация / Personal data used only for communication',
        'Възможност за изтриване на данни по всяко време / Option to delete data at any time'
      ]
    }
  ];

  const testimonialHighlights = [
    {
      quote: `"Елена направи цялия процес толкова лесен и удобен. От първата консултация до получаването на снимките - всичко беше перфектно организирано."`,
      author: 'Мария Петрова',
      session: 'Сватбена фотосесия'
    },
    {
      quote: `"The booking process was seamless and Elena made me feel comfortable from the very first conversation. Highly recommend!"`,
      author: 'Sarah Johnson',
      session: 'Maternity Session'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
            Защо да ме изберете / Why Choose Me
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary">
            Вашето спокойствие и удовлетвореност са моят приоритет
          </p>
          <p className="text-sophisticated text-hierarchy-secondary text-sm mt-1">
            Your peace of mind and satisfaction are my priority
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
      {/* Quick Testimonials */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-2">
            Какво казват клиентите / What Clients Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialHighlights?.map((testimonial, index) => (
            <div key={index} className="relative">
              <div className="bg-gallery-canvas rounded-lg p-6 shadow-soft">
                <Icon name="Quote" size={24} className="text-accent mb-3" />
                <p className="text-sophisticated text-sophisticated-dark mb-4 italic">
                  {testimonial?.quote}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={18} className="text-sophisticated-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-sophisticated text-sophisticated-dark">
                      {testimonial?.author}
                    </p>
                    <p className="text-xs text-hierarchy-secondary">
                      {testimonial?.session}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-gradient-to-r from-accent to-secondary rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center">
          <h3 className="text-elegant text-xl text-sophisticated-dark mb-3">
            Имате въпроси? / Have Questions?
          </h3>
          <p className="text-sophisticated text-sophisticated-dark mb-6">
            Свържете се с мен директно за бърз отговор / Contact me directly for a quick response
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