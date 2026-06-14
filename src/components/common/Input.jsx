import React from 'react';

export const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-neutral-dark opacity-85">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-3 rounded-lg border bg-neutral-light transition-all duration-200 outline-none
          focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10
          ${error ? 'border-primary bg-red-50 focus:ring-red-200' : 'border-neutral-border'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-primary font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
export default Input;
