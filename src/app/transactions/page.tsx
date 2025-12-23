'use client';

import { motion } from 'framer-motion';
import { Plus, Search, Filter, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from '@/components/ui/empty-state';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';

export default function TransactionsPage() {
  // Sample transactions for demonstration (replace with real data from API)
  const hasTransactions = false;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-[rgb(var(--text-secondary))] mt-1">Manage your income and expenses</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} aria-hidden="true" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted))]" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--bg-tertiary))] border border-[rgba(var(--border),var(--border-opacity))] rounded-lg text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-primary))]"
                aria-label="Search transactions"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} aria-hidden="true" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {hasTransactions ? (
            <div className="space-y-3">
              {/* Transaction items will go here */}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions found"
              description="Click 'Add Transaction' to manually add a transaction, or import your bank statements to get started."
              action={{
                label: "Add Transaction",
                onClick: () => console.log('Add transaction')
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
