import React from 'react';
import Image from '../../../components/AppImage';

const StorySection = () => {
  const storyMilestones = [
    {
      year: "2016",
      title: "Началото на пътешествието",
      description: "Започнах фотографията като хоби, вдъхновена от красотата на българската природа и културно наследство."
    },
    {
      year: "2018",
      title: "Първа професионална сватба",
      description: "Заснех първата си сватба в Пловдив - момент, който промени живота ми и ме насочи към професионалната фотография."
    },
    {
      year: "2020",
      title: "Създаване на студио",
      description: "Отворих собственото си студио в София, специализирано в интимни портретни сесии и семейна фотография."
    },
    {
      year: "2022",
      title: "Международно признание",
      description: "Получих първата си международна награда за сватбена фотография от European Photography Awards."
    },
    {
      year: "2024",
      title: "Нови хorizontи",
      description: "Разширих услугите си с корпоративна фотография и започнах да преподавам фотографски уъркшопи."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            Моята история
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            Всяка снимка разказва история. Ето моята - пътешествие от страст към професия, 
            от първи кадри до признание в света на фотографията.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Story Content */}
          <div className="space-y-8">
            <div className="prose prose-lg text-hierarchy-secondary max-w-none">
              <p>
                Фотографията влезе в живота ми по най-естествения начин - през любовта към красотата 
                и желанието да съхранявам моменти. Израснала в малко градче край Пловдив, винаги съм 
                била очарована от светлината и сенките, от начина, по който те преобразяват обикновените 
                неща в нещо магично.
              </p>
              <p>
                Първата ми камера беше подарък за 18-ия ми рожден ден. Тогава не знаех, че този малък 
                апарат ще промени цялата ми съдба. Започнах да снимам всичко - от семейни събирания до 
                пейзажи, от портрети на приятели до детайли от ежедневието.
              </p>
              <p>
                Преломният момент дойде през 2018 година, когато приятелка ме помоли да заснема сватбата ѝ. 
                Този ден разбрах, че фотографията не е просто хоби за мен - тя е призвание. Видях как 
                моите снимки могат да пренесат емоции, да разкажат истории и да съхранят най-ценните моменти.
              </p>
            </div>

            {/* Personal Touch */}
            <div className="bg-warm-section p-6 rounded-2xl">
              <h3 className="text-xl font-heading text-sophisticated-dark mb-4">
                Защо избрах фотографията?
              </h3>
              <p className="text-hierarchy-secondary">
                "Вярвам, че всеки момент е уникален и неповторим. Моята роля е да улавям тези мимолетни 
                мгновения и да ги превръщам в спомени, които ще останат завинаги. Фотографията ми позволява 
                да бъда част от най-важните дни в живота на хората."
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading text-sophisticated-dark mb-8">
              Ключови моменти
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent"></div>
              
              {storyMilestones?.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6 pb-8">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-sm font-sophisticated text-sophisticated-dark">
                      {milestone?.year?.slice(-2)}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-elevation p-6 rounded-xl shadow-soft elegant-hover">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-sophisticated text-accent">
                          {milestone?.year}
                        </span>
                      </div>
                      <h4 className="text-lg font-heading text-sophisticated-dark mb-2">
                        {milestone?.title}
                      </h4>
                      <p className="text-hierarchy-secondary text-sm">
                        {milestone?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behind the Scenes Images */}
        <div className="mt-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Зад кулисите
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Работа в студиото"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">В студиото</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1554048612-b6a482b224b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Сватбена фотосесия"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">На сватба</p>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-medium elegant-hover">
              <Image
                src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Външна фотосесия"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-sophisticated">На локация</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;