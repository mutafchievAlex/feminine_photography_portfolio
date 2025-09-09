import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LocationsSection = () => {
  const favoriteLocations = [
    {
      name: "Стария град, Пловдив",
      description: "Романтичните калдъръмени улички и възрожденската архитектура създават перфектна атмосфера за сватбени и портретни снимки.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Сватби и портрети",
      bestTime: "Златен час"
    },
    {
      name: "Боянската църква, София",
      description: "Историческото наследство и уникалната архитектура правят това място идеално за елегантни фотосесии.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Културни портрети",
      bestTime: "Сутрин"
    },
    {
      name: "Витоша планина",
      description: "Природната красота на планината предлага безкрайни възможности за романтични и приключенски фотосесии.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Природни сесии",
      bestTime: "Изгрев/залез"
    },
    {
      name: "Морската градина, Варна",
      description: "Комбинацията от море, градина и архитектура създава разнообразни възможности за всеки тип фотосесия.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Семейни сесии",
      bestTime: "Следобед"
    },
    {
      name: "Рилски манастир",
      description: "Духовната атмосфера и величествената архитектура правят това място специално за дълбоки, емоционални портрети.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Духовни портрети",
      bestTime: "Рано сутрин"
    },
    {
      name: "Созопол",
      description: "Старинният морски град с каменните къщи и морската романтика е идеален за интимни сватбени сесии.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      specialty: "Морски сватби",
      bestTime: "Залез"
    }
  ];

  const locationServices = [
    {
      icon: "MapPin",
      title: "Локално познание",
      description: "Познавам най-добрите места и времена за снимане в цяла България"
    },
    {
      icon: "Clock",
      title: "Планиране на времето",
      description: "Оптимизирам времето според светлината и атмосферата на всяка локация"
    },
    {
      icon: "Camera",
      title: "Адаптивна техника",
      description: "Използвам подходящо оборудване според спецификите на всяко място"
    },
    {
      icon: "Heart",
      title: "Емоционална връзка",
      description: "Помагам да изберете място, което има специално значение за вас"
    }
  ];

  return (
    <section className="py-20 bg-gallery-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-sophisticated-dark mb-6">
            Любими локации в България
          </h2>
          <p className="text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            Всяко място има своя душа и история. Ето някои от моите любими локации, 
            където създавам най-красивите снимки заедно с клиентите си.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {favoriteLocations?.map((location, index) => (
            <div key={index} className="bg-background rounded-3xl overflow-hidden shadow-medium elegant-hover">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={location?.image}
                  alt={location?.name}
                  className="w-full h-full object-cover gallery-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="text-xl font-heading mb-1">{location?.name}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-white/20 px-2 py-1 rounded-full">
                          {location?.specialty}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Sun" size={16} />
                          <span>{location?.bestTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-hierarchy-secondary">
                  {location?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mb-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-12">
            Как работя с локации
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locationServices?.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <Icon name={service?.icon} size={24} className="text-sophisticated-dark" />
                </div>
                <h4 className="font-heading text-sophisticated-dark mb-3">
                  {service?.title}
                </h4>
                <p className="text-hierarchy-secondary text-sm">
                  {service?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Planning */}
        <div className="bg-warm-section rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-heading text-sophisticated-dark mb-6">
                Планиране на локацията
              </h3>
              <div className="space-y-4 text-hierarchy-secondary">
                <p>
                  Избирането на правилната локация е ключово за успеха на всяка фотосесия. 
                  Работя с вас, за да намерим мястото, което най-добре отговаря на вашата визия и стил.
                </p>
                <p>
                  Имам опит с фотосесии в цяла България - от планински върхове до морски брегове, 
                  от исторически центрове до модерни градски пространства.
                </p>
                <p>
                  За всяка локация подготвям детайлен план, включващ най-добрите времена за снимане, 
                  необходимите разрешения и логистичните детайли.
                </p>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-sophisticated-dark text-background px-6 py-3 rounded-full font-sophisticated elegant-hover">
                  Обсъдете локация
                </button>
                <button className="border border-sophisticated-dark text-sophisticated-dark px-6 py-3 rounded-full font-sophisticated elegant-hover">
                  Вижте галерията
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-medium">
                <Image
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Планиране на фотосесия"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-2xl shadow-strong">
                <div className="text-center">
                  <div className="text-2xl font-heading text-sophisticated-dark">50+</div>
                  <div className="text-sm text-hierarchy-secondary">Локации</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-heading text-sophisticated-dark text-center mb-8">
            Покритие в България
          </h3>
          
          <div className="bg-background rounded-2xl p-6 shadow-medium">
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Покритие в България"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=42.7339,25.4858&z=7&output=embed"
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-hierarchy-secondary">
                Работя в цяла България. За локации извън София се прилага допълнителна такса за пътуване.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;