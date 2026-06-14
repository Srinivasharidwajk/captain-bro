import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-dark text-neutral-dark shadow-lg shadow-secondary/15 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary',
    ghost: 'text-neutral-dark hover:bg-neutral-light focus:ring-neutral-border',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 focus:ring-red-600'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg w-full'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed transform-none shadow-none' : 'active:scale-95'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
export default Button;
