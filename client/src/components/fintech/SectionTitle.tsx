import { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionTitle({ title, subtitle, action, className = '' }: SectionTitleProps) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-8 ${className}`}>
      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base font-medium text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">{action}</div>}
    </div>
  );
}
