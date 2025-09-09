import React from 'react';
import Button from '../../../components/ui/Button';


const GalleryFilter = ({ 
  activeCategory, 
  onCategoryChange, 
  activeStyle, 
  onStyleChange, 
  activeSeason, 
  onSeasonChange,
  language 
}) => {
  const translations = {
    bg: {
      categories: {
        all: 'Всички',
        weddings: 'Сватби',
        maternity: 'Бременност',
        family: 'Семейство',
        headshots: 'Портрети',
        couples: 'Двойки'
      },
      styles: {
        all: 'Всички стилове',
        romantic: 'Романтичен',
        editorial: 'Редакционен',
        candid: 'Естествен'
      },
      seasons: {
        all: 'Всички сезони',
        spring: 'Пролет',
        summer: 'Лято',
        autumn: 'Есен',
        winter: 'Зима'
      },
      filterBy: 'Филтриране по:'
    },
    en: {
      categories: {
        all: 'All',
        weddings: 'Weddings',
        maternity: 'Maternity',
        family: 'Family',
        headshots: 'Headshots',
        couples: 'Couples'
      },
      styles: {
        all: 'All Styles',
        romantic: 'Romantic',
        editorial: 'Editorial',
        candid: 'Candid'
      },
      seasons: {
        all: 'All Seasons',
        spring: 'Spring',
        summer: 'Summer',
        autumn: 'Autumn',
        winter: 'Winter'
      },
      filterBy: 'Filter by:'
    }
  };

  const t = translations?.[language];

  const categories = [
    { key: 'all', label: t?.categories?.all, icon: 'Grid' },
    { key: 'weddings', label: t?.categories?.weddings, icon: 'Heart' },
    { key: 'maternity', label: t?.categories?.maternity, icon: 'Baby' },
    { key: 'family', label: t?.categories?.family, icon: 'Users' },
    { key: 'headshots', label: t?.categories?.headshots, icon: 'User' },
    { key: 'couples', label: t?.categories?.couples, icon: 'UserHeart' }
  ];

  const styles = [
    { key: 'all', label: t?.styles?.all },
    { key: 'romantic', label: t?.styles?.romantic },
    { key: 'editorial', label: t?.styles?.editorial },
    { key: 'candid', label: t?.styles?.candid }
  ];

  const seasons = [
    { key: 'all', label: t?.seasons?.all },
    { key: 'spring', label: t?.seasons?.spring },
    { key: 'summer', label: t?.seasons?.summer },
    { key: 'autumn', label: t?.seasons?.autumn },
    { key: 'winter', label: t?.seasons?.winter }
  ];

  return (
    <div className="bg-surface-elevation rounded-lg p-6 shadow-soft mb-8">
      <h3 className="text-lg font-heading font-medium text-sophisticated-dark mb-6">
        {t?.filterBy}
      </h3>
      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.key}
              variant={activeCategory === category?.key ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category?.key)}
              iconName={category?.icon}
              iconPosition="left"
              iconSize={16}
              className={`elegant-hover ${
                activeCategory === category?.key 
                  ? 'bg-gradient-to-r from-accent to-secondary text-sophisticated-dark shadow-soft' 
                  : ''
              }`}
            >
              {category?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Style and Season Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Filter */}
        <div>
          <h4 className="text-sm font-sophisticated text-hierarchy-secondary mb-3">
            Style
          </h4>
          <div className="flex flex-wrap gap-2">
            {styles?.map((style) => (
              <Button
                key={style?.key}
                variant={activeStyle === style?.key ? "secondary" : "ghost"}
                size="xs"
                onClick={() => onStyleChange(style?.key)}
                className="elegant-hover"
              >
                {style?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Season Filter */}
        <div>
          <h4 className="text-sm font-sophisticated text-hierarchy-secondary mb-3">
            Season
          </h4>
          <div className="flex flex-wrap gap-2">
            {seasons?.map((season) => (
              <Button
                key={season?.key}
                variant={activeSeason === season?.key ? "secondary" : "ghost"}
                size="xs"
                onClick={() => onSeasonChange(season?.key)}
                className="elegant-hover"
              >
                {season?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryFilter;