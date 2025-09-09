import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PackageCard from './components/PackageCard';
import AddOnService from './components/AddOnService';
import ValueProposition from './components/ValueProposition';
import TestimonialCard from './components/TestimonialCard';
import PaymentOptions from './components/PaymentOptions';
import SeasonalPromotion from './components/SeasonalPromotion';

const Investment = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Mock data for packages
  const packages = [
    {
      id: 1,
      name: "Essential",
      subtitle: "Перфектно за малки събития",
      price: "450",
      description: "Идеален избор за интимни моменти и малки празненства. Включва основните услуги за създаване на красиви спомени.",
      features: [
        "1 час фотосесия",
        "1 локация по избор",
        "20 професионално редактирани снимки",
        "Онлайн галерия за 30 дни",
        "Високо разделителна способност за печат",
        "Консултация преди сесията"
      ]
    },
    {
      id: 2,
      name: "Signature",
      subtitle: "Най-популярният избор",
      price: "750",
      description: "Нашият най-търсен пакет, който предлага перфектния баланс между стойност и качество за вашите специални моменти.",
      features: [
        "2 часа фотосесия",
        "До 2 локации",
        "50 професионално редактирани снимки",
        "Частна онлайн галерия за 90 дни",
        "Всички снимки в пълна резолюция",
        "Подробна консултация и планиране",
        "Бързо редактиране - 48 часа",
        "Възможност за допълнителни снимки"
      ]
    },
    {
      id: 3,
      name: "Legacy",
      subtitle: "Пълното изживяване",
      price: "1200",
      description: "Премиум пакетът за тези, които искат да запазят всеки момент. Включва всичко необходимо за създаване на вечни спомени.",
      features: [
        "4 часа фотосесия",
        "Неограничен брой локации",
        "100+ професионално редактирани снимки",
        "Частна галерия за 1 година",
        "Всички оригинални файлове",
        "Персонален фотоалбум (30 страници)",
        "Приоритетно редактиране - 24 часа",
        "Втора консултация след сесията",
        "USB с всички снимки",
        "Права за търговска употреба"
      ]
    }
  ];

  // Mock data for add-on services
  const addOnServices = [
    {
      id: 1,
      name: "Engagement Session",
      price: "300",
      icon: "Heart",
      description: "Романтична предсватбена фотосесия за двойки. Перфектна за запознаване преди сватбата.",
      features: [
        "1 час фотосесия",
        "15 редактирани снимки",
        "Онлайн галерия"
      ]
    },
    {
      id: 2,
      name: "Second Photographer",
      price: "200",
      icon: "Users",
      description: "Допълнителен фотограф за по-голямо покритие и различни ъгли на събитието.",
      features: [
        "Пълно покритие",
        "Различни перспективи",
        "Повече кандидни моменти"
      ]
    },
    {
      id: 3,
      name: "Premium Album",
      price: "400",
      icon: "Book",
      description: "Луксозен фотоалбум с твърди корици и професионален печат на най-добрите снимки.",
      features: [
        "50 страници",
        "Премиум материали",
        "Персонализиран дизайн"
      ]
    },
    {
      id: 4,
      name: "Extended Gallery",
      price: "150",
      icon: "Clock",
      description: "Удължаване на достъпа до онлайн галерията за допълнителни 6 месеца.",
      features: [
        "6 месеца допълнително",
        "Неограничени изтегляния",
        "Споделяне с близки"
      ]
    }
  ];

  // Mock data for value propositions
  const valuePropositions = [
    {
      id: 1,
      title: "Професионално оборудване",
      description: "Използваме най-съвременната техника и оборудване за гарантиране на перфектно качество на всяка снимка.",
      icon: "Camera"
    },
    {
      id: 2,
      title: "Артистична експертиза",
      description: "Над 8 години опит в създаването на емоционални и художествени фотографии, които разказват вашата история.",
      icon: "Palette"
    },
    {
      id: 3,
      title: "Персонализиран подход",
      description: "Всяка сесия е уникална. Работим заедно, за да създадем снимки, които отразяват вашата индивидуалност.",
      icon: "User"
    },
    {
      id: 4,
      title: "Дългосрочна стойност",
      description: "Инвестицията в професионални снимки се увеличава с времето - спомените стават още по-ценни.",
      icon: "TrendingUp"
    }
  ];

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Мария Петрова",
      session: "Сватбена фотосесия",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "Елена улови всеки емоционален момент от нашата сватба. Снимките са като произведения на изкуството - всяка разказва история. Инвестицията си заслужаваше напълно!"
    },
    {
      id: 2,
      name: "Анна Димитрова",
      session: "Бременност",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Професионализмът и вниманието към детайлите на Елена са невероятни. Тя направи фотосесията по време на бременността ми незабравима. Резултатът надмина очакванията ми."
    },
    {
      id: 3,
      name: "Георги Стоянов",
      session: "Семейна фотосесия",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "Като семейство сме много доволни от работата на Елена. Тя успя да улови естествените моменти между нас и създаде спомени, които ще пазим завинаги."
    }
  ];

  const handleSelectPackage = (pkg, type = 'package') => {
    setSelectedPackage(pkg);
    if (type === 'consultation') {
      navigate('/booking', { state: { selectedPackage: pkg, consultationOnly: true } });
    } else {
      navigate('/booking', { state: { selectedPackage: pkg } });
    }
  };

  const handleBookConsultation = () => {
    navigate('/booking', { state: { consultationOnly: true } });
  };

  const handleBookNow = () => {
    navigate('/booking');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Инвестиция в спомени - Elena Rose Photography</title>
        <meta name="description" content="Открийте нашите фотографски пакети и направете инвестиция в запазването на вашите най-ценни моменти. Прозрачно ценообразуване и гъвкави опции за плащане." />
        <meta name="keywords" content="фотография цени, сватбена фотография, семейна фотосесия, инвестиция спомени" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-gallery-canvas to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-sophisticated-dark mb-6">
                Инвестиция в 
                <span className="text-transparent bg-gradient-to-r from-accent to-secondary bg-clip-text"> вечни спомени</span>
              </h1>
              
              <p className="text-lg md:text-xl text-hierarchy-secondary leading-relaxed mb-8 max-w-3xl mx-auto">
                Професионалната фотография е повече от услуга - това е инвестиция в запазването на 
                най-ценните моменти от вашия живот. Всеки пакет е създаден, за да предостави 
                изключително качество и незабравимо изживяване.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
                  onClick={handleBookConsultation}
                >
                  Безплатна консултация
                </Button>
                
                <Button
                  variant="outline"
                  className="elegant-hover"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Разгледайте пакетите
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Promotion */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SeasonalPromotion onBookNow={handleBookNow} />
          </div>
        </section>

        {/* Investment Packages */}
        <section id="packages" className="py-20 bg-warm-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                Изберете вашия пакет
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                Всеки пакет е внимателно създаден, за да отговори на различни нужди и бюджети, 
                като запазва високото качество и професионализъм във всяка услуга.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {packages?.map((pkg, index) => (
                <PackageCard
                  key={pkg?.id}
                  package={pkg}
                  isPopular={index === 1}
                  onSelectPackage={handleSelectPackage}
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-hierarchy-secondary mb-4">
                Не сте сигурни кой пакет е подходящ за вас?
              </p>
              <Button
                variant="outline"
                onClick={handleBookConsultation}
                className="elegant-hover"
              >
                Резервирайте безплатна консултация
              </Button>
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                Допълнителни услуги
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                Персонализирайте вашето изживяване с нашите допълнителни услуги, 
                създадени да обогатят и допълнят основния пакет.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {addOnServices?.map((service) => (
                <AddOnService key={service?.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 bg-gallery-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                Защо да инвестирате в професионална фотография?
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                Разберете стойността зад всяка инвестиция и как професионалната фотография 
                създава дългосрочна стойност за вас и вашето семейство.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuePropositions?.map((proposition) => (
                <ValueProposition key={proposition?.id} proposition={proposition} />
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                Какво включва изживяването?
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                От първоначалната консултация до финалната доставка - ето пълният процес 
                на работа с нас.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Първоначална консултация
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Обсъждаме вашата визия, предпочитания и планираме детайлите на сесията.
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Camera" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Професионална фотосесия
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Използваме най-доброто оборудване и техники за създаване на перфектни снимки.
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Edit" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Професионално редактиране
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Всяка снимка се обработва индивидуално за постигане на най-високо качество.
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Globe" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Онлайн галерия
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Частна, защитена галерия за лесно споделяне и изтегляне на снимките.
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Download" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Високо разделителна способност
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Всички снимки се доставят в пълна резолюция, готови за печат и споделяне.
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="HeadphonesIcon" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  Продължаваща подкрепа
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  Винаги сме на разположение за въпроси и допълнителни услуги.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentOptions onBookConsultation={handleBookConsultation} />
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 bg-gallery-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                Какво казват нашите клиенти
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                Историите на нашите клиенти говорят за стойността на инвестицията в 
                професионална фотография и незабравимите спомени, които създаваме заедно.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials?.map((testimonial) => (
                <TestimonialCard key={testimonial?.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-warm-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
              Готови да направите инвестицията?
            </h2>
            <p className="text-lg text-hierarchy-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
              Нека започнем разговора за вашите мечти и как можем да ги превърнем в 
              красиви, вечни спомени. Първата консултация е винаги безплатна.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                variant="default"
                className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
                onClick={handleBookConsultation}
              >
                Резервирайте консултация
              </Button>
              
              <Button
                variant="outline"
                className="elegant-hover"
                onClick={() => navigate('/gallery')}
              >
                Разгледайте галерията
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-hierarchy-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-accent" />
                <span>100% гаранция за качество</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-accent" />
                <span>Бърза доставка</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Heart" size={16} className="text-accent" />
                <span>Персонализиран подход</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-sophisticated-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Camera" size={20} className="text-sophisticated-dark" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-medium text-lg leading-none">
                    Elena Rose
                  </span>
                  <span className="font-body text-xs text-white/70 leading-none">
                    Photography
                  </span>
                </div>
              </div>
              
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Създаваме красиви спомени, които ще пазите завинаги. 
                Всяка снимка разказва уникална история.
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <a href="mailto:elena@elenarose.bg" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Mail" size={20} />
                </a>
                <a href="tel:+359888123456" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Phone" size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Instagram" size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Facebook" size={20} />
                </a>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-white/50 text-sm">
                  © {new Date()?.getFullYear()} Elena Rose Photography. Всички права запазени.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Investment;