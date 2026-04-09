import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/i18n';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface UpcomingRepaymentsChartProps {
  data: Array<{
    month: string;
    loan1: number;
    loan2: number;
    loan3: number;
  }>;
}

export default function UpcomingRepaymentsChart({ data }: UpcomingRepaymentsChartProps) {
  const t = useTranslations();

  return (
    <Card className="dashboard-card border-0">
      <CardHeader className="pb-3">
        <div className="inline-block bg-primary/10 px-3 py-1.5 rounded-full">
          <CardTitle className="text-sm font-semibold text-primary">{t.dashboard.upcomingRepayments}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) =>
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(value)
                }
              />
              <Bar dataKey="loan1" stackId="a" fill="#2563EB" name={`${t.loan.loanNumber} #1`} radius={[8, 8, 0, 0]} />
              <Bar dataKey="loan2" stackId="a" fill="#60A5FA" name={`${t.loan.loanNumber} #2`} />
              <Bar dataKey="loan3" stackId="a" fill="#93C5FD" name={`${t.loan.loanNumber} #3`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
