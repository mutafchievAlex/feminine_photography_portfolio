import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentStories = () => {
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const stories = [
    {
      id: 1,
      title: {
        bg: "Мария и Петър - Сватбена приказка",
        en: "Maria & Peter - Wedding Fairytale"
      },
      description: {
        bg: `Една магична есенна сватба в сърцето на Витоша планина. Мария и Петър избраха да отпразнуват любовта си сред златистите листа и топлата светлина на залязващото слънце.\n\nВсеки кадър разказва история за нежност, радост и обещания за бъдещето.`,
        en: `A magical autumn wedding in the heart of Vitosha mountain. Maria and Peter chose to celebrate their love among golden leaves and the warm light of the setting sun.\n\nEvery frame tells a story of tenderness, joy and promises for the future.`
      },
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "wedding",
      date: "2024-08-15",
      location: "Витоша / Vitosha"
    },
    {
      id: 2,
      title: {
        bg: "Елена - Очакване на чудото",
        en: "Elena - Expecting the Miracle"
      },
      description: {
        bg: `Нежна матернити сесия в златния час на деня. Елена сияеше от щастие, докато очакваше пристигането на своето първо дете.\n\nТези моменти на предвкусване и любов са безценни спомени за цялото семейство.`,
        en: `A tender maternity session during the golden hour. Elena glowed with happiness while awaiting the arrival of her first child.\n\nThese moments of anticipation and love are priceless memories for the whole family.`
      },
      image: "https://images.pexels.com/photos/1556652/pexels-photo-1556652.jpeg?auto=compress&cs=tinysrgb&w=2000&q=80",
      category: "maternity",
      date: "2024-08-20",
      location: "Борисова градина / Borisova Garden"
    },
    {
      id: 3,
      title: {
        bg: "Семейство Георгиеви - Есенни спомени",
        en: "The Georgiev Family - Autumn Memories"
      },
      description: {
        bg: `Игрива семейна сесия в парка с малката Ана и нейните родители. Смехът, прегръдките и естествените моменти създадоха перфектния портрет на семейното щастие.\n\nТези кадри ще бъдат съкровище за години напред.`,
        en: `A playful family session in the park with little Ana and her parents. Laughter, hugs and natural moments created the perfect portrait of family happiness.\n\nThese frames will be treasured for years to come.`
      },
      image: "https://images.pixabay.com/photo/2016/11/29/20/22/family-1871178_1280.jpg?auto=compress&cs=tinysrgb&w=2000&q=80",
      category: "family",
      date: "2024-08-25",
      location: "Южен парк / South Park"
    },
    {
      id: 4,
      title: {
        bg: "Димитър и Ива - Годежна сесия",
        en: "Dimitar & Iva - Engagement Session"
      },
      description: {
        bg: `Романтична годежна сесия в старата част на София. Димитър и Ива споделиха своята история на любов сред калдъръмените улички и историческите сгради.\n\nВсеки поглед и усмивка говореха за дълбоката им връзка.`,
        en: `A romantic engagement session in the old part of Sofia. Dimitar and Iva shared their love story among cobblestone streets and historic buildings.\n\nEvery glance and smile spoke of their deep connection.`
      },
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "engagement",
      date: "2024-08-28",
      location: "Стария град / Old Town"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gallery-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sophisticated-dark mb-6">
            {language === 'bg' ? 'Последни истории' : 'Recent Stories'}
          </h2>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg' ?'Всяка сесия е уникална история, пълна с емоции и спомени. Разгледайте някои от най-новите ми творения и се вдъхновете за вашата собствена фотосесия.' :'Every session is a unique story full of emotions and memories. Browse some of my latest creations and get inspired for your own photo session.'
            }
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {stories?.slice(0, 4)?.map((story, index) => (
            <motion.article
              key={story?.id}
              variants={itemVariants}
              className={`group ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-12'}`}
            >
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden elegant-hover">
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={story?.image}
                    alt={story?.title?.[language]}
                    className="w-full h-full object-cover gallery-image"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-sophisticated text-sophisticated-dark">
                      {story?.category?.charAt(0)?.toUpperCase() + story?.category?.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <Icon name="MapPin" size={16} />
                      <span className="font-sophisticated">{story?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl md:text-2xl text-sophisticated-dark">
                      {story?.title?.[language]}
                    </h3>
                    <span className="text-sm text-hierarchy-secondary font-sophisticated">
                      {new Date(story.date)?.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US')}
                    </span>
                  </div>
                  
                  <p className="text-hierarchy-secondary font-sophisticated leading-relaxed mb-6 whitespace-pre-line">
                    {story?.description?.[language]}
                  </p>

                  <Button
                    variant="outline"
                    className="group-hover:bg-accent group-hover:border-accent group-hover:text-sophisticated-dark transition-all duration-300"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    {language === 'bg' ? 'Виж повече' : 'View More'}
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            variant="default"
            className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark px-8 py-3 text-lg magnetic-hover pulse-cta"
            onClick={() => window.location.href = '/gallery'}
          >
            <Icon name="Camera" size={20} className="mr-2" />
            {language === 'bg' ? 'Разгледай всички истории' : 'View All Stories'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentStories;