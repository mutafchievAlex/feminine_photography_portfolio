import React from 'react';
import Icon from '../../../components/AppIcon';

const AddOnService = ({ service }) => {
  return (
    <div className="bg-surface-elevation rounded-xl p-6 elegant-hover transition-all duration-300 hover:shadow-soft">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
            <Icon 
              name={service?.icon} 
              size={20} 
              className="text-sophisticated-dark" 
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-sophisticated font-medium text-sophisticated-dark">
              {service?.name}
            </h4>
            <span className="text-lg font-heading font-medium text-sophisticated-dark">
              +{service?.price} лв
            </span>
          </div>
          
          <p className="text-sm text-hierarchy-secondary leading-relaxed mb-3">
            {service?.description}
          </p>
          
          {service?.features && (
            <div className="space-y-1">
              {service?.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon 
                    name="Dot" 
                    size={12} 
                    className="text-accent" 
                  />
                  <span className="text-xs text-hierarchy-secondary">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOnService;