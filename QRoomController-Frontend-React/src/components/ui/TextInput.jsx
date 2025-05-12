import React, { forwardRef } from 'react';

const TextInput = forwardRef(({ 
  type = 'text',
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props 
}, ref) => {
  const baseInputClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200';
  const defaultInputClasses = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorInputClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed text-gray-500';
  
  const inputClasses = `
    ${baseInputClasses} 
    ${error ? errorInputClasses : defaultInputClasses} 
    ${disabled ? disabledClasses : ''} 
    ${inputClassName}
  `;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
