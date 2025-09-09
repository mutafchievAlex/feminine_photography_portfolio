import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-surface-elevation rounded-xl p-8 shadow-soft elegant-hover">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)]?.map((_, index) => (
          <Icon 
            key={index}
            name="Star" 
            size={16} 
            className="text-accent fill-current" 
          />
        ))}
      </div>
      <blockquote className="text-sophisticated-dark leading-relaxed mb-6 font-sophisticated">
        "{testimonial?.quote}"
      </blockquote>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image 
            src={testimonial?.avatar} 
            alt={testimonial?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h4 className="font-sophisticated font-medium text-sophisticated-dark">
            {testimonial?.name}
          </h4>
          <p className="text-sm text-hierarchy-secondary">
            {testimonial?.session}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;