import React, { useEffect, useMemo, useState } from 'react';
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
import usePackages from '../../hooks/usePackages';
import useAddOnServices from '../../hooks/useAddOnServices';
import useTestimonials from '../../hooks/useTestimonials';

const Investment = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const packageOptions = useMemo(
    () => ({ limit: 3, locale: language, currency: 'BGN' }),
    [language]
  );

  const addOnOptions = useMemo(
    () => ({ limit: 6, locale: language, currency: 'BGN' }),
    [language]
  );

  const testimonialOptions = useMemo(
    () => ({ limit: 6, locale: language }),
    [language]
  );

  const {
    packages: packagesData,
    isLoading: isPackagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = usePackages(packageOptions);

  const {
    addOnServices: addOnServicesData,
    isLoading: isAddOnsLoading,
    error: addOnsError,
    refetch: refetchAddOns,
  } = useAddOnServices(addOnOptions);

  const {
    testimonials: testimonialsData,
    isLoading: isTestimonialsLoading,
    error: testimonialsError,
    refetch: refetchTestimonials,
  } = useTestimonials(testimonialOptions);

  const localizeContent = (value) => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    }

    if (typeof value === 'object') {
      const localized =
        value?.[language] ??
        value?.value ??
        value?.text ??
        value?.description ??
        value?.label ??
        value?.name ??
        value?.title ??
        value?.content ??
        value?.message;

      if (localized !== undefined) {
        if (typeof localized === 'string' || typeof localized === 'number') {
          return localized.toString();
        }
      }

      const firstPrimitive = Object.values(value).find(
        (entry) => typeof entry === 'string' || typeof entry === 'number'
      );

      if (firstPrimitive !== undefined) {
        return firstPrimitive.toString();
      }
    }

    return '';
  };

  const toArray = (value) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return value
        .split(/\r?\n|\u2022|,/)
        .map((item) => item.replace(/^[\s\u2022-]+/, '').trim())
        .filter(Boolean);
    }

    if (typeof value === 'object') {
      if (Array.isArray(value?.items)) {
        return value.items;
      }

      if (Array.isArray(value?.data)) {
        return value.data;
      }

      return Object.values(value);
    }

    return [];
  };

  const normalizeFeatureList = (value) =>
    toArray(value)
      .map((feature) => {
        if (feature === null || feature === undefined) {
          return '';
        }

        if (typeof feature === 'string' || typeof feature === 'number') {
          return feature.toString();
        }

        return localizeContent(feature);
      })
      .filter(Boolean);

  const parsePrice = (input) => {
    if (input === null || input === undefined) {
      return '';
    }

    if (typeof input === 'number') {
      return input % 1 === 0 ? input.toString() : input.toFixed(2);
    }

    if (typeof input === 'string') {
      const trimmed = input.trim();

      if (!trimmed) {
        return '';
      }

      const numericPortion = trimmed.replace(/[^0-9.,]/g, '');
      return numericPortion || trimmed;
    }

    if (typeof input === 'object') {
      const value =
        input?.[language] ??
        input?.amount ??
        input?.value ??
        input?.price ??
        input?.amountValue ??
        (typeof input?.amountCents === 'number'
          ? input.amountCents / 100
          : undefined) ??
        input?.display ??
        input?.formatted;

      if (value !== undefined) {
        return parsePrice(value);
      }

      const firstPrimitive = Object.values(input).find(
        (entry) => typeof entry === 'string' || typeof entry === 'number'
      );

      if (firstPrimitive !== undefined) {
        return parsePrice(firstPrimitive);
      }
    }

    return '';
  };

  const packages = useMemo(() => {
    const rawPackages = Array.isArray(packagesData)
      ? packagesData
      : packagesData?.items ??
        packagesData?.data ??
        packagesData?.results ??
        packagesData?.packages ??
        packagesData?.records ??
        [];

    return (
      rawPackages
        ?.map((pkg, index) => {
          if (!pkg) {
            return null;
          }

          const normalizedFeatures = normalizeFeatureList(
            pkg?.features ??
              pkg?.includedServices ??
              pkg?.benefits ??
              pkg?.highlights ??
              pkg?.details ??
              pkg?.points
          );

          const priceValue = parsePrice(
            pkg?.price ??
              pkg?.amount ??
              pkg?.priceValue ??
              pkg?.priceAmount ??
              pkg?.price?.amount ??
              pkg?.price?.value ??
              pkg?.pricing ??
              pkg?.amountValue
          );

          return {
            id: pkg?.id ?? pkg?.packageId ?? pkg?.slug ?? pkg?.uuid ?? `package-${index}`,
            name:
              localizeContent(pkg?.name ?? pkg?.title) ||
              (language === 'bg' ? 'Фотографски пакет' : 'Photography Package'),
            subtitle: localizeContent(
              pkg?.subtitle ??
                pkg?.tagline ??
                pkg?.label ??
                pkg?.categoryLabel ??
                pkg?.category
            ),
            price: priceValue,
            description: localizeContent(
              pkg?.description ?? pkg?.summary ?? pkg?.detailsText ?? pkg?.content
            ),
            features: normalizedFeatures,
          };
        })
        ?.filter((pkg) => pkg?.id)
    ) ?? [];
  }, [packagesData, language]);

  const addOnServices = useMemo(() => {
    const rawAddOns = Array.isArray(addOnServicesData)
      ? addOnServicesData
      : addOnServicesData?.items ??
        addOnServicesData?.data ??
        addOnServicesData?.addOns ??
        addOnServicesData?.services ??
        addOnServicesData?.results ??
        [];

    return (
      rawAddOns
        ?.map((service, index) => {
          if (!service) {
            return null;
          }

          return {
            id:
              service?.id ??
              service?.serviceId ??
              service?.slug ??
              service?.uuid ??
              `add-on-${index}`,
            name:
              localizeContent(service?.name ?? service?.title) ||
              (language === 'bg' ? 'Допълнителна услуга' : 'Add-on Service'),
            price: parsePrice(
              service?.price ??
                service?.amount ??
                service?.priceValue ??
                service?.price?.amount ??
                service?.price?.value
            ),
            icon:
              service?.icon ??
              service?.iconName ??
              service?.iconKey ??
              service?.icon_id ??
              'Sparkles',
            description: localizeContent(
              service?.description ?? service?.summary ?? service?.details
            ),
            features: normalizeFeatureList(
              service?.features ??
                service?.highlights ??
                service?.benefits ??
                service?.detailsList
            ),
          };
        })
        ?.filter((service) => service?.id)
    ) ?? [];
  }, [addOnServicesData, language]);

  const testimonials = useMemo(() => {
    const rawTestimonials = Array.isArray(testimonialsData)
      ? testimonialsData
      : testimonialsData?.items ??
        testimonialsData?.data ??
        testimonialsData?.testimonials ??
        testimonialsData?.results ??
        [];

    return (
      rawTestimonials
        ?.map((testimonial, index) => {
          if (!testimonial) {
            return null;
          }

          const quote = localizeContent(
            testimonial?.quote ??
              testimonial?.testimonial ??
              testimonial?.feedback ??
              testimonial?.message ??
              testimonial?.review
          );

          if (!quote) {
            return null;
          }

          return {
            id:
              testimonial?.id ??
              testimonial?.testimonialId ??
              testimonial?.slug ??
              testimonial?.uuid ??
              `testimonial-${index}`,
            name:
              localizeContent(
                testimonial?.name ??
                  testimonial?.client ??
                  testimonial?.clientName ??
                  testimonial?.author
              ) || (language === 'bg' ? 'Клиент' : 'Client'),
            session: localizeContent(
              testimonial?.session ??
                testimonial?.service ??
                testimonial?.shootType ??
                testimonial?.category ??
                testimonial?.event
            ),
            avatar:
              testimonial?.avatar ??
              testimonial?.photo ??
              testimonial?.image ??
              testimonial?.imageUrl ??
              testimonial?.avatarUrl ??
              testimonial?.clientImage ??
              '/assets/images/no_image.png',
            quote,
          };
        })
        ?.filter((testimonial) => testimonial?.id)
    ) ?? [];
  }, [testimonialsData, language]);

  const packageSkeletons = useMemo(() => Array.from({ length: 3 }), []);
  const addOnSkeletons = useMemo(() => Array.from({ length: 4 }), []);
  const testimonialSkeletons = useMemo(() => Array.from({ length: 3 }), []);

  // Value propositions remain static content on the page
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
              {isPackagesLoading && (
                <>
                  {packageSkeletons.map((_, index) => (
                    <div
                      key={`package-skeleton-${index}`}
                      className="bg-surface-elevation rounded-2xl p-8 shadow-soft animate-pulse space-y-6"
                    >
                      <div className="h-6 w-1/2 bg-white/10 rounded" />
                      <div className="h-4 w-2/3 bg-white/10 rounded" />
                      <div className="h-10 w-32 bg-white/10 rounded" />
                      <div className="space-y-2 pt-2">
                        {Array.from({ length: 6 }).map((__, featureIndex) => (
                          <div key={featureIndex} className="h-4 w-full bg-white/10 rounded" />
                        ))}
                      </div>
                      <div className="h-10 w-full bg-white/10 rounded-full" />
                      <div className="h-10 w-full bg-white/10 rounded-full" />
                    </div>
                  ))}
                </>
              )}

              {!isPackagesLoading && packagesError && (
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      Не успяхме да заредим пакетите
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Проверете връзката си с интернет и опитайте отново след малко.
                    </p>
                    <Button variant="outline" onClick={refetchPackages} className="elegant-hover">
                      <Icon name="RefreshCcw" size={16} className="mr-2" />
                      Опитай отново
                    </Button>
                  </div>
                </div>
              )}

              {!isPackagesLoading && !packagesError && packages?.length === 0 && (
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="Package" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      Скоро ще добавим нови пакети
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Свържете се с нас за персонализирана оферта или запазете безплатна консултация.
                    </p>
                    <Button variant="ghost" onClick={handleBookConsultation} className="elegant-hover">
                      Резервирайте консултация
                    </Button>
                  </div>
                </div>
              )}

              {!isPackagesLoading && !packagesError &&
                packages?.map((pkg, index) => (
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
              {isAddOnsLoading && (
                <>
                  {addOnSkeletons.map((_, index) => (
                    <div
                      key={`add-on-skeleton-${index}`}
                      className="bg-surface-elevation rounded-xl p-6 animate-pulse space-y-4"
                    >
                      <div className="h-10 w-10 bg-white/10 rounded-full" />
                      <div className="h-5 w-2/3 bg-white/10 rounded" />
                      <div className="h-4 w-1/3 bg-white/10 rounded" />
                      <div className="space-y-2 pt-2">
                        {Array.from({ length: 3 }).map((__, featureIndex) => (
                          <div key={featureIndex} className="h-3 w-full bg-white/10 rounded" />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!isAddOnsLoading && addOnsError && (
                <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      Не успяхме да заредим допълнителните услуги
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Моля, опитайте отново след кратка пауза или се свържете с нас за повече информация.
                    </p>
                    <Button variant="outline" onClick={refetchAddOns} className="elegant-hover">
                      <Icon name="RefreshCcw" size={16} className="mr-2" />
                      Опитай отново
                    </Button>
                  </div>
                </div>
              )}

              {!isAddOnsLoading && !addOnsError && addOnServices?.length === 0 && (
                <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="Puzzle" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      В момента няма допълнителни услуги
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Свържете се с нас, за да изградим пакет, който отговаря на вашите нужди.
                    </p>
                  </div>
                </div>
              )}

              {!isAddOnsLoading && !addOnsError &&
                addOnServices?.map((service) => (
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
              {isTestimonialsLoading && (
                <>
                  {testimonialSkeletons.map((_, index) => (
                    <div
                      key={`testimonial-skeleton-${index}`}
                      className="bg-surface-elevation rounded-xl p-8 shadow-soft animate-pulse space-y-4"
                    >
                      <div className="flex space-x-2">
                        {Array.from({ length: 5 }).map((__, starIndex) => (
                          <div key={starIndex} className="h-4 w-4 bg-white/10 rounded" />
                        ))}
                      </div>
                      <div className="h-16 w-full bg-white/10 rounded" />
                      <div className="flex items-center space-x-4 pt-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/2 bg-white/10 rounded" />
                          <div className="h-3 w-1/3 bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!isTestimonialsLoading && testimonialsError && (
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="AlertTriangle" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      Не успяхме да заредим отзивите
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Рефрешнете страницата или опитайте отново по-късно. Благодарим за търпението!
                    </p>
                    <Button variant="outline" onClick={refetchTestimonials} className="elegant-hover">
                      <Icon name="RefreshCcw" size={16} className="mr-2" />
                      Опитай отново
                    </Button>
                  </div>
                </div>
              )}

              {!isTestimonialsLoading && !testimonialsError && testimonials?.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-soft p-10 text-center space-y-4">
                    <Icon name="MessageCircle" size={36} className="mx-auto text-accent" />
                    <h3 className="font-heading text-2xl text-sophisticated-dark">
                      Първите истории тепърва предстоят
                    </h3>
                    <p className="text-hierarchy-secondary font-sophisticated">
                      Бъдете сред първите, които ще споделят своя опит с Elena Rose Photography.
                    </p>
                  </div>
                </div>
              )}

              {!isTestimonialsLoading && !testimonialsError &&
                testimonials?.map((testimonial) => (
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