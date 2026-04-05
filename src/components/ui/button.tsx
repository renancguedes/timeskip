'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 glow-purple',
  secondary: 'bg-surface-lighter text-gray-200 hover:bg-surface-light focus:ring-violet-500',
  outline: 'border border-surface-lighter text-gray-300 hover:bg-surface-lighter hover:text-gray-100 focus:ring-violet-500',
  ghost: 'text-gray-400 hover:bg-surface-lighter hover:text-gray-200 focus:ring-violet-500',
  danger: 'bg-red-600/80 text-white hover:bg-red-500 focus:ring-red-500',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
