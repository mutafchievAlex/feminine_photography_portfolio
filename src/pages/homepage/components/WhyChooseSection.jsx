import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WhyChooseSection = () => {
  const [language, setLanguage] = useState('bg');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const differentiators = [
    {
      id: 1,
      icon: "Palette",
      title: {
        bg: "Артистична визия",
        en: "Artistic Vision"
      },
      description: {
        bg: "Всяка снимка е създадена с уникален артистичен поглед, който превръща обикновените моменти в изключителни произведения на изкуството.",
        en: "Every photo is created with a unique artistic perspective that transforms ordinary moments into extraordinary works of art."
      },
      testimonial: {
        bg: "Елена има невероятен усет за красота и композиция. Снимките ни са като картини!",
        en: "Elena has an incredible sense of beauty and composition. Our photos are like paintings!",
        author: "Мария Петрова / Maria Petrova"
      }
    },
    {
      id: 2,
      icon: "Award",
      title: {
        bg: "Професионален опит",
        en: "Professional Experience"
      },
      description: {
        bg: "Над 8 години опит в сферата на фотографията с над 200 успешно проведени сесии и множество награди от международни конкурси.",
        en: "Over 8 years of experience in photography with over 200 successful sessions and multiple awards from international competitions."
      },
      testimonial: {
        bg: "Професионализмът на Елена е безупречен. Тя знае точно как да ни накара да се чувстваме комфортно.",
        en: "Elena\'s professionalism is impeccable. She knows exactly how to make us feel comfortable.",
        author: "Димитър Георгиев / Dimitar Georgiev"
      }
    },
    {
      id: 3,
      icon: "Heart",
      title: {
        bg: "Персонализиран подход",
        en: "Personalized Approach"
      },
      description: {
        bg: "Всяка сесия е планирана индивидуално според вашите желания, стил и личност, за да създадем истински автентични спомени.",
        en: "Every session is planned individually according to your desires, style and personality to create truly authentic memories."
      },
      testimonial: {
        bg: "Елена отдели време да ни опознае и резултатът беше перфектен - снимките наистина отразяват нас!",
        en: "Elena took time to get to know us and the result was perfect - the photos truly reflect who we are!",
        author: "Ива Стоянова / Iva Stoyanova"
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-warm-section">
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
            {language === 'bg' ? 'Защо да изберете мен?' : 'Why Choose Me?'}
          </h2>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg' ?'Три основни причини, които правят моята работа специална и различна от останалите фотографи.' :'Three key reasons that make my work special and different from other photographers.'
            }
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {differentiators?.map((item) => (
            <motion.div
              key={item?.id}
              variants={itemVariants}
              className="relative group"
              onMouseEnter={() => setHoveredCard(item?.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Main Card */}
              <div className="bg-white rounded-2xl p-8 shadow-soft elegant-hover h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon 
                    name={item?.icon} 
                    size={28} 
                    className="text-sophisticated-dark" 
                  />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl md:text-2xl text-sophisticated-dark mb-4">
                  {item?.title?.[language]}
                </h3>
                
                <p className="text-hierarchy-secondary font-sophisticated leading-relaxed">
                  {item?.description?.[language]}
                </p>

                {/* Hover Indicator */}
                <div className="mt-6 flex items-center text-accent group-hover:text-sophisticated-dark transition-colors duration-300">
                  <span className="text-sm font-sophisticated mr-2">
                    {language === 'bg' ? 'Виж отзив' : 'View testimonial'}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </div>
              </div>

              {/* Testimonial Overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: hoveredCard === item?.id ? 1 : 0,
                  scale: hoveredCard === item?.id ? 1 : 0.9
                }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 testimonial-overlay rounded-2xl p-8 flex flex-col justify-center ${
                  hoveredCard === item?.id ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="text-center">
                  <Icon name="Quote" size={32} className="text-accent mx-auto mb-4" />
                  
                  <blockquote className="text-sophisticated-dark font-sophisticated text-lg leading-relaxed mb-4">
                    "{item?.testimonial?.[language]}"
                  </blockquote>
                  
                  <cite className="text-hierarchy-secondary font-sophisticated text-sm">
                    — {item?.testimonial?.author}
                  </cite>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="font-sophisticated text-hierarchy-secondary mb-6">
            {language === 'bg' ?'Готови ли сте да създадем нещо красиво заедно?' :'Ready to create something beautiful together?'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/about'}
              className="px-6 py-3 bg-white text-sophisticated-dark rounded-lg font-sophisticated hover:shadow-medium transition-all duration-300"
            >
              <Icon name="User" size={18} className="mr-2 inline" />
              {language === 'bg' ? 'Научете повече за мен' : 'Learn more about me'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/booking'}
              className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-sophisticated-dark rounded-lg font-sophisticated magnetic-hover pulse-cta"
            >
              <Icon name="Calendar" size={18} className="mr-2 inline" />
              {language === 'bg' ? 'Резервирайте сесия' : 'Book a session'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;