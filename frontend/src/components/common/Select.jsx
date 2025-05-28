import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label, 
  name, 
  value, 
  onChange, 
  children, 
  required = false,
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          block w-full rounded-md border-gray-300 dark:border-gray-600 
          shadow-sm focus:border-blue-500 focus:ring-blue-500 
          dark:bg-gray-700 dark:text-white
          sm:text-sm
          ${error ? 'border-red-300 dark:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 