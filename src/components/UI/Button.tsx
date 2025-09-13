import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/25',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      tabIndex={disabled ? -1 : 0}
    >
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" aria-label="Loading" />}
      {children}
    </motion.button>
  );
}