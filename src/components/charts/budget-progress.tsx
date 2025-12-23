'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BudgetData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface BudgetProgressProps {
  data: BudgetData[];
  title?: string;
}

export function BudgetProgress({ data, title = 'Budget Progress' }: BudgetProgressProps) {
  const getColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'rgb(var(--accent-danger))';
    if (percentage >= 80) return 'rgb(var(--accent-warning))';
    return 'rgb(var(--accent-success))';
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[rgb(var(--text-muted))] text-center py-8">
            No budget data available
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
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.1)" />
            <XAxis
              type="number"
              stroke="rgb(var(--text-muted))"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="rgb(var(--text-muted))"
              style={{ fontSize: '12px' }}
              width={100}
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
            <Bar dataKey="spent" radius={[0, 4, 4, 0]} name="Spent">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.spent, entry.budget)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgb(var(--accent-success))]"></div>
            <span className="text-[rgb(var(--text-muted))]">Under Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgb(var(--accent-warning))]"></div>
            <span className="text-[rgb(var(--text-muted))]">Near Limit (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgb(var(--accent-danger))]"></div>
            <span className="text-[rgb(var(--text-muted))]">Over Budget</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
