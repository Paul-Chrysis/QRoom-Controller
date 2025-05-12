import React from 'react';

const ToggleSwitch = ({ 
  checked = false, 
  onChange, 
  sizing = 'md', 
  color = 'primary',
  disabled = false,
  readOnly = false,
  ...props 
}) => {
  const sizes = {
    sm: 'h-5 w-9',
    md: 'h-7 w-14',
    lg: 'h-8 w-16',
  };
  
  const thumbSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };
  
  const colors = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600',
    teal: 'bg-gradient-to-r from-teal-500 to-teal-600',
  };
  
  const handleChange = (e) => {
    if (readOnly) return;
    if (onChange) onChange(e);
  };
  
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={handleChange}
        disabled={disabled || readOnly}
        {...props}
      />
      <div
        className={`
          ${sizes[sizing]} 
          peer rounded-full 
          ${checked ? colors[color] : 'bg-gray-300'} 
          shadow-inner
          peer-focus:outline-none 
          peer-focus:ring-2 
          peer-focus:ring-${color === 'primary' ? 'primary' : color}-300 
          dark:peer-focus:ring-${color === 'primary' ? 'primary' : color}-800 
          dark:bg-gray-700 
          peer-disabled:opacity-50 
          peer-disabled:cursor-not-allowed
          transition-all duration-300 ease-in-out
        `}
      >
        <div
          className={`
            ${thumbSizes[sizing]} 
            absolute 
            rounded-full 
            bg-white 
            shadow-md
            transition-all 
            duration-300 
            ease-in-out
          `}
          style={{
            transform: checked ? `translateX(${sizing === 'sm' ? '100%' : sizing === 'md' ? '115%' : '112%'})` : 'translateX(0)',
            top: '50%',
            marginTop: sizing === 'sm' ? '-0.5rem' : sizing === 'md' ? '-0.75rem' : '-0.875rem',
            left: '0.125rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Optional icon inside thumb */}
          {checked && (
            <svg 
              className="w-3/5 h-3/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
