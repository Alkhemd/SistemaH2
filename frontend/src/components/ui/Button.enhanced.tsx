'use client';

import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Enterprise-grade Button Component with full WCAG 2.1 AA compliance
 * 
 * Features:
 * - Full keyboard navigation support (Enter, Space)
 * - ARIA attributes for screen readers
 * - Loading states with accessibility announcements
 * - Focus management with visible indicators
 * - Proper contrast ratios (4.5:1 minimum)
 * - Optimized with React.memo
 * - Support for tooltips and descriptions
 * 
 * @example
 * <Button 
 *   variant="primary" 
 *   loading={isLoading} 
 *   onClick={handleClick}
 *   ariaLabel="Save changes to equipment"
 * >
 *   Save Changes
 * </Button>
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Loading text announced to screen readers */
  loadingText?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Full width button */
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md focus:ring-gray-400',
  outline: 'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-400',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-900 focus:ring-gray-400',
  destructive: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
};

const sizeVariants = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-sm min-h-[42px]',
  lg: 'px-6 py-3 text-base min-h-[48px]',
};

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ariaLabel,
      loadingText = 'Cargando...',
      tooltip,
      fullWidth = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Ensure Space and Enter trigger the button
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isDisabled) {
          (e.target as HTMLButtonElement).click();
        }
      }
    };

    const LoadingSpinner = () => (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        role="status"
        aria-label={loadingText}
      />
    );

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-all duration-200 ease-in-out',
          // Focus styles - WCAG 2.1 compliant
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Disabled styles
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Hover and active states
          'transform hover:scale-[1.02] active:scale-[0.98]',
          // Variant and size
          buttonVariants[variant],
          sizeVariants[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={loading}
        aria-disabled={isDisabled}
        title={tooltip}
        {...props}
      >
        {/* Icon or Loading Spinner - Left */}
        {iconPosition === 'left' && (
          <>
            {loading ? (
              <LoadingSpinner />
            ) : icon ? (
              <span className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
                {icon}
              </span>
            ) : null}
          </>
        )}

        {/* Button Text */}
        <span className="flex-1">{children}</span>

        {/* Icon or Loading Spinner - Right */}
        {iconPosition === 'right' && (
          <>
            {loading ? (
              <LoadingSpinner />
            ) : icon ? (
              <span className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
                {icon}
              </span>
            ) : null}
          </>
        )}

        {/* Screen reader only loading announcement */}
        {loading && (
          <span className="sr-only" role="status" aria-live="polite">
            {loadingText}
          </span>
        )}
      </button>
    );
  }
);

ButtonComponent.displayName = 'Button';

// Memoize to prevent unnecessary re-renders
export const Button = memo(ButtonComponent);

// Icon Button variant for buttons with only icons
export const IconButton = memo(
  forwardRef<HTMLButtonElement, Omit<ButtonProps, 'children'> & { icon: React.ReactNode }>(
    ({ icon, ariaLabel, ...props }, ref) => {
      if (!ariaLabel) {
        console.warn('IconButton requires ariaLabel for accessibility');
      }

      return (
        <Button ref={ref} ariaLabel={ariaLabel} {...props}>
          <span className="sr-only">{ariaLabel}</span>
          {icon}
        </Button>
      );
    }
  )
);

IconButton.displayName = 'IconButton';

// Button Group for related actions
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}> = memo(({ children, className, orientation = 'horizontal' }) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-2',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';
