import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PackageCard from './components/PackageCard';
import AddOnService from './components/AddOnService';
import ValueProposition from './components/ValueProposition';
import TestimonialCard from './components/TestimonialCard';
import PaymentOptions from './components/PaymentOptions';
import SeasonalPromotion from './components/SeasonalPromotion';

import { useLanguage } from '../../hooks/useLanguage';

const Investment = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { t } = useLanguage();

  // Mock data for packages
  const packages = [
    {
      id: 1,
      name: "Essential",
      subtitle: t('essentialSubtitle'),
      price: "450",
      description: t('essentialDescription'),
      features: [
        t('essentialFeatSession'),
        t('essentialFeatLocation'),
        t('essentialFeatEditedPhotos'),
        t('essentialFeatOnlineGallery'),
        t('essentialFeatHighRes'),
        t('essentialFeatConsultation')
      ]
    },
    {
      id: 2,
      name: "Signature",
      subtitle: t('signatureSubtitle'),
      price: "750",
      description: t('signatureDescription'),
      features: [
        t('signatureFeatSession'),
        t('signatureFeatLocations'),
        t('signatureFeatEditedPhotos'),
        t('signatureFeatOnlineGallery'),
        t('signatureFeatAllPhotosFullRes'),
        t('signatureFeatPlanning'),
        t('signatureFeatFastEdit'),
        t('signatureFeatExtraPhotos')
      ]
    },
    {
      id: 3,
      name: "Legacy",
      subtitle: t('legacySubtitle'),
      price: "1200",
      description: t('legacyDescription'),
      features: [
        t('legacyFeatSession'),
        t('legacyFeatLocations'),
        t('legacyFeatEditedPhotos'),
        t('legacyFeatPrivateGallery'),
        t('legacyFeatOriginalFiles'),
        t('legacyFeatAlbum'),
        t('legacyFeatPriorityEdit'),
        t('legacyFeatSecondConsult'),
        t('legacyFeatUSB'),
        t('legacyFeatCommercialRights')
      ]
    }
  ];

  // Mock data for add-on services
  const addOnServices = [
    {
      id: 1,
      name: "Engagement Session",
      price: "300",
      icon: "Heart",
      description: t('engagementDescription'),
      features: [
        t('engagementFeatSession'),
        t('engagementFeatEdited'),
        t('engagementFeatGallery')
      ]
    },
    {
      id: 2,
      name: "Second Photographer",
      price: "200",
      icon: "Users",
      description: t('secondPhotographerDescription'),
      features: [
        t('secondPhotographerFeatCoverage'),
        t('secondPhotographerFeatAngles'),
        t('secondPhotographerFeatCandids')
      ]
    },
    {
      id: 3,
      name: "Premium Album",
      price: "400",
      icon: "Book",
      description: t('premiumAlbumDescription'),
      features: [
        t('premiumAlbumFeatPages'),
        t('premiumAlbumFeatMaterials'),
        t('premiumAlbumFeatDesign')
      ]
    },
    {
      id: 4,
      name: "Extended Gallery",
      price: "150",
      icon: "Clock",
      description: t('extendedGalleryDescription'),
      features: [
        t('extendedGalleryFeatMonths'),
        t('extendedGalleryFeatDownloads'),
        t('extendedGalleryFeatSharing')
      ]
    }
  ];

  // Mock data for value propositions
  const valuePropositions = [
    {
      id: 1,
      title: t('valueEquipmentTitle'),
      description: t('valueEquipmentDesc'),
      icon: "Camera"
    },
    {
      id: 2,
      title: t('valueArtistryTitle'),
      description: t('valueArtistryDesc'),
      icon: "Palette"
    },
    {
      id: 3,
      title: t('valuePersonalApproachTitle'),
      description: t('valuePersonalApproachDesc'),
      icon: "User"
    },
    {
      id: 4,
      title: t('valueLongTermValueTitle'),
      description: t('valueLongTermValueDesc'),
      icon: "TrendingUp"
    }
  ];

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: t('testimonialMariaName'),
      session: t('testimonialMariaSession'),
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: t('testimonialMariaQuote')
    },
    {
      id: 2,
      name: t('testimonialAnnaName'),
      session: t('testimonialAnnaSession'),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: t('testimonialAnnaQuote')
    },
    {
      id: 3,
      name: t('testimonialGeorgiName'),
      session: t('testimonialGeorgiSession'),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: t('testimonialGeorgiQuote')
    }
  ];

  const handleSelectPackage = (pkg, type = 'package') => {
    setSelectedPackage(pkg);
    if (type === 'consultation') {
      navigate('/booking', { state: { selectedPackage: pkg, consultationOnly: true } });
    } else {
      navigate('/booking', { state: { selectedPackage: pkg } });
    }
  };

  const handleBookConsultation = () => {
    navigate('/booking', { state: { consultationOnly: true } });
  };

  const handleBookNow = () => {
    navigate('/booking');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('investment')} - Desislava Tepavicharova Photography</title>
        <meta name="description" content={t('heroDescription')} />
        <meta name="keywords" content={t('investmentKeywords')} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-gallery-canvas to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-sophisticated-dark mb-6">
                {t('heroTitle')}
              </h1>

              <p className="text-lg md:text-xl text-hierarchy-secondary leading-relaxed mb-8 max-w-3xl mx-auto">
                {t('heroDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
                  onClick={handleBookConsultation}
                >
                  {t('bookConsultation')}
                </Button>
                
                <Button
                  variant="outline"
                  className="elegant-hover"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('viewGallery')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Promotion */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SeasonalPromotion onBookNow={handleBookNow} />
          </div>
        </section>

        {/* Investment Packages */}
        <section id="packages" className="py-20 bg-warm-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                {t('investment')}
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                {t('heroDescription')}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {packages?.map((pkg, index) => (
                <PackageCard
                  key={pkg?.id}
                  package={pkg}
                  isPopular={index === 1}
                  onSelectPackage={handleSelectPackage}
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-hierarchy-secondary mb-4">
                {t('unsurePackageQuestion')}
              </p>
              <Button
                variant="outline"
                onClick={handleBookConsultation}
                className="elegant-hover"
              >
                {t('bookFreeConsultation')}
              </Button>
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                {t('addOnTitle')}
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                {t('addOnDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {addOnServices?.map((service) => (
                <AddOnService key={service?.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 bg-gallery-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                {t('valueTitle')}
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                {t('valueDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuePropositions?.map((proposition) => (
                <ValueProposition key={proposition?.id} proposition={proposition} />
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                {t('includedTitle')}
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                {t('includedDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedConsultationTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedConsultationDesc')}
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Camera" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedPhotoshootTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedPhotoshootDesc')}
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Edit" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedEditingTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedEditingDesc')}
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Globe" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedGalleryTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedGalleryDesc')}
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Download" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedHighResTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedHighResDesc')}
                </p>
              </div>

              <div className="bg-surface-elevation rounded-xl p-8 text-center elegant-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="HeadphonesIcon" size={24} className="text-sophisticated-dark" />
                </div>
                <h3 className="font-sophisticated font-medium text-sophisticated-dark mb-3">
                  {t('includedSupportTitle')}
                </h3>
                <p className="text-hierarchy-secondary leading-relaxed">
                  {t('includedSupportDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentOptions onBookConsultation={handleBookConsultation} />
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 bg-gallery-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
                {t('testimonialsTitle')}
              </h2>
              <p className="text-lg text-hierarchy-secondary leading-relaxed max-w-3xl mx-auto">
                {t('testimonialsDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials?.map((testimonial) => (
                <TestimonialCard key={testimonial?.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-warm-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-sophisticated-dark mb-6">
              {t('finalCtaTitle')}
            </h2>
            <p className="text-lg text-hierarchy-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('finalCtaDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                variant="default"
                className="bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover pulse-cta"
                onClick={handleBookConsultation}
              >
                {t('bookFreeConsultation')}
              </Button>
              
              <Button
                variant="outline"
                className="elegant-hover"
                onClick={() => navigate('/gallery')}
              >
                {t('viewGallery')}
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-hierarchy-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-accent" />
                  <span>{t('qualityGuarantee')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-accent" />
                  <span>{t('fastDelivery')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Heart" size={16} className="text-accent" />
                  <span>{t('personalizedApproach')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-sophisticated-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Camera" size={20} className="text-sophisticated-dark" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-medium text-lg leading-none">
                    Desislava Tepavicharova
                  </span>
                  <span className="font-body text-xs text-white/70 leading-none">
                    Photography
                  </span>
                </div>
              </div>
              
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                {t('footerTagline')}
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <a href="mailto:elena@elenarose.bg" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Mail" size={20} />
                </a>
                <a href="tel:+359888123456" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Phone" size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Instagram" size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="Facebook" size={20} />
                </a>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-white/50 text-sm">
                  © {new Date()?.getFullYear()} Desislava Tepavicharova Photography. {t('allRightsReserved')}.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Investment;