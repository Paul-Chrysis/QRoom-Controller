import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'default',
  rounded = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white border border-gray-200';
  
  const paddingSizes = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const shadowTypes = {
    none: '',
    default: 'shadow-card',
    soft: 'shadow-soft',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  const roundedSizes = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  
  const cardClasses = `${baseClasses} ${paddingSizes[padding]} ${shadowTypes[shadow]} ${roundedSizes[rounded]} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card subcomponents
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 pb-3 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 pt-3 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-800 ${className}`} {...props}>
    {children}
  </h3>
);

Card.Text = ({ children, className = '', ...props }) => (
  <p className={`text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

export default Card;
