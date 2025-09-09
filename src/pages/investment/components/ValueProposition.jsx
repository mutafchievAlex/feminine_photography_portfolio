import React from 'react';
import Icon from '../../../components/AppIcon';

const ValueProposition = ({ proposition }) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto shadow-soft">
        <Icon 
          name={proposition?.icon} 
          size={24} 
          className="text-sophisticated-dark" 
        />
      </div>
      <h3 className="font-heading text-xl font-medium text-sophisticated-dark">
        {proposition?.title}
      </h3>
      <p className="text-hierarchy-secondary leading-relaxed">
        {proposition?.description}
      </p>
    </div>
  );
};

export default ValueProposition;