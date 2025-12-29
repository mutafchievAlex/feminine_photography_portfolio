import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
      // Navigation
      home: 'Home',
      gallery: 'Gallery',
      about: 'About',
      investment: 'Investment',
      booking: 'Booking',
      
      // Common buttons
      bookConsultation: 'Book Consultation',
      viewGallery: 'View Gallery',
      learnMore: 'Learn More',
      contactMe: 'Contact Me',
      
      // Hero section
      heroTitle: 'Professional Photography with a Feminine Touch',
      heroSubtitle: 'Capturing moments, creating memories',
      heroDescription: 'Wedding, portrait and family photography with artistic vision and personalized approach.',
      
      // Services
      weddingPhotography: 'Wedding Photography',
      portraitPhotography: 'Portrait Photography',
      familyPhotography: 'Family Photography',
      maternityPhotography: 'Maternity Sessions',
      
      // About
      aboutTitle: 'My Story',
      aboutDescription: 'With over 8 years of experience in professional photography, I specialize in creating unique images that tell stories.',
      helloIAm: 'Hello, I am',
      happyClients: 'Happy clients',
      yearsExperience: 'Years experience',
      heroProseText: 'With over 8 years in photography, specializing in wedding, family, and portrait photography. My mission is to create images that tell stories and preserve your most precious memories forever.',
      // Story Section
      myStory: 'My Story',
      storyDescription: 'Every photo tells a story. Here is mine - a journey from passion to profession, from first shots to recognition in the world of photography.',
      keyMoments: 'Key Moments',
      behindTheScenes: 'Behind the Scenes',
      inTheStudio: 'In the Studio',
      atAWedding: 'At a Wedding',
      onLocation: 'On Location',
      whyIChosePhotography: 'Why I Chose Photography',
      photographyQuote: 'I believe every moment is unique and unrepeatable. My role is to capture these fleeting instants and turn them into memories that will last forever. Photography allows me to be part of the most important days in people\'s lives.',
      // Approach Section
      myApproach: 'My Approach',
      approachDescription: 'Photography is the art of emotions. My philosophy is based on creating authentic connections and capturing genuine moments.',
      myPhilosophy: 'My Philosophy',
      howWeWorkTogether: 'How We Work Together',
      
      // Contact
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      followMe: 'Follow Me',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      
      // Collection
      collection: 'Collection',
      of: 'of',
      images: 'images',
      loading: 'Loading...',
      noImages: 'No images found in this album',
      backToGallery: 'Back to Gallery',
      imageDetails: 'Image Details',
      title: 'Title',
      description: 'Description',
      captureDate: 'Capture Date',
      location: 'Location',
      technicalDetails: 'Technical Details',
      accessibility: 'Accessibility Description',
      story: 'Story',
      categoryWeddings: 'Weddings',
      categoryMaternity: 'Maternity',
      categoryFamily: 'Family',
      categoryEvents: 'Events',
      categoryPortraits: 'Portraits',
      categoryCorporate: 'Corporate',
      
      notifications: {
        label: 'Notifications',
        title: 'Notifications',
        noNotifications: 'No notifications yet',
        markAllRead: 'Mark all as read',
        markRead: 'Mark as read',
        clearAll: 'Clear all',
        clear: 'Clear',
        justNow: 'Just now',
        minutesAgo: 'm ago',
        hoursAgo: 'h ago',
        daysAgo: 'd ago',
      },
      
      // Admin Dashboard
      adminDashboard: 'Admin Dashboard',
      adminDashboardTitle: 'Admin Dashboard • Elena Rose Photography',
      financialOverview: 'Financial Overview',
      revenueAndStats: 'Revenue and statistics for the last 6 months',
      totalRevenue: 'Total Revenue',
      totalSessions: 'Total Sessions',
      averagePerSession: 'Average per Session',
      revenueChart: 'Revenue Chart',
      sessionTypeBreakdown: 'Session Type Breakdown',
      noRevenueData: 'No revenue data available',
      exportReport: 'Export Report',
      dataUpdated: 'Data last updated 2 hours ago',
      bookings: 'Bookings',
      reservations: 'Reservations',
      recentBookings: 'Recent Bookings',
      noBookingsAvailable: 'No bookings available',
      viewAllBookings: 'View all bookings',
      upcomingSchedule: 'Upcoming Schedule',
      upcomingSessions: 'Upcoming Sessions',
      upcomingSessionsInfo: 'upcoming sessions in the next 30 days',
      recentActivity: 'Recent Activity',
      systemInfo: 'System Information',
      bookingsCount: 'bookings',
      imagesCount: 'images',
      albumsCount: 'albums',
      loadingStats: 'Error loading statistics',
      noStatsAvailable: 'No statistics available',
      totalBookings: 'Total Bookings',
      upcomingSessionsCount: 'Upcoming Sessions',
      signIn: 'Sign In',
      signInSubtitle: 'Sign in to admin panel or profile',
      adminAccount: 'Administrator:',
      clientAccount: 'Client Account:',
      // Recognition / About
      recognitionTitle: 'Recognition & Achievements',
      recognitionDescription: 'Grateful for the recognition from peers and clients. Every award inspires me to continue creating beautiful work.',
      awardsTitle: 'Awards & Honors',
      publicationsTitle: 'Publications & Media',
      educationTitle: 'Education & Certifications',
      testimonialsTitle: 'What Clients Say',
      professionalMemberships: 'Professional Memberships',
      // Locations
      favoriteLocations: 'Favorite Locations in Bulgaria',
      locationsDescription: 'Every place has its soul and story. Here are some of my favorite locations where I create the most beautiful photos with my clients.',
      howIWorkLocations: 'How I Work with Locations',
      // Consultation Process
      consultationProcess: 'Consultation Process',
      consultationProcessDescription: 'Each consultation is carefully planned to understand your vision and create the perfect experience.',
      whatToExpect: 'What to Expect',
      timeline: 'Timeline',
      timelineDescription: 'From consultation to final images',
      // Trust Signals
      whyChooseMe: 'Why Choose Me',
      whyChooseMeDescription: 'Your peace of mind and satisfaction are my priority',
      // Payment & Promotions
      paymentOptions: 'Payment Options',
      paymentOptionsDescription: 'We understand that professional photography is an investment. We offer flexible payment options to make our services accessible for every budget.',
      mostPopular: 'Most Popular',
      discussPaymentOptions: 'Discuss Payment Options',
      limitedOffer: 'Limited Offer',
      seasonalPromoTitle: 'Autumn Promotion 2024',
      seasonalPromoDescription: 'Book your autumn photoshoot by October 15th and get a free second location',
      bookNow: 'Book Now',

      // Investment Page - Packages
      essentialSubtitle: 'Perfect for small events',
      essentialDescription: 'Ideal choice for intimate moments and small celebrations. Includes the essentials to create beautiful memories.',
      essentialFeatSession: '1 hour photoshoot',
      essentialFeatLocation: '1 location of choice',
      essentialFeatEditedPhotos: '20 professionally edited photos',
      essentialFeatOnlineGallery: 'Online gallery for 30 days',
      essentialFeatHighRes: 'High resolution for print',
      essentialFeatConsultation: 'Pre-session consultation',

      signatureSubtitle: 'Most popular choice',
      signatureDescription: 'Our most requested package offering the perfect balance between value and quality for your special moments.',
      signatureFeatSession: '2 hour photoshoot',
      signatureFeatLocations: 'Up to 2 locations',
      signatureFeatEditedPhotos: '50 professionally edited photos',
      signatureFeatOnlineGallery: 'Private online gallery for 90 days',
      signatureFeatAllPhotosFullRes: 'All photos in full resolution',
      signatureFeatPlanning: 'Detailed consultation and planning',
      signatureFeatFastEdit: 'Fast editing - 48 hours',
      signatureFeatExtraPhotos: 'Option for additional photos',

      legacySubtitle: 'The full experience',
      legacyDescription: 'Premium package for those who want to preserve every moment. Includes everything needed to create timeless memories.',
      legacyFeatSession: '4 hour photoshoot',
      legacyFeatLocations: 'Unlimited locations',
      legacyFeatEditedPhotos: '100+ professionally edited photos',
      legacyFeatPrivateGallery: 'Private gallery for 1 year',
      legacyFeatOriginalFiles: 'All original files',
      legacyFeatAlbum: 'Personal photo album (30 pages)',
      legacyFeatPriorityEdit: 'Priority editing - 24 hours',
      legacyFeatSecondConsult: 'Second consultation after the session',
      legacyFeatUSB: 'USB with all photos',
      legacyFeatCommercialRights: 'Commercial usage rights',

      // Investment Page - Add-ons
      engagementDescription: 'Romantic pre-wedding photoshoot for couples. Perfect to get to know each other before the wedding.',
      engagementFeatSession: '1 hour photoshoot',
      engagementFeatEdited: '15 edited photos',
      engagementFeatGallery: 'Online gallery',

      secondPhotographerDescription: 'Additional photographer for greater coverage and different angles of the event.',
      secondPhotographerFeatCoverage: 'Full coverage',
      secondPhotographerFeatAngles: 'Different perspectives',
      secondPhotographerFeatCandids: 'More candid moments',

      premiumAlbumDescription: 'Luxury photo album with hard cover and professional print of the best photos.',
      premiumAlbumFeatPages: '50 pages',
      premiumAlbumFeatMaterials: 'Premium materials',
      premiumAlbumFeatDesign: 'Custom design',

      extendedGalleryDescription: 'Extend access to the online gallery for an additional 6 months.',
      extendedGalleryFeatMonths: '6 months extra',
      extendedGalleryFeatDownloads: 'Unlimited downloads',
      extendedGalleryFeatSharing: 'Sharing with loved ones',

      // Investment Page - Value propositions
      valueEquipmentTitle: 'Professional equipment',
      valueEquipmentDesc: 'We use state-of-the-art gear to ensure perfect quality for every photo.',
      valueArtistryTitle: 'Artistic expertise',
      valueArtistryDesc: 'Over 8 years of experience creating emotional and artistic photographs that tell your story.',
      valuePersonalApproachTitle: 'Personalized approach',
      valuePersonalApproachDesc: 'Every session is unique. We work together to create photos that reflect your individuality.',
      valueLongTermValueTitle: 'Long-term value',
      valueLongTermValueDesc: 'Investing in professional photos grows in value over time—the memories become even more precious.',

      // Investment Page - Testimonials
      testimonialMariaName: 'Maria Petrova',
      testimonialMariaSession: 'Wedding photoshoot',
      testimonialMariaQuote: 'Elena captured every emotional moment of our wedding. The photos are like works of art—each tells a story. The investment was absolutely worth it!',
      testimonialAnnaName: 'Anna Dimitrova',
      testimonialAnnaSession: 'Maternity',
      testimonialAnnaQuote: 'Elena’s professionalism and attention to detail are incredible. She made my maternity photoshoot unforgettable. The result exceeded my expectations.',
      testimonialGeorgiName: 'Georgi Stoyanov',
      testimonialGeorgiSession: 'Family photoshoot',
      testimonialGeorgiQuote: 'As a family we are very happy with Elena’s work. She managed to capture the natural moments between us and created memories we will cherish forever.',

      // Investment Page - Payment plans
      fullPaymentDiscount: '5% discount',
      fullPaymentDescription: 'Pay the full amount on booking and receive 5% off',
      paymentPlanDiscount: 'No interest',
      paymentPlanDescription: '50% deposit on booking, remaining 7 days before the session',
      extendedPlanDiscount: 'Flexibility',
      extendedPlanDescription: '30% deposit, 40% before the session, 30% on delivery of photos',

      // Investment Page - Promo stats
      seasonalDiscountLabel: 'discount',
      seasonalExtraLocationLabel: 'location',
      seasonalDeliveryLabel: 'delivery',

      // Investment Page - Sections & CTAs
      investmentKeywords: 'photography pricing, wedding photography, family photoshoot, investment memories',
      unsurePackageQuestion: 'Not sure which package is right for you?',
      bookFreeConsultation: 'Book a free consultation',
      addOnTitle: 'Add-on Services',
      addOnDescription: 'Personalize your experience with our add-ons designed to enrich and complement your main package.',
      valueTitle: 'Why invest in professional photography?',
      valueDescription: 'Understand the value behind every investment and how professional photography creates long-term value for you and your family.',
      includedTitle: 'What does the experience include?',
      includedDescription: 'From the initial consultation to final delivery—here is the full process of working with us.',
      includedConsultationTitle: 'Initial consultation',
      includedConsultationDesc: 'We explore your vision, preferences, and plan every session detail.',
      includedPhotoshootTitle: 'Professional photoshoot',
      includedPhotoshootDesc: 'We use the best equipment and techniques to capture stunning images.',
      includedEditingTitle: 'Expert retouching',
      includedEditingDesc: 'Each image is edited individually to achieve the highest quality.',
      includedGalleryTitle: 'Private online gallery',
      includedGalleryDesc: 'A secure, private gallery for easy sharing and downloading.',
      includedHighResTitle: 'High-resolution delivery',
      includedHighResDesc: 'All photos are delivered in full resolution, ready for print and sharing.',
      includedSupportTitle: 'Ongoing support',
      includedSupportDesc: 'We’re always available for questions and additional services.',
      testimonialsTitle: 'What our clients say',
      testimonialsDescription: 'Our clients’ stories speak to the value of investing in professional photography and the unforgettable memories we create together.',
      finalCtaTitle: 'Ready to make the investment?',
      finalCtaDescription: 'Let’s start the conversation about your dreams and how we can turn them into beautiful, lasting memories. The first consultation is always free.',
      qualityGuarantee: '100% quality guarantee',
      fastDelivery: 'Fast delivery',
      personalizedApproach: 'Personalized approach',
      footerTagline: 'We create beautiful memories you will keep forever. Every photo tells a unique story.',
      
      // Booking Page
      bookingHeroFeature1Title: '60-90 min',
      bookingHeroFeature1Subtitle: 'Consultation',
      bookingHeroFeature2Title: 'Free',
      bookingHeroFeature2Subtitle: 'No obligations',
      bookingHeroFeature3Title: 'Personal',
      bookingHeroFeature3Subtitle: 'For your needs',
      bookingSuccessMessage: '✓ Your booking was sent successfully! We will contact you soon.',
      bookingErrorMessage: 'An error occurred while creating the booking. Please try again.',
      quickContact: 'Quick Contact',
      callNow: 'Call now',
      sendEmail: 'Send email',
      selectedDate: 'Selected Date',
      inspiration: 'Inspiration',
      inspirationQuote: 'Every moment is unique and deserves to be captured with love and attention to detail.',
      tabBooking: 'Booking',
      tabCalendar: 'Calendar',
      tabProcess: 'Process',
      tabReviews: 'Reviews',
      readyToBegin: 'Ready to Begin?',
      bookingCtaDescription: 'Your story is waiting to be told. Book your consultation today and take the first step toward unforgettable memories.',
      bookNow: 'Book Now',
      viewMyWork: 'View My Work',
      
      // Booking Form
      bookConsultationTitle: 'Book Consultation',
      bookConsultationSubtitle: 'Start your journey with a complimentary consultation',
      personalInformation: 'Personal Information',
      fullName: 'Full Name',
      enterYourName: 'Enter your name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      sessionDetails: 'Session Details',
      sessionType: 'Session Type',
      selectSessionType: 'Select session type',
      sessionWedding: 'Wedding Photography',
      sessionMaternity: 'Maternity Session',
      sessionFamily: 'Family Portrait',
      sessionEngagement: 'Engagement Session',
      sessionIndividual: 'Individual Portrait',
      sessionCorporate: 'Corporate Headshots',
      sessionNewborn: 'Newborn Session',
      sessionOther: 'Other',
      preferredDate: 'Preferred Date',
      alternativeDate: 'Alternative Date',
      preferredLocation: 'Preferred Location',
      selectLocation: 'Select location',
      locationStudio: 'Studio',
      locationOutdoor: 'Outdoor Location',
      locationHome: 'At Home',
      locationVenue: 'Special Venue',
      locationFlexible: 'Flexible',
      yourVision: 'Your Vision',
      tellMeYourVision: 'Tell me about your vision',
      describePhotoshoot: 'Describe how you envision the photoshoot...',
      whatDrewYou: 'What drew you to my work?',
      shareInspiration: 'Share what inspired you...',
      specialRequests: 'Special Requests',
      specialRequestsPlaceholder: 'Is there anything special you\'d like to include...',
      agreeToTerms: 'I agree to the terms of service and privacy policy',
      receiveNews: 'I\'d like to receive photography news and inspiration',
      submitting: 'Submitting...',
      errorRequired: 'Please enter',
      errorInvalidEmail: 'Invalid email format',
      errorSelectType: 'Please select session type',
      errorSelectDate: 'Please select preferred date',
      errorAcceptTerms: 'Please accept terms',
      
      // Consultation Process
      initialConversationTitle: 'Initial Conversation',
      initialConversationDesc: 'We start with a 30-minute conversation about your vision, expectations, and special moments you want to capture.',
      initialConversationDuration: '30 min',
      locationPlanningTitle: 'Location Planning',
      locationPlanningDesc: 'We discuss the most suitable locations for your photoshoot - studio, nature, or a special place meaningful to you.',
      locationPlanningDuration: '15 min',
      stylingPrepTitle: 'Styling & Preparation',
      stylingPrepDesc: 'You receive a personalized guide for clothing, accessories, and preparation to feel confident and beautiful.',
      stylingPrepDuration: '10 min',
      finalizingDetailsTitle: 'Finalizing Details',
      finalizingDetailsDesc: 'We confirm the final date, time, package, and all special requests for the perfect experience.',
      finalizingDetailsDuration: '15 min',
      expectDurationTitle: 'Duration',
      expectDurationDesc: 'Consultation lasts 60-90 minutes',
      expectFormatTitle: 'Format',
      expectFormatDesc: 'Video call or studio meeting',
      expectComplimentaryTitle: 'Complimentary',
      expectComplimentaryDesc: 'Consultation is completely free',
      expectPersonalizedTitle: 'Personalized',
      expectPersonalizedDesc: 'Focus on your unique needs',
      timelineDay1: 'Day 1',
      timelineDay1Title: 'Consultation',
      timelineDay1Desc: 'Free consultation and planning',
      timelineDay2: 'Day 7-14',
      timelineDay2Title: 'Photoshoot',
      timelineDay2Desc: 'Professional photoshoot session',
      timelineDay3: 'Day 21-28',
      timelineDay3Title: 'Gallery',
      timelineDay3Desc: 'Receive your finished images',
      
      // Trust Signals
      secureBookingTitle: 'Secure Booking',
      secureBookingDesc: 'Your data is protected with SSL encryption',
      flexibleReschedulingTitle: 'Flexible Rescheduling',
      flexibleReschedulingDesc: 'Free rescheduling up to 48 hours before session',
      directContactTitle: 'Direct Contact',
      directContactDesc: 'You can always contact me directly',
      qualityGuaranteedTitle: 'Quality Guaranteed',
      qualityGuaranteedDesc: '100% satisfaction guarantee',
      cancellationPolicy: 'Cancellation Policy',
      cancellationItem1: 'Free cancellation up to 48 hours before session',
      cancellationItem2: 'Full refund if cancelled by photographer',
      cancellationItem3: 'Flexible options for unforeseen circumstances',
      privacyPolicyTitle: 'Privacy Policy',
      privacyItem1: 'Your photos won\'t be shared without permission',
      privacyItem2: 'Personal data used only for communication',
      privacyItem3: 'Option to delete data at any time',
      haveQuestions: 'Have Questions?',
      contactDirectly: 'Contact me directly for a quick response',
      
      // Approach Section - Principles
      authenticity: 'Authenticity',
      authenticityDescription: 'I believe in capturing real emotions and moments, not artificial poses. Every photo should tell your true story.',
      collaboration: 'Collaboration',
      collaborationDescription: 'I work in partnership with my clients, creating a comfortable atmosphere where you can be yourself in front of the camera.',
      attentionToDetail: 'Attention to Detail',
      attentionToDetailDescription: 'From light to composition, every element is important for creating the perfect shot.',
      patience: 'Patience',
      patienceDescription: 'The best moments cannot be forced. I wait for the right moment for each shot.',
      
      // Approach Section - Philosophy
      philosophyParagraph1: 'I believe that the most beautiful photos are born from real emotions and authentic moments. I don\'t seek perfect poses, but genuine smiles, natural gestures and spontaneous reactions.',
      philosophyParagraph2: 'Every client is unique, so my approach is individual. I take time to understand your story, character and vision, to create photos that truly represent you.',
      philosophyParagraph3: 'Photography is not only technique, but also emotional connection. I strive to create a comfortable atmosphere where you can feel free and natural.',
      
      // Approach Section - Process Steps
      initialConsultation: 'Initial Consultation',
      initialConsultationDescription: 'We meet and discuss your ideas, expectations and vision for the photoshoot.',
      planning: 'Planning',
      planningDescription: 'We choose location, discuss style and prepare all details for the perfect session.',
      photoshoot: 'Photoshoot',
      photoshootDescription: 'We create magic together in a relaxed and creative atmosphere.',
      processing: 'Processing',
      processingDescription: 'Professional editing of photos with attention to every detail.',
      delivery: 'Delivery',
      deliveryDescription: 'You receive the finished photos in an online gallery with print options.',
      
      // Approach Section - Duration
      duration3060min: '30-60 min',
      duration12weeks: '1-2 weeks',
      duration14hours: '1-4 hours',
      duration23weeks: '2-3 weeks',
      durationImmediate: 'Immediate',
      
      // Approach Section - CTA
      readyToCreateTogether: 'Ready to Create Something Beautiful Together?',
      readyToCreateDescription: 'Let\'s meet and discuss how I can help preserve your most precious moments.',
      viewPortfolio: 'View Portfolio',
      
      // Recognition Section - Awards Categories
      weddingPhotographyCategory: 'Wedding Photography',
      portraitPhotographyCategory: 'Portrait Photography',
      internationalRecognition: 'International Recognition',
      creativePhotography: 'Creative Photography',
      
      // Recognition Section - Publications
      weddingStyleMagazine: 'Wedding & Style',
      weddingStyleDescription: 'Interview on trends in wedding photography',
      bulgarianPhotoMagazine: 'Bulgarian Photography Magazine',
      bulgarianPhotoDescription: 'Portfolio feature - 8 pages',
      weddingBellsBulgaria: 'Wedding Bells Bulgaria',
      weddingBellsDescription: 'Top 10 wedding photographers in Bulgaria',
      
      // Recognition Section - Dates
      march2024: 'March 2024',
      january2024: 'January 2024',
      december2023: 'December 2023',
      
      // Recognition Section - Testimonials
      testimonial1Quote: 'Elena captured all the emotions from our special day. The photos are like from a fairy tale!',
      testimonial1Author: 'Maria and Peter',
      testimonial1Occasion: 'Wedding in Plovdiv',
      testimonial2Quote: 'Elena\'s professionalism and creative approach exceeded all our expectations.',
      testimonial2Author: 'Anna Georgieva',
      testimonial2Occasion: 'Family Photoshoot',
      testimonial3Quote: 'Working with Elena was a pleasure. She knows how to make you feel comfortable.',
      testimonial3Author: 'Dimitar Stoyanov',
      testimonial3Occasion: 'Corporate Portraits',
      
      // Meta tags
      photographerName: 'Elena Rose',
      professionalPhotographer: 'Professional Photographer',
      metaKeywords: 'photographer Bulgaria, wedding photography, portrait photography, family photography, professional photographer Sofia',
      locationSofiaBulgaria: 'Sofia, Bulgaria',
      
      // Story Section - Milestones
      milestone2016Title: 'The Beginning of the Journey',
      milestone2016Description: 'Started photography as a hobby, inspired by the beauty of Bulgarian nature and cultural heritage.',
      milestone2018Title: 'First Professional Wedding',
      milestone2018Description: 'Shot my first wedding in Plovdiv - a moment that changed my life and directed me towards professional photography.',
      milestone2020Title: 'Creating a Studio',
      milestone2020Description: 'Opened my own studio in Sofia, specializing in intimate portrait sessions and family photography.',
      milestone2022Title: 'International Recognition',
      milestone2022Description: 'Received my first international award for wedding photography from European Photography Awards.',
      milestone2024Title: 'New Horizons',
      milestone2024Description: 'Expanded my services with corporate photography and started teaching photography workshops.',
      
      // Story Section - Prose
      storyParagraph1: 'Photography entered my life in the most natural way - through love for beauty and the desire to preserve moments. Raised in a small town near Plovdiv, I have always been fascinated by light and shadows, by the way they transform ordinary things into something magical.',
      storyParagraph2: 'My first camera was a gift for my 18th birthday. At that time, I didn\'t know that this small device would change my entire fate. I started photographing everything - from family gatherings to landscapes, from portraits of friends to details of everyday life.',
      storyParagraph3: 'The turning point came in 2018, when a friend asked me to shoot her wedding. That day I realized that photography is not just a hobby for me - it is a calling. I saw how my photos can convey emotions, tell stories and preserve the most precious moments.',
      
      // Locations Section - Location Names & Details
      oldTownPlovdiv: 'Old Town, Plovdiv',
      oldTownPlovdivDescription: 'The romantic cobblestone streets and Revival architecture create the perfect atmosphere for wedding and portrait photos.',
      oldTownPlovdivSpecialty: 'Weddings and Portraits',
      oldTownPlovdivBestTime: 'Golden Hour',
      
      boyanaChurch: 'Boyana Church, Sofia',
      boyanaChurchDescription: 'The historical heritage and unique architecture make this place ideal for elegant photoshoots.',
      boyanaChurchSpecialty: 'Cultural Portraits',
      boyanaChurchBestTime: 'Morning',
      
      vitoshaMountain: 'Vitosha Mountain',
      vitoshaMountainDescription: 'The natural beauty of the mountain offers endless opportunities for romantic and adventurous photoshoots.',
      vitoshaMountainSpecialty: 'Nature Sessions',
      vitoshaMountainBestTime: 'Sunrise/Sunset',
      
      seaGardenVarna: 'Sea Garden, Varna',
      seaGardenVarnaDescription: 'The combination of sea, garden and architecture creates diverse opportunities for every type of photoshoot.',
      seaGardenVarnaSpecialty: 'Family Sessions',
      seaGardenVarnaBestTime: 'Afternoon',
      
      rilaMonastery: 'Rila Monastery',
      rilaMonasteryDescription: 'The spiritual atmosphere and magnificent architecture make this place special for deep, emotional portraits.',
      rilaMonasterySpecialty: 'Spiritual Portraits',
      rilaMonasteryBestTime: 'Early Morning',
      
      sozopol: 'Sozopol',
      sozopolDescription: 'The ancient seaside town with stone houses and maritime romance is ideal for intimate wedding sessions.',
      sozopolSpecialty: 'Seaside Weddings',
      sozopolBestTime: 'Sunset',
      
      // Locations Section - Services
      localKnowledge: 'Local Knowledge',
      localKnowledgeDescription: 'I know the best places and times for shooting throughout Bulgaria',
      timePlanning: 'Time Planning',
      timePlanningDescription: 'I optimize timing according to the light and atmosphere of each location',
      adaptiveTechnique: 'Adaptive Technique',
      adaptiveTechniqueDescription: 'I use appropriate equipment according to the specifics of each place',
      emotionalConnection: 'Emotional Connection',
      emotionalConnectionDescription: 'I help you choose a place that has special meaning for you',
      
      // Locations Section - Location Planning
      locationPlanning: 'Location Planning',
      locationPlanningParagraph1: 'Choosing the right location is key to the success of every photoshoot. I work with you to find the place that best matches your vision and style.',
      locationPlanningParagraph2: 'I have experience with photoshoots all over Bulgaria - from mountain peaks to seaside shores, from historical centers to modern urban spaces.',
      locationPlanningParagraph3: 'For each location, I prepare a detailed plan including the best shooting times, necessary permits and logistical details.',
      discussLocation: 'Discuss Location',
      viewGalleryButton: 'View Gallery',
      locationPlanningAlt: 'Photoshoot Planning',
      locationsCount: 'Locations',
      coverageInBulgaria: 'Coverage in Bulgaria',
      coverageNote: 'I work throughout Bulgaria. For locations outside Sofia, an additional travel fee applies.',
      studioWorkAlt: 'Working in the studio',
      weddingPhotoshootAlt: 'Wedding photoshoot',
      outdoorPhotoshootAlt: 'Outdoor photoshoot',
      onLocationText: 'On Location',
    },
    bg: {
      // Navigation
      home: 'Начало',
      gallery: 'Галерия',
      about: 'За мен',
      investment: 'Инвестиция',
      booking: 'Резервация',
      
      // Common buttons
      bookConsultation: 'Резервирай консултация',
      viewGallery: 'Разгледай галерията',
      learnMore: 'Научи повече',
      contactMe: 'Свържи се с мен',
      
      // Hero section
      heroTitle: 'Професионална фотография с женствен поглед',
      heroSubtitle: 'Запечатвам моменти, създавам спомени',
      heroDescription: 'Сватбена, портретна и семейна фотография с артистична визия и персонализиран подход.',
      
      // Services
      weddingPhotography: 'Сватбена фотография',
      portraitPhotography: 'Портретна фотография',
      familyPhotography: 'Семейна фотография',
      maternityPhotography: 'Матернити сесии',
      
      // About
      aboutTitle: 'Моята история',
      aboutDescription: 'С над 8 години опит в професионалната фотография, специализирам в създаването на неповторими образи, които разказват истории.',
      helloIAm: 'Здравейте, аз съм',
      happyClients: 'Щастливи клиенти',
      yearsExperience: 'Години опит',
      heroProseText: 'Вече повече от 8 години се занимавам с фотография, специализирайки се в сватбена, семейна и портретна фотография. Моята мисия е да създавам изображения, които разказват истории и съхраняват най-ценните ви спомени завинаги.',
      // Story Section
      myStory: 'Моята история',
      storyDescription: 'Всяка снимка разказва история. Ето моята - пътешествие от страст към професия, от първи кадри до признание в света на фотографията.',
      keyMoments: 'Ключови моменти',
      behindTheScenes: 'Зад кулисите',
      inTheStudio: 'В студиото',
      atAWedding: 'На сватба',
      onLocation: 'На локация',
      whyIChosePhotography: 'Защо избрах фотографията?',
      photographyQuote: 'Вярвам, че всеки момент е уникален и неповторим. Моята роля е да улавям тези мимолетни мгновения и да ги превръщам в спомени, които ще останат завинаги. Фотографията ми позволява да бъда част от най-важните дни в живота на хората.',
      // Approach Section
      myApproach: 'Моят подход',
      approachDescription: 'Фотографията е изкуство на емоциите. Моята философия се основава на създаването на автентични връзки и улавянето на истински моменти.',
      myPhilosophy: 'Философията ми',
      howWeWorkTogether: 'Как работим заедно',
      
      // Contact
      phone: 'Телефон',
      email: 'Имейл',
      address: 'Адрес',
      followMe: 'Последвай ме',
      
      // Footer
      allRightsReserved: 'Всички права запазени',
      privacyPolicy: 'Политика за поверителност',
      termsOfService: 'Условия за ползване',
      
      // Collection
      collection: 'Колекция',
      of: 'от',
      images: 'снимки',
      loading: 'Зареждане...',
      noImages: 'Няма намерени снимки в този албум',
      backToGallery: 'Обратно към галерията',
      imageDetails: 'Детайли за снимката',
      title: 'Заглавие',
      description: 'Описание',
      captureDate: 'Дата на заснемане',
      location: 'Локация',
      technicalDetails: 'Технически детайли',
      accessibility: 'Описание за достъпност',
      story: 'История',
      categoryWeddings: 'Сватби',
      categoryMaternity: 'Бременност',
      categoryFamily: 'Семейство',
      categoryEvents: 'Събития',
      categoryPortraits: 'Портрети',
      categoryCorporate: 'Корпоративни',
      
      notifications: {
        label: 'Известия',
        title: 'Известия',
        noNotifications: 'Няма известия',
        markAllRead: 'Маркирай всички като прочетени',
        markRead: 'Маркирай като прочетено',
        clearAll: 'Изчисти всички',
        clear: 'Изчисти',
        justNow: 'Току-що',
        minutesAgo: 'мин',
        hoursAgo: 'ч',
        daysAgo: 'д',
      },
      
      // Admin Dashboard
      adminDashboard: 'Админ Табло',
      adminDashboardTitle: 'Админ Табло • Elena Rose Photography',
      financialOverview: 'Финансов преглед',
      revenueAndStats: 'Приходи и статистики за последните 6 месеца',
      totalRevenue: 'Общо приходи',
      totalSessions: 'Общо сесии',
      averagePerSession: 'Средно на сесия',
      revenueChart: 'Диаграма на приходите',
      sessionTypeBreakdown: 'Разпределение по тип сесии',
      noRevenueData: 'Няма данни за приходи',
      exportReport: 'Експортирай отчет',
      dataUpdated: 'Данните са актуализирани преди 2 часа',
      bookings: 'Резервации',
      reservations: 'Резервации',
      recentBookings: 'Последни резервации',
      noBookingsAvailable: 'Няма налични резервации',
      viewAllBookings: 'Преглед на всички резервации',
      upcomingSchedule: 'Предстояща програма',
      upcomingSessions: 'Предстоящи сесии',
      upcomingSessionsInfo: 'предстоящи сесии през следващите 30 дни',
      recentActivity: 'Скорошна дейност',
      systemInfo: 'Системна информация',
      bookingsCount: 'резервации',
      imagesCount: 'снимки',
      albumsCount: 'албума',
      loadingStats: 'Грешка при зареждане на статистика',
      noStatsAvailable: 'Няма налична статистика',
      totalBookings: 'Общо резервации',
      upcomingSessionsCount: 'Предстоящи сесии',
      signIn: 'Вход',
      signInSubtitle: 'Влезте в административния панел или профила',
      adminAccount: 'Администратор:',
      clientAccount: 'Клиентски профил:',
      // Recognition / About
      recognitionTitle: 'Признание и постижения',
      recognitionDescription: 'Благодарна съм за признанието от колеги и клиенти. Всяка награда ме вдъхновява да продължавам да създавам красиви снимки.',
      awardsTitle: 'Награди и отличия',
      publicationsTitle: 'Публикации и медии',
      educationTitle: 'Образование и сертификати',
      testimonialsTitle: 'Какво казват клиентите',
      professionalMemberships: 'Професионални членства',
      // Locations
      favoriteLocations: 'Любими локации в България',
      locationsDescription: 'Всяко място има своя душа и история. Ето някои от моите любими локации, където създавам най-красивите снимки заедно с клиентите си.',
      howIWorkLocations: 'Как работя с локации',
      // Consultation Process
      consultationProcess: 'Процесът на консултация',
      consultationProcessDescription: 'Всяка консултация е внимателно планирана, за да разберем вашата визия и да създадем перфектното изживяване.',
      whatToExpect: 'Какво да очаквате',
      timeline: 'Времева линия',
      timelineDescription: 'От консултация до готови снимки',
      // Trust Signals
      whyChooseMe: 'Защо да ме изберете',
      whyChooseMeDescription: 'Вашето спокойствие и удовлетвореност са моят приоритет',
      // Payment & Promotions
      paymentOptions: 'Опции за плащане',
      paymentOptionsDescription: 'Разбираме, че професионалната фотография е инвестиция. Предлагаме гъвкави опции за плащане, за да направим услугите ни достъпни за всеки бюджет.',
      mostPopular: 'Най-популярен',
      discussPaymentOptions: 'Обсъдете опциите за плащане',
      limitedOffer: 'Ограничена оферта',
      seasonalPromoTitle: 'Есенна промоция 2024',
      seasonalPromoDescription: 'Резервирайте вашата есенна фотосесия до 15 октомври и получете безплатна втора локация',
      bookNow: 'Резервирайте сега',

      // Investment Page - Packages
      essentialSubtitle: 'Перфектно за малки събития',
      essentialDescription: 'Идеален избор за интимни моменти и малки празненства. Включва основните услуги за създаване на красиви спомени.',
      essentialFeatSession: '1 час фотосесия',
      essentialFeatLocation: '1 локация по избор',
      essentialFeatEditedPhotos: '20 професионално редактирани снимки',
      essentialFeatOnlineGallery: 'Онлайн галерия за 30 дни',
      essentialFeatHighRes: 'Високо разделителна способност за печат',
      essentialFeatConsultation: 'Консултация преди сесията',

      signatureSubtitle: 'Най-популярният избор',
      signatureDescription: 'Нашият най-търсен пакет, който предлага перфектния баланс между стойност и качество за вашите специални моменти.',
      signatureFeatSession: '2 часа фотосесия',
      signatureFeatLocations: 'До 2 локации',
      signatureFeatEditedPhotos: '50 професионално редактирани снимки',
      signatureFeatOnlineGallery: 'Частна онлайн галерия за 90 дни',
      signatureFeatAllPhotosFullRes: 'Всички снимки в пълна резолюция',
      signatureFeatPlanning: 'Подробна консултация и планиране',
      signatureFeatFastEdit: 'Бързо редактиране - 48 часа',
      signatureFeatExtraPhotos: 'Възможност за допълнителни снимки',

      legacySubtitle: 'Пълното изживяване',
      legacyDescription: 'Премиум пакетът за тези, които искат да запазят всеки момент. Включва всичко необходимо за създаване на вечни спомени.',
      legacyFeatSession: '4 часа фотосесия',
      legacyFeatLocations: 'Неограничен брой локации',
      legacyFeatEditedPhotos: '100+ професионално редактирани снимки',
      legacyFeatPrivateGallery: 'Частна галерия за 1 година',
      legacyFeatOriginalFiles: 'Всички оригинални файлове',
      legacyFeatAlbum: 'Персонален фотоалбум (30 страници)',
      legacyFeatPriorityEdit: 'Приоритетно редактиране - 24 часа',
      legacyFeatSecondConsult: 'Втора консултация след сесията',
      legacyFeatUSB: 'USB с всички снимки',
      legacyFeatCommercialRights: 'Права за търговска употреба',

      // Investment Page - Add-ons
      engagementDescription: 'Романтична предсватбена фотосесия за двойки. Перфектна за запознаване преди сватбата.',
      engagementFeatSession: '1 час фотосесия',
      engagementFeatEdited: '15 редактирани снимки',
      engagementFeatGallery: 'Онлайн галерия',

      secondPhotographerDescription: 'Допълнителен фотограф за по-голямо покритие и различни ъгли на събитието.',
      secondPhotographerFeatCoverage: 'Пълно покритие',
      secondPhotographerFeatAngles: 'Различни перспективи',
      secondPhotographerFeatCandids: 'Повече кандидни моменти',

      premiumAlbumDescription: 'Луксозен фотоалбум с твърди корици и професионален печат на най-добрите снимки.',
      premiumAlbumFeatPages: '50 страници',
      premiumAlbumFeatMaterials: 'Премиум материали',
      premiumAlbumFeatDesign: 'Персонализиран дизайн',

      extendedGalleryDescription: 'Удължаване на достъпа до онлайн галерията за допълнителни 6 месеца.',
      extendedGalleryFeatMonths: '6 месеца допълнително',
      extendedGalleryFeatDownloads: 'Неограничени изтегляния',
      extendedGalleryFeatSharing: 'Споделяне с близки',

      // Investment Page - Value propositions
      valueEquipmentTitle: 'Професионално оборудване',
      valueEquipmentDesc: 'Използваме най-съвременната техника и оборудване за гарантиране на перфектно качество на всяка снимка.',
      valueArtistryTitle: 'Артистична експертиза',
      valueArtistryDesc: 'Над 8 години опит в създаването на емоционални и художествени фотографии, които разказват вашата история.',
      valuePersonalApproachTitle: 'Персонализиран подход',
      valuePersonalApproachDesc: 'Всяка сесия е уникална. Работим заедно, за да създадем снимки, които отразяват вашата индивидуалност.',
      valueLongTermValueTitle: 'Дългосрочна стойност',
      valueLongTermValueDesc: 'Инвестицията в професионални снимки се увеличава с времето - спомените стават още по-ценни.',

      // Investment Page - Testimonials
      testimonialMariaName: 'Мария Петрова',
      testimonialMariaSession: 'Сватбена фотосесия',
      testimonialMariaQuote: 'Елена улови всеки емоционален момент от нашата сватба. Снимките са като произведения на изкуството - всяка разказва история. Инвестицията си заслужаваше напълно!',
      testimonialAnnaName: 'Анна Димитрова',
      testimonialAnnaSession: 'Бременност',
      testimonialAnnaQuote: 'Професионализмът и вниманието към детайлите на Елена са невероятни. Тя направи фотосесията по време на бременността ми незабравима. Резултатът надмина очакванията ми.',
      testimonialGeorgiName: 'Георги Стоянов',
      testimonialGeorgiSession: 'Семейна фотосесия',
      testimonialGeorgiQuote: 'Като семейство сме много доволни от работата на Елена. Тя успя да улови естествените моменти между нас и създаде спомени, които ще пазим завинаги.',

      // Investment Page - Payment plans
      fullPaymentDiscount: '5% отстъпка',
      fullPaymentDescription: 'Платете пълната сума при резервация и получете 5% отстъпка',
      paymentPlanDiscount: 'Без лихви',
      paymentPlanDescription: '50% депозит при резервация, останалата сума 7 дни преди сесията',
      extendedPlanDiscount: 'Гъвкавост',
      extendedPlanDescription: '30% депозит, 40% преди сесията, 30% при доставка на снимките',

      // Investment Page - Promo stats
      seasonalDiscountLabel: 'отстъпка',
      seasonalExtraLocationLabel: 'локация',
      seasonalDeliveryLabel: 'доставка',

      // Investment Page - Sections & CTAs
      investmentKeywords: 'фотография цени, сватбена фотография, семейна фотосесия, инвестиция спомени',
      unsurePackageQuestion: 'Не сте сигурни кой пакет е подходящ за вас?',
      bookFreeConsultation: 'Резервирайте безплатна консултация',
      addOnTitle: 'Допълнителни услуги',
      addOnDescription: 'Персонализирайте вашето изживяване с нашите допълнителни услуги, създадени да обогатят и допълнят основния пакет.',
      valueTitle: 'Защо да инвестирате в професионална фотография?',
      valueDescription: 'Разберете стойността зад всяка инвестиция и как професионалната фотография създава дългосрочна стойност за вас и вашето семейство.',
      includedTitle: 'Какво включва изживяването?',
      includedDescription: 'От първоначалната консултация до финалната доставка - ето пълният процес на работа с нас.',
      includedConsultationTitle: 'Първоначална консултация',
      includedConsultationDesc: 'Обсъждаме вашата визия, предпочитания и планираме детайлите на сесията.',
      includedPhotoshootTitle: 'Професионална фотосесия',
      includedPhotoshootDesc: 'Използваме най-доброто оборудване и техники за създаване на перфектни снимки.',
      includedEditingTitle: 'Професионално редактиране',
      includedEditingDesc: 'Всяка снимка се обработва индивидуално за постигане на най-високо качество.',
      includedGalleryTitle: 'Онлайн галерия',
      includedGalleryDesc: 'Частна, защитена галерия за лесно споделяне и изтегляне на снимките.',
      includedHighResTitle: 'Висока разделителна способност',
      includedHighResDesc: 'Всички снимки се доставят в пълна резолюция, готови за печат и споделяне.',
      includedSupportTitle: 'Продължаваща подкрепа',
      includedSupportDesc: 'Винаги сме на разположение за въпроси и допълнителни услуги.',
      finalCtaTitle: 'Готови да направите инвестицията?',
      finalCtaDescription: 'Нека започнем разговора за вашите мечти и как можем да ги превърнем в красиви, вечни спомени. Първата консултация е винаги безплатна.',
      qualityGuarantee: '100% гаранция за качество',
      fastDelivery: 'Бърза доставка',
      personalizedApproach: 'Персонализиран подход',
      footerTagline: 'Създаваме красиви спомени, които ще пазите завинаги. Всяка снимка разказва уникална история.',
      
      // Booking Page
      bookingHeroFeature1Title: '60-90 мин',
      bookingHeroFeature1Subtitle: 'Консултация',
      bookingHeroFeature2Title: 'Безплатно',
      bookingHeroFeature2Subtitle: 'Без задължения',
      bookingHeroFeature3Title: 'Персонално',
      bookingHeroFeature3Subtitle: 'За вашите нужди',
      bookingSuccessMessage: '✓ Вашата резервация беше изпратена успешно! Ще се свържем с вас скоро.',
      bookingErrorMessage: 'Възникна грешка при създаването на резервацията. Моля опитайте отново.',
      quickContact: 'Бърз контакт',
      callNow: 'Обадете се сега',
      sendEmail: 'Изпратете имейл',
      selectedDate: 'Избрана дата',
      inspiration: 'Вдъхновение',
      inspirationQuote: 'Всеки момент е уникален и заслужава да бъде запечатан с любов и внимание към детайла.',
      tabBooking: 'Резервация',
      tabCalendar: 'Календар',
      tabProcess: 'Процес',
      tabReviews: 'Отзиви',
      readyToBegin: 'Готови да започнем?',
      bookingCtaDescription: 'Вашата история чака да бъде разказана. Резервирайте консултацията си днес и направете първата стъпка към незабравими спомени.',
      viewMyWork: 'Вижте работата ми',
      
      // Booking Form
      bookConsultationTitle: 'Резервирайте консултация',
      bookConsultationSubtitle: 'Започнете вашето пътуване с безплатна консултация',
      personalInformation: 'Лична информация',
      fullName: 'Пълно име',
      enterYourName: 'Въведете вашето име',
      emailAddress: 'Имейл адрес',
      phoneNumber: 'Телефон',
      sessionDetails: 'Детайли за сесията',
      sessionType: 'Тип фотосесия',
      selectSessionType: 'Изберете тип сесия',
      sessionWedding: 'Сватбена фотосесия',
      sessionMaternity: 'Бременност',
      sessionFamily: 'Семейна',
      sessionEngagement: 'Годеж',
      sessionIndividual: 'Индивидуална',
      sessionCorporate: 'Корпоративна',
      sessionNewborn: 'Новородено',
      sessionOther: 'Друго',
      preferredDate: 'Предпочитана дата',
      alternativeDate: 'Алтернативна дата',
      preferredLocation: 'Предпочитано място',
      selectLocation: 'Изберете място',
      locationStudio: 'Студио',
      locationOutdoor: 'На открито',
      locationHome: 'У дома',
      locationVenue: 'Специално място',
      locationFlexible: 'Гъвкаво',
      yourVision: 'Вашата визия',
      tellMeYourVision: 'Разкажете ми за вашата визия',
      describePhotoshoot: 'Опишете как си представяте фотосесията...',
      whatDrewYou: 'Какво ви привлече в моята работа?',
      shareInspiration: 'Споделете какво ви вдъхнови...',
      specialRequests: 'Специални заявки',
      specialRequestsPlaceholder: 'Има ли нещо специално, което искате да включим...',
      agreeToTerms: 'Съгласявам се с условията за ползване и политиката за поверителност',
      receiveNews: 'Желая да получавам новини и вдъхновение за фотография',
      submitting: 'Изпращане...',
      errorRequired: 'Моля въведете',
      errorInvalidEmail: 'Невалиден имейл',
      errorSelectType: 'Моля изберете тип сесия',
      errorSelectDate: 'Моля изберете дата',
      errorAcceptTerms: 'Моля приемете условията',
      
      // Consultation Process
      initialConversationTitle: 'Първоначален разговор',
      initialConversationDesc: 'Започваме с 30-минутен разговор за вашата визия, очаквания и специални моменти, които искате да запечатаме.',
      initialConversationDuration: '30 мин',
      locationPlanningTitle: 'Планиране на локацията',
      locationPlanningDesc: 'Обсъждаме най-подходящите места за вашата фотосесия - студио, природа или специално място с значение за вас.',
      locationPlanningDuration: '15 мин',
      stylingPrepTitle: 'Стилизиране и подготовка',
      stylingPrepDesc: 'Получавате персонализиран гид за облекло, аксесоари и подготовка, за да се чувствате уверени и красиви.',
      stylingPrepDuration: '10 мин',
      finalizingDetailsTitle: 'Финализиране на детайлите',
      finalizingDetailsDesc: 'Уточняваме окончателната дата, час, пакет и всички специални заявки за перфектното изживяване.',
      finalizingDetailsDuration: '15 мин',
      expectDurationTitle: 'Времетраене',
      expectDurationDesc: 'Консултацията продължава 60-90 минути',
      expectFormatTitle: 'Формат',
      expectFormatDesc: 'Видео разговор или среща в студиото',
      expectComplimentaryTitle: 'Безплатно',
      expectComplimentaryDesc: 'Консултацията е напълно безплатна',
      expectPersonalizedTitle: 'Персонализирано',
      expectPersonalizedDesc: 'Фокус върху вашите уникални нужди',
      timelineDay1: 'Ден 1',
      timelineDay1Title: 'Консултация',
      timelineDay1Desc: 'Безплатен разговор и планиране',
      timelineDay2: 'Ден 7-14',
      timelineDay2Title: 'Фотосесия',
      timelineDay2Desc: 'Професионална фотосесия',
      timelineDay3: 'Ден 21-28',
      timelineDay3Title: 'Галерия',
      timelineDay3Desc: 'Получавате готовите снимки',
      
      // Trust Signals
      secureBookingTitle: 'Сигурно резервиране',
      secureBookingDesc: 'Вашите данни са защитени с SSL криптиране',
      flexibleReschedulingTitle: 'Гъвкаво пренасрочване',
      flexibleReschedulingDesc: 'Безплатно пренасрочване до 48 часа преди сесията',
      directContactTitle: 'Директен контакт',
      directContactDesc: 'Винаги можете да се свържете директно с мен',
      qualityGuaranteedTitle: 'Гарантирано качество',
      qualityGuaranteedDesc: '100% гаранция за удовлетвореност',
      cancellationPolicy: 'Политика за отмяна',
      cancellationItem1: 'Безплатна отмяна до 48 часа преди сесията',
      cancellationItem2: 'Пълно възстановяване при отмяна от фотографа',
      cancellationItem3: 'Гъвкави опции при непредвидени обстоятелства',
      privacyPolicyTitle: 'Политика за поверителност',
      privacyItem1: 'Вашите снимки няма да бъдат споделени без разрешение',
      privacyItem2: 'Лични данни се използват само за комуникация',
      privacyItem3: 'Възможност за изтриване на данни по всяко време',
      haveQuestions: 'Имате въпроси?',
      contactDirectly: 'Свържете се с мен директно за бърз отговор',
      
      // Approach Section - Principles
      authenticity: 'Автентичност',
      authenticityDescription: 'Вярвам в улавянето на истински емоции и моменти, не в изкуствени пози. Всяка снимка трябва да разказва истинската ви история.',
      collaboration: 'Сътрудничество',
      collaborationDescription: 'Работя в партньорство с клиентите си, създавайки комфортна атмосфера където можете да бъдете себе си пред камерата.',
      attentionToDetail: 'Внимание към детайлите',
      attentionToDetailDescription: 'От светлината до композицията, всеки елемент е важен за създаването на перфектната снимка.',
      patience: 'Търпение',
      patienceDescription: 'Най-добрите моменти не могат да бъдат принудени. Чакам подходящия момент за всяка снимка.',
      
      // Approach Section - Philosophy
      philosophyParagraph1: 'Вярвам, че най-красивите снимки се раждат от истински емоции и автентични моменти. Не търся перфектни пози, а истински усмивки, естествени жестове и спонтанни реакции.',
      philosophyParagraph2: 'Всеки клиент е уникален, затова и подходът ми е индивидуален. Отделям време да разбера вашата история, характер и визия, за да създам снимки, които наистина ви представят.',
      philosophyParagraph3: 'Фотографията е не само техника, но и емоционална връзка. Стремя се да създам комфортна атмосфера, където можете да се чувствате свободни и естествени.',
      
      // Approach Section - Process Steps
      initialConsultation: 'Първоначална консултация',
      initialConsultationDescription: 'Запознаваме се и обсъждаме вашите идеи, очаквания и визия за фотосесията.',
      planning: 'Планиране',
      planningDescription: 'Избираме локация, обсъждаме стил и подготвяме всички детайли за перфектната сесия.',
      photoshoot: 'Фотосесията',
      photoshootDescription: 'Създаваме магията заедно в релаксирана и творческа атмосфера.',
      processing: 'Обработка',
      processingDescription: 'Професионално редактиране на снимките с внимание към всеки детайл.',
      delivery: 'Доставка',
      deliveryDescription: 'Получавате готовите снимки в онлайн галерия с възможност за печат.',
      
      // Approach Section - Duration
      duration3060min: '30-60 мин',
      duration12weeks: '1-2 седмици',
      duration14hours: '1-4 часа',
      duration23weeks: '2-3 седмици',
      durationImmediate: 'Веднага',
      
      // Approach Section - CTA
      readyToCreateTogether: 'Готови ли сте да създадем нещо красиво заедно?',
      readyToCreateDescription: 'Нека се запознаем и обсъдим как мога да помогна за съхраняването на вашите най-ценни моменти.',
      viewPortfolio: 'Вижте портфолиото',
      
      // Recognition Section - Awards Categories
      weddingPhotographyCategory: 'Сватбена фотография',
      portraitPhotographyCategory: 'Портретна фотография',
      internationalRecognition: 'Международно признание',
      creativePhotography: 'Творческа фотография',
      
      // Recognition Section - Publications
      weddingStyleMagazine: 'Сватба & Стил',
      weddingStyleDescription: 'Интервю за тенденциите в сватбената фотография',
      bulgarianPhotoMagazine: 'Bulgarian Photography Magazine',
      bulgarianPhotoDescription: 'Портфолио представяне - 8 страници',
      weddingBellsBulgaria: 'Wedding Bells Bulgaria',
      weddingBellsDescription: 'Топ 10 сватбени фотографи в България',
      
      // Recognition Section - Dates
      march2024: 'Март 2024',
      january2024: 'Януари 2024',
      december2023: 'Декември 2023',
      
      // Recognition Section - Testimonials
      testimonial1Quote: 'Елена улови всички емоции от нашия специален ден. Снимките са като от приказка!',
      testimonial1Author: 'Мария и Петър',
      testimonial1Occasion: 'Сватба в Пловдив',
      testimonial2Quote: 'Професионализмът и творческият подход на Елена надминаха всичките ни очаквания.',
      testimonial2Author: 'Анна Георгиева',
      testimonial2Occasion: 'Семейна фотосесия',
      testimonial3Quote: 'Работата с Елена беше удоволствие. Тя знае как да те накара да се чувстваш комфортно.',
      testimonial3Author: 'Димитър Стоянов',
      testimonial3Occasion: 'Корпоративни портрети',
      
      // Meta tags
      photographerName: 'Елена Роуз',
      professionalPhotographer: 'Професионален фотограф',
      metaKeywords: 'фотограф България, сватбена фотография, портретна фотография, семейна фотография, професионален фотограф София',
      locationSofiaBulgaria: 'София, България',
      
      // Story Section - Milestones
      milestone2016Title: 'Началото на пътешествието',
      milestone2016Description: 'Започнах фотографията като хоби, вдъхновена от красотата на българската природа и културно наследство.',
      milestone2018Title: 'Първа професионална сватба',
      milestone2018Description: 'Заснех първата си сватба в Пловдив - момент, който промени живота ми и ме насочи към професионалната фотография.',
      milestone2020Title: 'Създаване на студио',
      milestone2020Description: 'Отворих собственото си студио в София, специализирано в интимни портретни сесии и семейна фотография.',
      milestone2022Title: 'Международно признание',
      milestone2022Description: 'Получих първата си международна награда за сватбена фотография от European Photography Awards.',
      milestone2024Title: 'Нови хоризонти',
      milestone2024Description: 'Разширих услугите си с корпоративна фотография и започнах да преподавам фотографски уъркшопи.',
      
      // Story Section - Prose
      storyParagraph1: 'Фотографията влезе в живота ми по най-естествения начин - през любовта към красотата и желанието да съхранявам моменти. Израснала в малко градче край Пловдив, винаги съм била очарована от светлината и сенките, от начина, по който те преобразяват обикновените неща в нещо магично.',
      storyParagraph2: 'Първата ми камера беше подарък за 18-ия ми рожден ден. Тогава не знаех, че този малък апарат ще промени цялата ми съдба. Започнах да снимам всичко - от семейни събирания до пейзажи, от портрети на приятели до детайли от ежедневието.',
      storyParagraph3: 'Преломният момент дойде през 2018 година, когато приятелка ме помоли да заснема сватбата ѝ. Този ден разбрах, че фотографията не е просто хоби за мен - тя е призвание. Видях как моите снимки могат да пренесат емоции, да разкажат истории и да съхранят най-ценните моменти.',
      
      // Locations Section - Location Names & Details
      oldTownPlovdiv: 'Стария град, Пловдив',
      oldTownPlovdivDescription: 'Романтичните калдъръмени улички и възрожденската архитектура създават перфектна атмосфера за сватбени и портретни снимки.',
      oldTownPlovdivSpecialty: 'Сватби и портрети',
      oldTownPlovdivBestTime: 'Златен час',
      
      boyanaChurch: 'Боянската църква, София',
      boyanaChurchDescription: 'Историческото наследство и уникалната архитектура правят това място идеално за елегантни фотосесии.',
      boyanaChurchSpecialty: 'Културни портрети',
      boyanaChurchBestTime: 'Сутрин',
      
      vitoshaMountain: 'Витоша планина',
      vitoshaMountainDescription: 'Природната красота на планината предлага безкрайни възможности за романтични и приключенски фотосесии.',
      vitoshaMountainSpecialty: 'Природни сесии',
      vitoshaMountainBestTime: 'Изгрев/залез',
      
      seaGardenVarna: 'Морската градина, Варна',
      seaGardenVarnaDescription: 'Комбинацията от море, градина и архитектура създава разнообразни възможности за всеки тип фотосесия.',
      seaGardenVarnaSpecialty: 'Семейни сесии',
      seaGardenVarnaBestTime: 'Следобед',
      
      rilaMonastery: 'Рилски манастир',
      rilaMonasteryDescription: 'Духовната атмосфера и величествената архитектура правят това място специално за дълбоки, емоционални портрети.',
      rilaMonasterySpecialty: 'Духовни портрети',
      rilaMonasteryBestTime: 'Рано сутрин',
      
      sozopol: 'Созопол',
      sozopolDescription: 'Старинният морски град с каменните къщи и морската романтика е идеален за интимни сватбени сесии.',
      sozopolSpecialty: 'Морски сватби',
      sozopolBestTime: 'Залез',
      
      // Locations Section - Services
      localKnowledge: 'Локално познание',
      localKnowledgeDescription: 'Познавам най-добрите места и времена за снимане в цяла България',
      timePlanning: 'Планиране на времето',
      timePlanningDescription: 'Оптимизирам времето според светлината и атмосферата на всяка локация',
      adaptiveTechnique: 'Адаптивна техника',
      adaptiveTechniqueDescription: 'Използвам подходящо оборудване според спецификите на всяко място',
      emotionalConnection: 'Емоционална връзка',
      emotionalConnectionDescription: 'Помагам да изберете място, което има специално значение за вас',
      
      // Locations Section - Location Planning
      locationPlanning: 'Планиране на локацията',
      locationPlanningParagraph1: 'Избирането на правилната локация е ключово за успеха на всяка фотосесия. Работя с вас, за да намерим мястото, което най-добре отговаря на вашата визия и стил.',
      locationPlanningParagraph2: 'Имам опит с фотосесии в цяла България - от планински върхове до морски брегове, от исторически центрове до модерни градски пространства.',
      locationPlanningParagraph3: 'За всяка локация подготвям детайлен план, включващ най-добрите времена за снимане, необходимите разрешения и логистичните детайли.',
      discussLocation: 'Обсъдете локация',
      viewGalleryButton: 'Вижте галерията',
      locationPlanningAlt: 'Планиране на фотосесия',
      locationsCount: 'Локации',
      coverageInBulgaria: 'Покритие в България',
      coverageNote: 'Работя в цяла България. За локации извън София се прилага допълнителна такса за пътуване.',
      studioWorkAlt: 'Работа в студиото',
      weddingPhotoshootAlt: 'Сватбена фотосесия',
      outdoorPhotoshootAlt: 'Външна фотосесия',
      onLocationText: 'На локация',
    }
  };

// Language context
const LanguageContext = createContext();

// Language provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bg' ? 'en' : 'bg');
  };

const t = (key, fallback) =>
    translations?.[language]?.[key] ??
    translations?.bg?.[key] ??
    fallback ??
    key;

  const value = {
    language,
    setLanguage,
    toggleLanguage,
     t,
    isEnglish: language === 'en',
    isBulgarian: language === 'bg'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation hook
export const useTranslations = () => {
  const { language } = useLanguage();
  const t = (key) => {
    return translations?.[language]?.[key] || translations?.bg?.[key] || key;
  };
  
  return { t, translations: translations?.[language] };
};