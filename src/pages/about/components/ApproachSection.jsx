import React from 'react';
import Icon from '../../../components/AppIcon';

const ApproachSection = () => {
  const approachPrinciples = [
    {
      icon: "Heart",
      title: "Автентичност",
      description: "Вярвам в улавянето на истински емоции и моменти, не в изкуствени пози. Всяка снимка трябва да разказва истинската ви история."
    },
    {
      icon: "Users",
      title: "Сътрудничество",
      description: "Работя в партньорство с клиентите си, създавайки комфортна атмосфера където можете да бъдете себе си пред камерата."
    },
    {
      icon: "Sparkles",
      title: "Внимание към детайлите",
      description: "От светлината до композицията, всеки елемент е важен за създаването на перфектната снимка."
    },
    {
      icon: "Clock",
      title: "Търпение",
      description: "Най-добрите моменти не могат да бъдат принудени. Чакам подходящия момент за всяка снимка."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Първоначална консултация",
      description: "Запознаваме се и обсъждаме вашите идеи, очаквания и визия за фотосесията.",
      duration: "30-60 мин"
    },
    {
      step: "02", 
      title: "Планиране",
      description: "Избираме локация, обсъждаме стил и подготвяме всички детайли за перфектната сесия.",
      duration: "1-2 седмици"
    },
    {
      step: "03",
      title: "Фотосесията",
      description: "Създаваме магията заедно в релаксирана и творческа атмосфера.",
      duration: "1-4 часа"
    },
    {
      step: "04",
      title: "Обработка",
      description: "Професионално редактиране на снимките с внимание към всеки детайл.",
      duration: "2-3 седмици"
    },
    {
      step: "05",
      title: "Доставка",
      description: "Получавате готовите снимки в онлайн галерия с възможност за печат.",
      duration: "Веднага"
    }
  ];

  return (
    <section className="py-20 bg-warm-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            Моят подход
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            Фотографията е изкуство на емоциите. Моята философия се основава на създаването на 
            автентични връзки и улавянето на истински моменти.
          </p>
        </div>

        {/* Philosophy */}
        <div className="mb-20">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-medium">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-heading text-sophisticated-dark mb-6">
                  Философията ми
                </h3>
                <div className="prose prose-lg text-hierarchy-secondary max-w-none space-y-4">
                  <p>
                    Вярвам, че най-красивите снимки се раждат от истински емоции и автентични моменти. 
                    Не търся перфектни пози, а истински усмивки, естествени жестове и спонтанни реакции.
                  </p>
                  <p>
                    Всеки клиент е уникален, затова и подходът ми е индивидуален. Отделям време да 
                    разбера вашата история, характер и визия, за да създам снимки, които наистина ви представят.
                  </p>
                  <p>
                    Фотографията е не само техника, но и емоционална връзка. Стремя се да създам 
                    комфортна атмосфера, където можете да се чувствате свободни и естествени.
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
            Как работим заедно
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
              Готови ли сте да създадем нещо красиво заедно?
            </h3>
            <p className="text-hierarchy-secondary mb-6 max-w-2xl mx-auto">
              Нека се запознаем и обсъдим как мога да помогна за съхраняването на вашите най-ценни моменти.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-sophisticated-dark text-background px-8 py-3 rounded-full font-sophisticated elegant-hover">
                Резервирайте консултация
              </button>
              <button className="border border-sophisticated-dark text-sophisticated-dark px-8 py-3 rounded-full font-sophisticated elegant-hover">
                Вижте портфолиото
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;