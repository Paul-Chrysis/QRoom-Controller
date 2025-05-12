import React from 'react';

const Label = ({ 
  htmlFor, 
  children, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block mb-2 text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
