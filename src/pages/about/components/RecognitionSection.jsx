import React from 'react';
import Icon from '../../../components/AppIcon';


const RecognitionSection = () => {
  const awards = [
    {
      year: "2024",
      title: "Photographer of the Year",
      organization: "Bulgarian Wedding Photography Association",
      category: "Сватбена фотография"
    },
    {
      year: "2023",
      title: "Excellence in Portrait Photography",
      organization: "European Photography Awards",
      category: "Портретна фотография"
    },
    {
      year: "2023",
      title: "Best Newcomer",
      organization: "International Wedding Photography Awards",
      category: "Международно признание"
    },
    {
      year: "2022",
      title: "Creative Vision Award",
      organization: "Sofia Photography Festival",
      category: "Творческа фотография"
    }
  ];

  const publications = [
    {
      title: "Сватба & Стил",
      description: "Интервю за тенденциите в сватбената фотография",
      date: "Март 2024"
    },
    {
      title: "Bulgarian Photography Magazine",
      description: "Портфолио представяне - 8 страници",
      date: "Януари 2024"
    },
    {
      title: "Wedding Bells Bulgaria",
      description: "Топ 10 сватбени фотографи в България",
      date: "Декември 2023"
    }
  ];

  const certifications = [
    {
      title: "Professional Wedding Photography",
      institution: "New York Institute of Photography",
      year: "2023"
    },
    {
      title: "Advanced Portrait Lighting",
      institution: "CreativeLive",
      year: "2022"
    },
    {
      title: "Business of Photography",
      institution: "Photography Business Institute",
      year: "2021"
    }
  ];

  const testimonialHighlights = [
    {
      quote: "Елена улови всички емоции от нашия специален ден. Снимките са като от приказка!",
      author: "Мария и Петър",
      occasion: "Сватба в Пловдив"
    },
    {
      quote: "Професионализмът и творческият подход на Елена надминаха всичките ни очаквания.",
      author: "Анна Георгиева",
      occasion: "Семейна фотосесия"
    },
    {
      quote: "Работата с Елена беше удоволствие. Тя знае как да те накара да се чувстваш комфортно.",
      author: "Димитър Стоянов",
      occasion: "Корпоративни портрети"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            Признание и постижения
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            Благодарна съм за признанието, което получавам от колеги и клиенти. 
            Всяка награда е мотивация да продължавам да се развивам и да създавам още по-красиви снимки.
          </p>
        </div>

        {/* Awards Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Награди и отличия
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {awards?.map((award, index) => (
              <div key={index} className="bg-surface-elevation p-6 rounded-2xl shadow-soft elegant-hover">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                      <Icon name="Award" size={24} className="text-sophisticated-dark" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-sophisticated text-accent">{award?.year}</span>
                      <span className="text-xs text-hierarchy-secondary">•</span>
                      <span className="text-xs text-hierarchy-secondary">{award?.category}</span>
                    </div>
                    <h4 className="text-lg font-heading text-sophisticated-dark mb-2">
                      {award?.title}
                    </h4>
                    <p className="text-hierarchy-secondary text-sm">
                      {award?.organization}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publications & Media */}
        <div className="mb-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Публикации и медии
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {publications?.map((publication, index) => (
              <div key={index} className="bg-warm-section p-6 rounded-2xl shadow-soft elegant-hover">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="BookOpen" size={20} className="text-accent" />
                  <span className="text-sm font-sophisticated text-accent">{publication?.date}</span>
                </div>
                <h4 className="text-lg font-heading text-sophisticated-dark mb-3">
                  {publication?.title}
                </h4>
                <p className="text-hierarchy-secondary text-sm">
                  {publication?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="mb-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Образование и сертификати
          </h3>
          
          <div className="bg-feminine-accent p-8 rounded-3xl">
            <div className="grid md:grid-cols-3 gap-8">
              {certifications?.map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <Icon name="GraduationCap" size={24} className="text-sophisticated-dark" />
                  </div>
                  <h4 className="font-heading text-sophisticated-dark mb-2">
                    {cert?.title}
                  </h4>
                  <p className="text-sm text-hierarchy-secondary mb-1">
                    {cert?.institution}
                  </p>
                  <p className="text-xs text-accent font-sophisticated">
                    {cert?.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Какво казват клиентите
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonialHighlights?.map((testimonial, index) => (
              <div key={index} className="bg-background p-6 rounded-2xl shadow-medium elegant-hover">
                <div className="mb-4">
                  <Icon name="Quote" size={32} className="text-accent" />
                </div>
                <blockquote className="text-hierarchy-secondary mb-6 italic">
                  "{testimonial?.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="font-sophisticated text-sophisticated-dark">
                    {testimonial?.author}
                  </p>
                  <p className="text-sm text-hierarchy-secondary">
                    {testimonial?.occasion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Memberships */}
        <div className="text-center">
          <h3 className="text-2xl font-heading text-sophisticated-dark mb-8">
            Професионални членства
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-elevation rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Camera" size={24} className="text-sophisticated-dark" />
              </div>
              <p className="text-xs text-hierarchy-secondary">BWPA</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-elevation rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Users" size={24} className="text-sophisticated-dark" />
              </div>
              <p className="text-xs text-hierarchy-secondary">WPJA</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-elevation rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Globe" size={24} className="text-sophisticated-dark" />
              </div>
              <p className="text-xs text-hierarchy-secondary">ISPWP</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-surface-elevation rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Star" size={24} className="text-sophisticated-dark" />
              </div>
              <p className="text-xs text-hierarchy-secondary">PPA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecognitionSection;