import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InstagramFeed = () => {
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      caption: {
        bg: "Зад кулисите от днешната сватбена сесия ✨ Магията се случва в най-неочакваните моменти",
        en: "Behind the scenes from today\'s wedding session ✨ Magic happens in the most unexpected moments"
      },
      likes: 234,
      comments: 18,
      timestamp: "2024-08-29T14:30:00Z"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=2000&q=80",
      caption: {
        bg: "Златният час винаги създава най-красивата светлина за портрети 🌅",
        en: "Golden hour always creates the most beautiful light for portraits 🌅"
      },
      likes: 189,
      comments: 12,
      timestamp: "2024-08-28T18:45:00Z"
    },
    {
      id: 3,
      image: "https://images.pixabay.com/photo/2016/03/27/07/32/woman-1282330_1280.jpg?auto=compress&cs=tinysrgb&w=2000&q=80",
      caption: {
        bg: "Подготовка за матернити сесия - всеки детайл има значение 💕",
        en: "Preparing for maternity session - every detail matters 💕"
      },
      likes: 156,
      comments: 8,
      timestamp: "2024-08-27T10:15:00Z"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80",
      caption: {
        bg: "Любовта е в детайлите... и в поглядите 👰‍♀️💍",
        en: "Love is in the details... and in the glances 👰‍♀️💍"
      },
      likes: 312,
      comments: 25,
      timestamp: "2024-08-26T16:20:00Z"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      caption: {
        bg: "Семейните моменти са най-ценните съкровища 👨‍👩‍👧‍👦",
        en: "Family moments are the most precious treasures 👨‍👩‍👧‍👦"
      },
      likes: 198,
      comments: 14,
      timestamp: "2024-08-25T12:00:00Z"
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=2000&q=80",
      caption: {
        bg: "Моята работна станция днес - природата е най-добрата студия 🌿",
        en: "My workspace today - nature is the best studio 🌿"
      },
      likes: 145,
      comments: 9,
      timestamp: "2024-08-24T09:30:00Z"
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (language === 'bg') {
      if (diffInHours < 1) return 'преди малко';
      if (diffInHours < 24) return `преди ${diffInHours}ч`;
      const days = Math.floor(diffInHours / 24);
      return `преди ${days}д`;
    } else {
      if (diffInHours < 1) return 'just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="py-20 bg-surface-elevation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Icon name="Instagram" size={32} className="text-accent" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sophisticated-dark">
              @elenarose_photography
            </h2>
          </div>
          <p className="font-sophisticated text-lg text-hierarchy-secondary max-w-3xl mx-auto">
            {language === 'bg' ?'Следете ме в Instagram за ежедневни вдъхновения, зад кулисите моменти и най-новите ми творения.' :'Follow me on Instagram for daily inspiration, behind-the-scenes moments and my latest creations.'
            }
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {instagramPosts?.map((post) => (
            <motion.article
              key={post?.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-soft overflow-hidden elegant-hover"
            >
              {/* Post Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={post?.image}
                  alt="Instagram post"
                  className="w-full h-full object-cover gallery-image"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center space-x-2">
                      <Icon name="Heart" size={20} />
                      <span className="font-sophisticated">{post?.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MessageCircle" size={20} />
                      <span className="font-sophisticated">{post?.comments}</span>
                    </div>
                  </div>
                </div>

                {/* Instagram Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="Instagram" size={16} className="text-sophisticated-dark" />
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                      <Icon name="Camera" size={16} className="text-sophisticated-dark" />
                    </div>
                    <div>
                      <p className="font-sophisticated font-medium text-sophisticated-dark text-sm">
                        elenarose_photography
                      </p>
                      <p className="text-xs text-hierarchy-secondary">
                        {formatTimeAgo(post?.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sophisticated-dark font-sophisticated text-sm leading-relaxed line-clamp-3">
                  {post?.caption?.[language]}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                      <Icon name="Heart" size={16} />
                      <span className="text-sm font-sophisticated">{post?.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                      <Icon name="MessageCircle" size={16} />
                      <span className="text-sm font-sophisticated">{post?.comments}</span>
                    </button>
                  </div>
                  <button className="text-hierarchy-secondary hover:text-accent transition-colors duration-300">
                    <Icon name="Share" size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            variant="default"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-lg magnetic-hover pulse-cta"
            onClick={() => window.open('https://instagram.com/elenarose_photography', '_blank')}
          >
            <Icon name="Instagram" size={20} className="mr-2" />
            {language === 'bg' ? 'Последвай в Instagram' : 'Follow on Instagram'}
          </Button>

          <p className="mt-4 text-hierarchy-secondary font-sophisticated">
            {language === 'bg' ?'Присъединете се към 12.5К последователи' :'Join 12.5K followers'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;