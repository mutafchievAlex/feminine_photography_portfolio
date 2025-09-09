import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeasonalPromotion = ({ onBookNow }) => {
  return (
    <div className="relative bg-gradient-to-r from-accent to-secondary rounded-2xl p-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <Icon 
              name="Sparkles" 
              size={16} 
              className="text-sophisticated-dark" 
            />
            <span className="text-sm font-sophisticated text-sophisticated-dark">
              Ограничена оферта
            </span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="font-heading text-2xl font-medium text-sophisticated-dark mb-2">
            Есенна промоция 2024
          </h3>
          <p className="text-sophisticated-dark/80 leading-relaxed max-w-md mx-auto">
            Резервирайте вашата есенна фотосесия до 15 октомври и получете безплатна втора локация
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-heading font-medium text-sophisticated-dark">
              15%
            </div>
            <div className="text-sm text-sophisticated-dark/80">
              отстъпка
            </div>
          </div>
          
          <div className="w-px h-12 bg-sophisticated-dark/20"></div>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-medium text-sophisticated-dark">
              +1
            </div>
            <div className="text-sm text-sophisticated-dark/80">
              локация
            </div>
          </div>
          
          <div className="w-px h-12 bg-sophisticated-dark/20"></div>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-medium text-sophisticated-dark">
              48ч
            </div>
            <div className="text-sm text-sophisticated-dark/80">
              доставка
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button
            variant="outline"
            className="bg-white/20 border-sophisticated-dark/30 text-sophisticated-dark hover:bg-white/30 magnetic-hover"
            onClick={onBookNow}
          >
            Резервирайте сега
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeasonalPromotion;