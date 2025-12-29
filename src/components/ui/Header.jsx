import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';
import { useLanguage, useTranslations } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const [isHeroTransparent, setIsHeroTransparent] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { language, toggleLanguage, isEnglish } = useLanguage();
  const { t } = useTranslations();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isHomepage = location?.pathname === '/' || location?.pathname === '/homepage';

  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.max(window.innerHeight - 120, 320);
      const pastHero = window.scrollY > threshold;
      setIsHeroTransparent(isHomepage ? !pastHero : false);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHomepage]);

  const navigationItems = [
    { name: t('home'), path: '/homepage', icon: 'Home' },
    { name: t('gallery'), path: '/gallery', icon: 'Camera' },
    { name: t('about'), path: '/about', icon: 'User' },
    { name: t('investment'), path: '/investment', icon: 'DollarSign' },
    { name: t('booking'), path: '/booking', icon: 'Calendar' },
    ...(user?.user_metadata?.role === 'admin' || profile?.role === 'admin' ? [
      { name: 'Album Management', path: '/album-management', icon: 'LayoutGrid' },
      { name: 'Admin Dashboard', path: '/admin-dashboard', icon: 'BarChart3' }
    ] : [])
  ];


  const isActivePath = (path) => location?.pathname === path;

  const LanguageToggle = () => (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch to ${isEnglish ? 'Bulgarian' : 'English'}`}
      className={`flex items-center gap-2 text-sm transition-opacity ${
        isHeroTransparent ? 'text-white hover:opacity-80' : 'text-hierarchy-secondary hover:text-sophisticated-dark'
      }`}
    >
      <Icon name="Globe" size={16} className={isHeroTransparent ? 'text-white/80' : 'text-hierarchy-secondary'} />
      <span className={`font-sophisticated ${isHeroTransparent ? 'text-white' : 'text-hierarchy-secondary'}`}>
        {language?.toUpperCase()}
      </span>
    </button>
  );

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isHeroTransparent
      ? 'bg-transparent border-transparent backdrop-blur-none shadow-none'
      : 'bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm'
  }`;

  const linkActiveClass = isHeroTransparent ? 'text-white' : 'text-sophisticated-dark';
  const linkIdleClass = isHeroTransparent ? 'text-white/80 hover:text-white' : 'text-hierarchy-secondary hover:text-sophisticated-dark';
  const indicatorClass = isHeroTransparent ? 'from-white to-white' : 'from-accent to-secondary';
  const authBtnClass = isHeroTransparent ? 'text-white hover:text-white/80' : 'text-sophisticated-dark hover:text-accent';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Navigation and controls */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) =>
            <Link
              key={item?.path}
              to={item?.path}
              className={`relative px-3 py-2 text-sm font-sophisticated transition-all duration-elegant elegant-hover ${
              isActivePath(item?.path) ?
              linkActiveClass : linkIdleClass}`
              }>

                <span className="relative z-10">{item?.name}</span>
                {isActivePath(item?.path) &&
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${indicatorClass} rounded-full`}></div>
              }
              </Link>
            )}
          </nav>

          {/* Right side - Language selector, Notification Bell, and Auth buttons */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <LanguageToggle />

            {/* Notification Bell - Only show when user is logged in */}
            {user && <NotificationBell />}

            {/* Sign In / Sign Out Button */}
            {user ? (
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${authBtnClass}`}
              >
                <span>Sign Out</span>
                <Icon name="LogOut" size={16} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${authBtnClass}`}
              >
                <span>Sign In</span>
                <Icon name="LogIn" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen &&
        <div className="md:hidden py-4 border-t border-border">
            <div className="px-4 py-6 space-y-4">
              {navigationItems?.map((item) =>
            <Link
              key={item?.path}
              to={item?.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-elegant ${
              isActivePath(item?.path) ?
              'bg-accent text-sophisticated-dark shadow-soft' :
              'text-hierarchy-secondary hover:bg-surface-elevation hover:text-sophisticated-dark'}`
              }>

                  <Icon name={item?.icon} size={20} />
                  <span className="font-sophisticated">{item?.name}</span>
                </Link>
            )}
              
              <div className="pt-4 border-t border-border space-y-3">
                <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/booking';
                }}
                className="elegant-hover">

                  {t('bookConsultation')}
                </Button>
                <Button
                variant="default"
                fullWidth
                className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/gallery';
                }}>

                  {t('viewGallery')}
                </Button>
              </div>
            </div>
            
            {user ?
          <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="px-4">
                  <p className="text-sm font-medium text-sophisticated-dark">
                    {profile?.full_name || user?.email}
                  </p>
                  {profile?.role &&
              <p className="text-xs text-hierarchy-secondary">
                      {profile?.role === 'admin' ? 'Administrator' : 'Client'}
                    </p>
              }
                </div>
                <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sophisticated-dark hover:bg-surface-elevation flex items-center space-x-2">

                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div> :

          <div className="mt-4 pt-4 border-t border-border">
                <button
              onClick={() => {
                navigate('/signin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sophisticated-dark hover:bg-surface-elevation flex items-center space-x-2">

                  <Icon name="LogIn" size={16} />
                  <span>Sign In</span>
                </button>
              </div>
          }
          </div>
        }
      </div>
      {/* Floating Booking Widget */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-strong magnetic-hover pulse-cta"
          onClick={() => window.location.href = '/booking'}>

          <Icon name="Calendar" size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;