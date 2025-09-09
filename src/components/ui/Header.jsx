import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';
import { useLanguage, useTranslations } from '../../hooks/useLanguage';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, isEnglish } = useLanguage();
  const { t } = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: t('home'), path: '/homepage', icon: 'Home' },
    { name: t('gallery'), path: '/gallery', icon: 'Camera' },
    { name: t('about'), path: '/about', icon: 'User' },
    { name: t('investment'), path: '/investment', icon: 'DollarSign' },
    { name: t('booking'), path: '/booking', icon: 'Calendar' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const Logo = () => (
    <Link to="/homepage" className="flex items-center space-x-3 group">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-elegant">
          <Icon name="Camera" size={20} className="text-sophisticated-dark" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-feminine-accent rounded-full border-2 border-background"></div>
      </div>
      <div className="flex flex-col">
        <span className="font-heading font-medium text-lg text-sophisticated-dark leading-none">
          Elena Rose
        </span>
        <span className="font-body text-xs text-hierarchy-secondary leading-none">
          Photography
        </span>
      </div>
    </Link>
  );

  const LanguageToggle = () => (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center space-x-2 elegant-hover px-3 py-2"
        aria-label={`Switch to ${isEnglish ? 'Bulgarian' : 'English'}`}
      >
        <Icon name="Globe" size={16} className="text-hierarchy-secondary" />
        <span className="text-sm font-sophisticated text-hierarchy-secondary">
          {language?.toUpperCase()}
        </span>
        <div className="flex items-center space-x-1">
          <div
            className={`w-8 h-4 bg-surface-elevation rounded-full relative transition-all duration-elegant ${
              isEnglish ? 'bg-accent' : 'bg-surface-muted'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-background rounded-full shadow-soft transition-all duration-elegant ${
                isEnglish ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
      </Button>
    </div>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-elegant ${
        isScrolled 
          ? 'glass-nav shadow-medium' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`relative px-3 py-2 text-sm font-sophisticated transition-all duration-elegant elegant-hover ${
                  isActivePath(item?.path)
                    ? 'text-sophisticated-dark' :'text-hierarchy-secondary hover:text-sophisticated-dark'
                }`}
              >
                <span className="relative z-10">{item?.name}</span>
                {isActivePath(item?.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-secondary rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Controls - Language + CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageToggle />
            <Button
              variant="outline"
              size="sm"
              className="elegant-hover"
              onClick={() => window.location.href = '/booking'}
            >
              {t('bookConsultation')}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark hover:shadow-medium pulse-cta"
              onClick={() => window.location.href = '/gallery'}
            >
              {t('viewGallery')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="elegant-hover"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
                className="text-sophisticated-dark" 
              />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-nav shadow-strong border-t border-border">
            <div className="px-4 py-6 space-y-4">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-elegant ${
                    isActivePath(item?.path)
                      ? 'bg-accent text-sophisticated-dark shadow-soft'
                      : 'text-hierarchy-secondary hover:bg-surface-elevation hover:text-sophisticated-dark'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-sophisticated">{item?.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/booking';
                  }}
                  className="elegant-hover"
                >
                  {t('bookConsultation')}
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/gallery';
                  }}
                >
                  {t('viewGallery')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Floating Booking Widget */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-strong magnetic-hover pulse-cta"
          onClick={() => window.location.href = '/booking'}
        >
          <Icon name="Calendar" size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;