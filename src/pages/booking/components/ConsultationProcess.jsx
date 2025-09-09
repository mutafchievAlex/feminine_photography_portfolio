import React from 'react';
import Icon from '../../../components/AppIcon';

const ConsultationProcess = () => {
  const processSteps = [
    {
      id: 1,
      icon: 'MessageCircle',
      title: 'Първоначален разговор / Initial Conversation',
      description: `Започваме с 30-минутен разговор за вашата визия, очаквания и специални моменти, които искате да запечатаме.\n\nWe start with a 30-minute conversation about your vision, expectations, and special moments you want to capture.`,
      duration: '30 мин / 30 min'
    },
    {
      id: 2,
      icon: 'MapPin',
      title: 'Планиране на локацията / Location Planning',
      description: `Обсъждаме най-подходящите места за вашата фотосесия - студио, природа или специално място с значение за вас.\n\nWe discuss the most suitable locations for your photoshoot - studio, nature, or a special place meaningful to you.`,
      duration: '15 мин / 15 min'
    },
    {
      id: 3,
      icon: 'Palette',
      title: 'Стилизиране и подготовка / Styling & Preparation',
      description: `Получавате персонализиран гид за облекло, аксесоари и подготовка, за да се чувствате уверени и красиви.\n\nYou receive a personalized guide for clothing, accessories, and preparation to feel confident and beautiful.`,
      duration: '10 мин / 10 min'
    },
    {
      id: 4,
      icon: 'Calendar',
      title: 'Финализиране на детайлите / Finalizing Details',
      description: `Уточняваме окончателната дата, час, пакет и всички специални заявки за перфектното изживяване.\n\nWe confirm the final date, time, package, and all special requests for the perfect experience.`,
      duration: '15 мин / 15 min'
    }
  ];

  const whatToExpect = [
    {
      icon: 'Clock',
      title: 'Времетраене / Duration',
      description: 'Консултацията продължава 60-90 минути / Consultation lasts 60-90 minutes'
    },
    {
      icon: 'Video',
      title: 'Формат / Format',
      description: 'Видео разговор или среща в студиото / Video call or studio meeting'
    },
    {
      icon: 'Gift',
      title: 'Безплатно / Complimentary',
      description: 'Консултацията е напълно безплатна / Consultation is completely free'
    },
    {
      icon: 'Heart',
      title: 'Персонализирано / Personalized',
      description: 'Фокус върху вашите уникални нужди / Focus on your unique needs'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Process Overview */}
      <div className="bg-surface-elevation rounded-xl shadow-soft p-6 lg:p-8">
        <div className="text-center mb-8">
          <h3 className="text-elegant text-2xl text-sophisticated-dark mb-3">
            Процесът на консултация / Consultation Process
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary max-w-2xl mx-auto">
            Всяка консултация е внимателно планирана, за да разберем вашата визия и да създадем перфектното изживяване
          </p>
          <p className="text-sophisticated text-hierarchy-secondary max-w-2xl mx-auto mt-2">
            Each consultation is carefully planned to understand your vision and create the perfect experience
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
            Какво да очаквате / What to Expect
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
            Времева линия / Timeline
          </h3>
          <p className="text-sophisticated text-hierarchy-secondary">
            От консултация до готови снимки / From consultation to final images
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-secondary to-accent"></div>
          
          <div className="space-y-6">
            {[
              {
                day: 'Ден 1 / Day 1',
                title: 'Консултация / Consultation',
                description: 'Безплатен разговор и планиране / Free consultation and planning'
              },
              {
                day: 'Ден 7-14 / Day 7-14',
                title: 'Фотосесия / Photoshoot',
                description: 'Професионална фотосесия / Professional photoshoot session'
              },
              {
                day: 'Ден 21-28 / Day 21-28',
                title: 'Галерия / Gallery',
                description: 'Получавате готовите снимки / Receive your finished images'
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