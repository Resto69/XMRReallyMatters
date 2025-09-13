import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, showPassword, onTogglePassword, className = '', type, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type === 'password' && showPassword ? 'text' : type}
            className={`block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              error ? 'border-red-500' : ''
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500" id={`${props.id}-error`} role="alert">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';