import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const [language, setLanguage] = useState('bg');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'bg';
    setLanguage(savedLanguage);
  }, []);

  const currentYear = new Date()?.getFullYear();

  const footerSections = {
    services: {
      title: {
        bg: 'Услуги',
        en: 'Services'
      },
      links: [
        { name: { bg: 'Сватбена фотография', en: 'Wedding Photography' }, path: '/gallery' },
        { name: { bg: 'Портретна фотография', en: 'Portrait Photography' }, path: '/gallery' },
        { name: { bg: 'Матернити сесии', en: 'Maternity Sessions' }, path: '/gallery' },
        { name: { bg: 'Семейна фотография', en: 'Family Photography' }, path: '/gallery' },
        { name: { bg: 'Корпоративни портрети', en: 'Corporate Portraits' }, path: '/gallery' }
      ]
    },
    company: {
      title: {
        bg: 'Компания',
        en: 'Company'
      },
      links: [
        { name: { bg: 'За мен', en: 'About Me' }, path: '/about' },
        { name: { bg: 'Моята история', en: 'My Story' }, path: '/about' },
        { name: { bg: 'Цени и пакети', en: 'Pricing & Packages' }, path: '/investment' },
        { name: { bg: 'Резервация', en: 'Booking' }, path: '/booking' },
        { name: { bg: 'Контакти', en: 'Contact' }, path: '/about' }
      ]
    },
    resources: {
      title: {
        bg: 'Ресурси',
        en: 'Resources'
      },
      links: [
        { name: { bg: 'Подготовка за сесия', en: 'Session Preparation' }, path: '/about' },
        { name: { bg: 'Стилни съвети', en: 'Style Tips' }, path: '/about' },
        { name: { bg: 'Често задавани въпроси', en: 'FAQ' }, path: '/about' },
        { name: { bg: 'Клиентски отзиви', en: 'Client Reviews' }, path: '/about' },
        { name: { bg: 'Блог', en: 'Blog' }, path: '/about' }
      ]
    }
  };

  const socialLinks = [
    { name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/elenarose_photography' },
    { name: 'Facebook', icon: 'Facebook', url: 'https://facebook.com/elenarose.photography' },
    { name: 'Pinterest', icon: 'Image', url: 'https://pinterest.com/elenarose_photography' },
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/in/elena-rose-photographer' }
  ];

  const handleNewsletterSubmit = (e) => {
    e?.preventDefault();
    // Mock newsletter subscription
    if (email) {
      alert(language === 'bg' ?'Благодарим ви! Успешно се абонирахте за нашия бюлетин.' :'Thank you! You have successfully subscribed to our newsletter.'
      );
      setEmail('');
    }
  };

  return (
    <footer className="bg-sophisticated-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="font-heading text-2xl md:text-3xl mb-4">
              {language === 'bg' ?'Останете в крак с най-новото' :'Stay Updated with the Latest'
              }
            </h3>
            <p className="font-sophisticated text-white/80 mb-8">
              {language === 'bg' ?'Получавайте вдъхновения, съвети за фотография и специални оферти директно в пощенската си кутия.' :'Get inspiration, photography tips and special offers delivered straight to your inbox.'
              }
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  placeholder={language === 'bg' ? 'Вашият имейл адрес' : 'Your email address'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent focus:bg-white/20 transition-all duration-300"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark px-6 py-3 magnetic-hover"
              >
                <Icon name="Mail" size={16} className="mr-2" />
                {language === 'bg' ? 'Абонирай се' : 'Subscribe'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/homepage" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Camera" size={24} className="text-sophisticated-dark" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-sophisticated-dark"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-medium text-xl text-white leading-none">
                  Elena Rose
                </span>
                <span className="font-body text-sm text-white/70 leading-none">
                  Photography
                </span>
              </div>
            </Link>

            <p className="text-white/80 font-sophisticated leading-relaxed mb-6">
              {language === 'bg' ?'Професионална фотографка със страст към запечатването на най-важните моменти в живота. Всяка снимка разказва уникална история.' :'Professional photographer with a passion for capturing life\'s most important moments. Every photo tells a unique story.'
              }
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="text-accent" />
                <a href="tel:+359888123456" className="text-white/80 hover:text-accent transition-colors duration-300 font-sophisticated">
                  +359 888 123 456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-accent" />
                <a href="mailto:elena@photography.bg" className="text-white/80 hover:text-accent transition-colors duration-300 font-sophisticated">
                  elena@photography.bg
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={16} className="text-accent" />
                <span className="text-white/80 font-sophisticated">
                  {language === 'bg' ? 'София, България' : 'Sofia, Bulgaria'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections)?.map(([key, section]) => (
            <div key={key}>
              <h4 className="font-heading text-lg text-white mb-6">
                {section?.title?.[language]}
              </h4>
              <ul className="space-y-3">
                {section?.links?.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link?.path}
                      className="text-white/70 hover:text-accent transition-colors duration-300 font-sophisticated text-sm"
                    >
                      {link?.name?.[language]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-6">
              {socialLinks?.map((social) => (
                <motion.a
                  key={social?.name}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-accent hover:bg-accent/20 transition-all duration-300"
                  aria-label={`Follow on ${social?.name}`}
                >
                  <Icon name={social?.icon} size={18} />
                </motion.a>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/60 font-sophisticated text-sm">
                © {currentYear} Elena Rose Photography. {language === 'bg' ? 'Всички права запазени.' : 'All rights reserved.'}
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2">
                <Link to="/about" className="text-white/50 hover:text-accent transition-colors duration-300 text-xs font-sophisticated">
                  {language === 'bg' ? 'Политика за поверителност' : 'Privacy Policy'}
                </Link>
                <span className="text-white/30">•</span>
                <Link to="/about" className="text-white/50 hover:text-accent transition-colors duration-300 text-xs font-sophisticated">
                  {language === 'bg' ? 'Условия за ползване' : 'Terms of Service'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center text-sophisticated-dark shadow-strong z-40 magnetic-hover"
        aria-label="Back to top"
      >
        <Icon name="ArrowUp" size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;