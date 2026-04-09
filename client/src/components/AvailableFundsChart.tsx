import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/i18n';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AvailableFundsChartProps {
  data: Array<{
    month: string;
    available: number;
    committed: number;
    reserved: number;
  }>;
}

export default function AvailableFundsChart({ data }: AvailableFundsChartProps) {
  const t = useTranslations();

  return (
    <Card className="lg:col-span-2 shadow-xl border-2 border-lime-100 dark:border-lime-900 bg-gradient-to-br from-white via-lime-50/30 to-green-50/30 dark:from-slate-800 dark:via-lime-950/30 dark:to-green-950/30">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-lime-600 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text text-transparent">{t.dashboard.availableFunds}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCommitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReserved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) =>
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(value)
                }
              />
              <Area
                type="monotone"
                dataKey="available"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorAvailable)"
                name="Disponible"
              />
              <Area
                type="monotone"
                dataKey="committed"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorCommitted)"
                name="Engagé"
              />
              <Area
                type="monotone"
                dataKey="reserved"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#colorReserved)"
                name="Réservé"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
