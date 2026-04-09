import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'gold' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: ReactNode;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const gradientClasses = {
      primary: 'bg-gradient-to-r from-primary via-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/25 border-0',
      emerald: 'bg-gradient-to-r from-emerald-500 via-accent to-emerald-600 text-white shadow-lg shadow-accent/25 border-0',
      gold: 'bg-gradient-to-r from-amber-500 via-gold to-amber-600 text-gold-foreground shadow-lg shadow-gold/25 border-0',
      default: '',
    };

    const buttonContent = (
      <>
        {Icon && iconPosition === 'left' && !isLoading && <Icon className="w-4 h-4" />}
        {isLoading && (
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <span className="flex-1">{children}</span>
        {Icon && iconPosition === 'right' && !isLoading && <Icon className="w-4 h-4" />}
      </>
    );

    if (variant === 'default') {
      return (
        <Button
          ref={ref}
          size={size}
          disabled={disabled || isLoading}
          className={className}
          {...props}
        >
          {buttonContent}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        size={size}
        disabled={disabled || isLoading}
        className={cn(
          'gap-2 no-default-hover-elevate no-default-active-elevate transition-all duration-200',
          gradientClasses[variant],
          className
        )}
        style={{
          '--elevate-1': 'rgba(255,255,255,0.1)',
          '--elevate-2': 'rgba(255,255,255,0.15)',
        } as React.CSSProperties}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
