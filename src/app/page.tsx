'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Upload, Plus, Target, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANZImportDialog } from "@/components/import/anz-import-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/skeleton";
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';

// Dynamic imports for charts (code splitting for better performance)
const Sparkline = dynamic(
  () => import('@/components/charts/sparkline').then(mod => ({ default: mod.Sparkline })),
  { ssr: false }
);

const SpendingByCategory = dynamic(
  () => import('@/components/charts/spending-by-category').then(mod => ({ default: mod.SpendingByCategory })),
  { loading: () => <CardSkeleton />, ssr: false }
);

const IncomeVsExpense = dynamic(
  () => import('@/components/charts/income-vs-expense').then(mod => ({ default: mod.IncomeVsExpense })),
  { loading: () => <CardSkeleton />, ssr: false }
);

export default function HomePage() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Sample data for demonstration (replace with real data from API)
  const sampleIncomeData = [1200, 1400, 1100, 1600, 1800, 1500, 2000];
  const sampleExpenseData = [800, 950, 700, 1200, 1100, 900, 1000];
  const sampleCategoryData = [
    { name: 'Groceries', value: 450 },
    { name: 'Transportation', value: 200 },
    { name: 'Entertainment', value: 150 },
    { name: 'Utilities', value: 300 },
    { name: 'Dining Out', value: 180 },
  ];
  const sampleMonthlyData = [
    { month: 'Jul', income: 3500, expenses: 2400 },
    { month: 'Aug', income: 3800, expenses: 2600 },
    { month: 'Sep', income: 3200, expenses: 2200 },
    { month: 'Oct', income: 4100, expenses: 2800 },
    { month: 'Nov', income: 3900, expenses: 2500 },
    { month: 'Dec', income: 4300, expenses: 3100 },
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-[rgb(var(--text-secondary))] mt-2">Welcome to your financial command center</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={fadeInUp}>
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                  Total Income
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-[rgb(var(--accent-success))]" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-income tabular-nums">$2,000.00</div>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">This month</p>
              <div className="mt-4">
                <Sparkline data={sampleIncomeData} color="rgb(var(--accent-success))" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="w-5 h-5 text-[rgb(var(--accent-danger))]" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-expense tabular-nums">$1,000.00</div>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">This month</p>
              <div className="mt-4">
                <Sparkline data={sampleExpenseData} color="rgb(var(--accent-danger))" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover border-[rgba(var(--accent-primary),0.2)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                  Net Income
                </CardTitle>
                <DollarSign className="w-5 h-5 text-[rgb(var(--accent-primary))]" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-purple bg-clip-text text-transparent tabular-nums">
                $1,000.00
              </div>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">This month</p>
              <div className="mt-4">
                <Sparkline
                  data={sampleIncomeData.map((income, i) => income - sampleExpenseData[i])}
                  color="rgb(var(--accent-primary))"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingByCategory data={sampleCategoryData} />
        <IncomeVsExpense data={sampleMonthlyData} />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Transactions
              <span className="text-sm font-normal text-[rgb(var(--text-muted))]">
                (0 transactions)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Plus}
              title="No transactions yet"
              description="Start by importing your ANZ bank statements or manually add transactions to see your financial activity here"
              action={{
                label: "Import Transactions",
                onClick: () => setImportDialogOpen(true)
              }}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[rgba(var(--accent-primary),0.1)]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => setImportDialogOpen(true)}
                className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgba(var(--accent-primary),0.1)] border border-[rgba(var(--accent-primary),0.2)] hover:border-[rgba(var(--accent-primary),0.4)] text-left group transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-primary))]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(var(--accent-primary),0.1)] group-hover:bg-[rgba(var(--accent-primary),0.2)] flex items-center justify-center transition-all">
                    <Upload className="w-5 h-5 text-[rgb(var(--accent-primary))]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--text-primary))]">Import ANZ Transactions</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">Upload CSV from your bank</div>
                  </div>
                </div>
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgba(var(--accent-success),0.1)] border border-[rgba(var(--border),0.05)] hover:border-[rgba(var(--accent-success),0.2)] text-left group transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-success))]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(var(--accent-success),0.1)] group-hover:bg-[rgba(var(--accent-success),0.2)] flex items-center justify-center transition-all">
                    <Plus className="w-5 h-5 text-[rgb(var(--accent-success))]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--text-primary))]">Add Transaction</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">Manually log income or expense</div>
                  </div>
                </div>
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgba(var(--accent-warning),0.1)] border border-[rgba(var(--border),0.05)] hover:border-[rgba(var(--accent-warning),0.2)] text-left group transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-warning))]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(var(--accent-warning),0.1)] group-hover:bg-[rgba(var(--accent-warning),0.2)] flex items-center justify-center transition-all">
                    <Target className="w-5 h-5 text-[rgb(var(--accent-warning))]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-medium text-[rgb(var(--text-primary))]">Create Budget</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">Set spending limits by category</div>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Banner */}
      <Card className="gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <CardContent className="relative py-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                AI-Powered Categorization
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Our intelligent system automatically categorizes your transactions using AI and learns from your corrections over time
              </p>
              <button className="px-6 py-2 bg-white text-[rgb(var(--accent-primary))] rounded-lg hover:bg-white/90 transition-all font-medium shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--accent-primary))]">
                Learn More
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ANZImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={() => {
          // Refresh page data here if needed
          window.location.reload();
        }}
      />
    </motion.div>
  );
}
