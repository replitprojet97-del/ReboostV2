import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface UserStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  currency?: boolean;
  testId?: string;
}

export function UserStat({ label, value, icon: Icon, trend, currency, testId }: UserStatProps) {
  return (
    <div className="space-y-2" data-testid={testId}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {currency && typeof value === 'number'
            ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
            : value}
        </p>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
              trend.isPositive
                ? 'bg-accent/10 text-accent'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
