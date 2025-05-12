import React from 'react';

const Progress = ({ 
  progress, 
  color = 'primary', 
  size = 'md',
  label = true,
  labelPosition = 'inside',
  labelText,
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-600',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    danger: 'bg-gradient-to-r from-red-400 to-red-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    info: 'bg-gradient-to-r from-blue-400 to-blue-600',
    teal: 'bg-gradient-to-r from-teal-400 to-teal-600',
  };
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-10',
  };
  
  const progressValue = Math.min(Math.max(0, progress), 100);
  const displayText = labelText || `${progressValue}%`;
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {label && labelPosition === 'outside-top' && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{displayText}</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-xl shadow-inner dark:bg-gray-700 ${sizes[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center relative`}
          style={{ 
            width: `${progressValue}%`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12 animate-pulse"
              style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
            ></div>
          </div>
          
          {label && labelPosition === 'inside' && size !== 'xs' && size !== 'sm' && (
            <span className="text-sm font-semibold text-white relative z-10 drop-shadow-sm">
              {displayText}
            </span>
          )}
        </div>
      </div>
      
      {label && labelPosition === 'outside-bottom' && (
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-700">{displayText}</span>
        </div>
      )}
    </div>
  );
};

export default Progress;
