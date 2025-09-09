import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryIntro = ({ category, language }) => {
  const translations = {
    bg: {
      weddings: {
        title: 'Сватбени снимки',
        description: `Всяка сватба е уникална история на любов, която заслужава да бъде разказана с артистичност и елегантност. Моят подход към сватбената фотография съчетава романтичния стил с документалния, улавяйки както планираните моменти, така и спонтанните емоции.\n\nОт първата среща до последния танц, аз съм там да запечатам всеки смях, всяка сълза на радост и всеки нежен поглед между вас.`,
        approach: 'Романтичен и документален стил'
      },
      maternity: {
        title: 'Бременност',
        description: `Бременността е едно от най-красивите пътешествия в живота на жената. Тези месеци на очакване, пълни с вълнение и любов, заслужават да бъдат запечатани с нежност и артистичност.\n\nМоите сесии за бременност са създадени да празнуват женската красота и силата, създавайки спомени, които ще съхранявате завинаги.`,
        approach: 'Нежен и артистичен подход'
      },
      family: {
        title: 'Семейни снимки',
        description: `Семейството е основата на всичко красиво в живота. Моята цел е да уловя истинската връзка между членовете на семейството - смеха, нежността, играта и любовта, която ви обединява.\n\nВсяка семейна сесия е персонализирана според вашия стил и предпочитания, създавайки естествени и автентични моменти.`,
        approach: 'Естествен и автентичен стил'
      },
      headshots: {
        title: 'Професионални портрети',
        description: `Професионалният портрет е вашата визитна картичка в бизнес света. Моята цел е да създам снимки, които не само показват вашия професионализъм, но и разкриват вашата личност и увереност.\n\nВсеки портрет е внимателно планиран и изпълнен, за да отразява най-добрата версия на вас.`,
        approach: 'Професионален и уверен стил'
      },
      couples: {
        title: 'Двойки',
        description: `Любовта между двама души е нещо магическо, което заслужава да бъде запечатано с красота и емоция. Моите сесии за двойки са създадени да разкрият вашата уникална връзка и интимност.\n\nОт годежни снимки до романтични сесии, аз улавям моментите, които разказват вашата история на любов.`,
        approach: 'Романтичен и интимен стил'
      }
    },
    en: {
      weddings: {
        title: 'Wedding Photography',
        description: `Every wedding is a unique love story that deserves to be told with artistry and elegance. My approach to wedding photography combines romantic style with documentary, capturing both planned moments and spontaneous emotions.\n\nFrom the first meeting to the last dance, I'm there to capture every laugh, every tear of joy, and every tender glance between you.`,approach: 'Romantic and documentary style'
      },
      maternity: {
        title: 'Maternity Photography',
        description: `Pregnancy is one of the most beautiful journeys in a woman's life. These months of anticipation, full of excitement and love, deserve to be captured with tenderness and artistry.\n\nMy maternity sessions are designed to celebrate feminine beauty and strength, creating memories you'll treasure forever.`,
        approach: 'Tender and artistic approach'
      },
      family: {
        title: 'Family Photography',
        description: `Family is the foundation of everything beautiful in life. My goal is to capture the true connection between family members - the laughter, tenderness, play, and love that unites you.\n\nEach family session is personalized according to your style and preferences, creating natural and authentic moments.`,
        approach: 'Natural and authentic style'
      },
      headshots: {
        title: 'Professional Headshots',description: `A professional headshot is your business card in the professional world. My goal is to create images that not only show your professionalism but also reveal your personality and confidence.\n\nEach portrait is carefully planned and executed to reflect the best version of you.`,approach: 'Professional and confident style'
      },
      couples: {
        title: 'Couples Photography',description: `The love between two souls is something magical that deserves to be captured with beauty and emotion. My couples sessions are designed to reveal your unique connection and intimacy.\n\nFrom engagement photos to romantic sessions, I capture the moments that tell your love story.`,approach: 'Romantic and intimate style'
      }
    }
  };

  const categoryData = translations?.[language]?.[category];
  
  if (!categoryData || category === 'all') return null;

  const getIcon = (category) => {
    const icons = {
      weddings: 'Heart',
      maternity: 'Baby',
      family: 'Users',
      headshots: 'User',
      couples: 'UserHeart'
    };
    return icons?.[category] || 'Camera';
  };

  return (
    <div className="bg-warm-section rounded-lg p-8 mb-8 scroll-reveal">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name={getIcon(category)} size={28} className="text-sophisticated-dark" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-heading font-medium text-sophisticated-dark mb-4">
          {categoryData?.title}
        </h2>
        
        <div className="prose prose-sm md:prose-base max-w-none">
          {categoryData?.description?.split('\n\n')?.map((paragraph, index) => (
            <p key={index} className="text-hierarchy-secondary leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-accent rounded-full">
          <Icon name="Palette" size={16} className="text-sophisticated-dark mr-2" />
          <span className="text-sm font-sophisticated text-sophisticated-dark">
            {categoryData?.approach}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryIntro;