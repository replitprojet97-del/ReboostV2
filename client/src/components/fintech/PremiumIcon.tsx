import { LucideIcon } from 'lucide-react';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface PremiumIconProps {
  icon: LucideIcon;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  animated?: boolean;
}

const sizeClasses: Record<IconSize, { container: string; icon: string }> = {
  xs: { container: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4' },
  sm: { container: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
  md: { container: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
  lg: { container: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
  xl: { container: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8' },
};

const variantClasses: Record<IconVariant, { bg: string; icon: string }> = {
  primary: {
    bg: 'bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 shadow-sm shadow-primary/10',
    icon: 'text-primary',
  },
  accent: {
    bg: 'bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 shadow-sm shadow-accent/10',
    icon: 'text-accent',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5 shadow-sm shadow-emerald-500/10',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 shadow-sm shadow-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    bg: 'bg-gradient-to-br from-red-500/15 via-red-500/10 to-red-500/5 shadow-sm shadow-red-500/10',
    icon: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-blue-500/5 shadow-sm shadow-blue-500/10',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  muted: {
    bg: 'bg-gradient-to-br from-muted-foreground/10 via-muted-foreground/5 to-muted-foreground/[0.02] shadow-sm',
    icon: 'text-muted-foreground',
  },
};

export function PremiumIcon({
  icon: Icon,
  size = 'md',
  variant = 'primary',
  className = '',
  animated = false,
}: PremiumIconProps) {
  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];

  return (
    <div
      className={`
        flex items-center justify-center
        ${sizeClass.container}
        ${variantClass.bg}
        transition-all duration-300
        ${animated ? 'group-hover:scale-105 group-hover:shadow-md' : ''}
        ${className}
      `}
    >
      <Icon className={`${sizeClass.icon} ${variantClass.icon}`} />
    </div>
  );
}

export type { IconSize, IconVariant, PremiumIconProps };
