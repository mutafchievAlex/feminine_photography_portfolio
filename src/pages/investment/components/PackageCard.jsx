import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PackageCard = ({ 
  package: pkg, 
  isPopular = false, 
  onSelectPackage 
}) => {
  return (
    <div className={`relative bg-surface-elevation rounded-2xl p-8 shadow-soft elegant-hover transition-all duration-300 ${
      isPopular 
        ? 'ring-2 ring-accent shadow-medium transform scale-105' 
        : 'hover:shadow-medium'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-accent to-secondary px-6 py-2 rounded-full shadow-soft">
            <span className="text-sm font-sophisticated text-sophisticated-dark">Most Popular</span>
          </div>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl font-medium text-sophisticated-dark mb-2">
          {pkg?.name}
        </h3>
        <p className="text-hierarchy-secondary text-sm mb-6">
          {pkg?.subtitle}
        </p>
        
        <div className="mb-6">
          <span className="text-4xl font-heading font-medium text-sophisticated-dark">
            {pkg?.price}
          </span>
          <span className="text-hierarchy-secondary text-sm ml-2">лв</span>
        </div>
        
        <p className="text-hierarchy-secondary text-sm leading-relaxed">
          {pkg?.description}
        </p>
      </div>
      <div className="space-y-4 mb-8">
        {pkg?.features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                name="Check" 
                size={16} 
                className="text-accent" 
              />
            </div>
            <span className="text-sm text-sophisticated-dark font-sophisticated">
              {feature}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Button
          variant={isPopular ? "default" : "outline"}
          fullWidth
          className={isPopular 
            ? "bg-gradient-to-r from-accent to-secondary text-sophisticated-dark magnetic-hover" :"elegant-hover"
          }
          onClick={() => onSelectPackage(pkg)}
        >
          Choose {pkg?.name}
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          className="text-hierarchy-secondary hover:text-sophisticated-dark"
          onClick={() => onSelectPackage(pkg, 'consultation')}
        >
          Book Consultation
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;