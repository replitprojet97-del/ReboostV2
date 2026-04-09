import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  testId?: string;
}

export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  children,
  className = '',
  headerAction,
  testId,
}: DashboardCardProps) {
  return (
    <Card 
      className={`overflow-visible bg-card/80 backdrop-blur-md border-border/40 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 ${className}`}
      style={{ borderRadius: 'var(--dashboard-radius)' }}
      data-testid={testId}
    >
      {(title || Icon) && (
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {Icon && (
                <div className={`flex items-center justify-center rounded-2xl p-3 bg-primary/5 border border-primary/10 ${iconColor} shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <p className="text-sm font-medium text-muted-foreground mt-1.5">{subtitle}</p>
                )}
              </div>
            </div>
            {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={`${title || Icon ? 'pt-0' : 'pt-8'} px-6 pb-6`}>
        {children}
      </CardContent>
    </Card>
  );
}
