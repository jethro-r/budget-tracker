'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Plus, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from '@/components/ui/empty-state';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';

// Dynamic import for chart (code splitting for better performance)
const BudgetProgress = dynamic(
  () => import('@/components/charts/budget-progress').then(mod => ({ default: mod.BudgetProgress })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

export default function BudgetsPage() {
  // Sample budget data for demonstration (replace with real data from API)
  const hasBudgets = true; // Set to true to show sample data

  const sampleBudgetData = [
    { category: 'Groceries', budget: 500, spent: 450, remaining: 50 },
    { category: 'Transportation', budget: 250, spent: 200, remaining: 50 },
    { category: 'Entertainment', budget: 200, spent: 150, remaining: 50 },
    { category: 'Utilities', budget: 300, spent: 300, remaining: 0 },
    { category: 'Dining Out', budget: 150, spent: 180, remaining: -30 },
    { category: 'Shopping', budget: 400, spent: 320, remaining: 80 },
  ];

  const totalBudget = sampleBudgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = sampleBudgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = sampleBudgetData.filter(item => item.spent > item.budget).length;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-[rgb(var(--text-secondary))] mt-1">Set and track your spending limits</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} aria-hidden="true" />
          Create Budget
        </Button>
      </div>

      {hasBudgets ? (
        <>
          {/* Summary Cards */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                      Total Budget
                    </CardTitle>
                    <Target className="w-5 h-5 text-[rgb(var(--accent-primary))]" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[rgb(var(--text-primary))] tabular-nums">
                    ${totalBudget.toFixed(2)}
                  </div>
                  <p className="text-xs text-[rgb(var(--text-muted))] mt-2">This month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-expense tabular-nums">
                    ${totalSpent.toFixed(2)}
                  </div>
                  <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                    {((totalSpent / totalBudget) * 100).toFixed(0)}% of budget
                  </p>
                  <div className="mt-4 h-2 bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-danger"
                      style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className={overBudgetCount > 0 ? "border-[rgba(var(--accent-danger),0.3)]" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                      Status
                    </CardTitle>
                    {overBudgetCount > 0 && (
                      <AlertCircle className="w-5 h-5 text-[rgb(var(--accent-danger))]" aria-hidden="true" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {overBudgetCount > 0 ? (
                    <>
                      <div className="text-3xl font-bold text-[rgb(var(--accent-danger))] tabular-nums">
                        {overBudgetCount}
                      </div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-2">Over budget</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-[rgb(var(--accent-success))] tabular-nums">
                        ${totalRemaining.toFixed(2)}
                      </div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-2">Remaining</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Budget Progress Chart */}
          <BudgetProgress data={sampleBudgetData} title="Budget Progress by Category" />

          {/* Budget List */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleBudgetData.map((budget, index) => {
                  const percentage = (budget.spent / budget.budget) * 100;
                  const isOverBudget = budget.spent > budget.budget;
                  const isNearLimit = percentage >= 80 && !isOverBudget;

                  return (
                    <div key={index} className="p-4 rounded-lg border border-[rgba(var(--border),var(--border-opacity))] hover:bg-[rgb(var(--bg-tertiary))] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[rgb(var(--text-primary))]">{budget.category}</h3>
                        <span className="text-sm text-[rgb(var(--text-muted))]">
                          ${budget.spent.toFixed(2)} / ${budget.budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isOverBudget
                              ? 'bg-[rgb(var(--accent-danger))]'
                              : isNearLimit
                              ? 'bg-[rgb(var(--accent-warning))]'
                              : 'bg-[rgb(var(--accent-success))]'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[rgb(var(--text-muted))]">
                          {percentage.toFixed(0)}% used
                        </span>
                        <span className={`text-xs font-medium ${
                          isOverBudget
                            ? 'text-[rgb(var(--accent-danger))]'
                            : 'text-[rgb(var(--accent-success))]'
                        }`}>
                          {isOverBudget ? `-$${Math.abs(budget.remaining).toFixed(2)}` : `$${budget.remaining.toFixed(2)} left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Target}
              title="No budgets found"
              description="Click 'Create Budget' to set your first budget and start tracking your spending limits!"
              action={{
                label: "Create Budget",
                onClick: () => console.log('Create budget')
              }}
            />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
