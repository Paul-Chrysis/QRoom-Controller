import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'animate-spin rounded-full border-t-transparent';
  
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };
  
  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600',
    info: 'border-blue-600',
  };
  
  const spinnerClasses = `${baseClasses} ${sizes[size]} ${colors[color]} ${className}`;
  
  return (
    <div className="flex justify-center items-center" {...props}>
      <div className={spinnerClasses} role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
