'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeVsExpenseProps {
  data: MonthlyData[];
  title?: string;
}

export function IncomeVsExpense({ data, title = 'Income vs Expenses' }: IncomeVsExpenseProps) {
  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[rgb(var(--text-muted))] text-center py-8">
            No income or expense data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.1)" />
            <XAxis
              dataKey="month"
              stroke="rgb(var(--text-muted))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(var(--text-muted))"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
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
            <Line
              type="monotone"
              dataKey="income"
              stroke="rgb(var(--accent-success))"
              strokeWidth={2}
              dot={{ fill: 'rgb(var(--accent-success))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="rgb(var(--accent-danger))"
              strokeWidth={2}
              dot={{ fill: 'rgb(var(--accent-danger))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
