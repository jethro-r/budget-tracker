'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { pageTransition } from '@/lib/animations';

// Dynamic imports for charts (code splitting for better performance)
const SpendingByCategory = dynamic(
  () => import('@/components/charts/spending-by-category').then(mod => ({ default: mod.SpendingByCategory })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const IncomeVsExpense = dynamic(
  () => import('@/components/charts/income-vs-expense').then(mod => ({ default: mod.IncomeVsExpense })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const BudgetProgress = dynamic(
  () => import('@/components/charts/budget-progress').then(mod => ({ default: mod.BudgetProgress })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

export default function ReportsPage() {
  // Sample data for demonstration (replace with real data from API)
  const sampleCategoryData = [
    { name: 'Groceries', value: 450 },
    { name: 'Transportation', value: 200 },
    { name: 'Entertainment', value: 150 },
    { name: 'Utilities', value: 300 },
    { name: 'Dining Out', value: 180 },
    { name: 'Shopping', value: 220 },
  ];

  const sampleMonthlyData = [
    { month: 'Jul', income: 3500, expenses: 2400 },
    { month: 'Aug', income: 3800, expenses: 2600 },
    { month: 'Sep', income: 3200, expenses: 2200 },
    { month: 'Oct', income: 4100, expenses: 2800 },
    { month: 'Nov', income: 3900, expenses: 2500 },
    { month: 'Dec', income: 4300, expenses: 3100 },
  ];

  const sampleBudgetData = [
    { category: 'Groceries', budget: 500, spent: 450, remaining: 50 },
    { category: 'Transportation', budget: 250, spent: 200, remaining: 50 },
    { category: 'Entertainment', budget: 200, spent: 150, remaining: 50 },
    { category: 'Utilities', budget: 300, spent: 300, remaining: 0 },
    { category: 'Dining Out', budget: 150, spent: 180, remaining: -30 },
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-[rgb(var(--text-secondary))] mt-1">Visualize your financial data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SpendingByCategory data={sampleCategoryData} />
        <BudgetProgress data={sampleBudgetData} />
        <IncomeVsExpense data={sampleMonthlyData} />
      </div>
    </motion.div>
  );
}
