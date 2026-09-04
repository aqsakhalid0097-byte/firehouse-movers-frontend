import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon: LeftIcon, rightElement, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full ${
              LeftIcon ? 'pl-10' : 'pl-4'
            } ${rightElement ? 'pr-10' : 'pr-4'} py-3 bg-[#262626] border text-white text-sm rounded-lg transition-all outline-none ${
              error
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-neutral-800 hover:border-neutral-700 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
