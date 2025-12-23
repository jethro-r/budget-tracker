'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = [
  'rgb(var(--chart-1))',
  'rgb(var(--chart-2))',
  'rgb(var(--chart-3))',
  'rgb(var(--chart-4))',
  'rgb(var(--chart-5))',
  'rgb(var(--chart-6))',
];

export interface CategoryData {
  name: string;
  value: number;
}

interface SpendingByCategoryProps {
  data: CategoryData[];
  title?: string;
}

export function SpendingByCategory({ data, title = 'Spending by Category' }: SpendingByCategoryProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[rgb(var(--text-muted))] text-center py-8">
            No spending data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(var(--bg-secondary))',
                border: '1px solid rgba(var(--border), var(--border-opacity))',
                borderRadius: '0.5rem',
                color: 'rgb(var(--text-primary))',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend
              wrapperStyle={{
                color: 'rgb(var(--text-secondary))',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Total: <span className="font-semibold text-[rgb(var(--text-primary))]">${total.toFixed(2)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
