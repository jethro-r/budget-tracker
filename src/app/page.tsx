import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-text-secondary mt-2">Welcome to your financial command center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-income tabular-nums">$0.00</div>
            <p className="text-xs text-text-muted mt-2">This month</p>
            <div className="mt-4 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full gradient-success" style={{width: '0%'}}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-expense tabular-nums">$0.00</div>
            <p className="text-xs text-text-muted mt-2">This month</p>
            <div className="mt-4 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full gradient-danger" style={{width: '0%'}}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-accent-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-purple bg-clip-text text-transparent tabular-nums">
              $0.00
            </div>
            <p className="text-xs text-text-muted mt-2">This month</p>
            <div className="mt-4 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full gradient-purple" style={{width: '50%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Transactions
              <span className="text-sm font-normal text-text-muted">
                (0 transactions)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-text-secondary mb-4">
                No transactions yet
              </p>
              <p className="text-sm text-text-muted max-w-md">
                Start by importing your ANZ bank statements or manually add transactions to see your financial activity here
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Budget Overview
              <span className="text-sm font-normal text-text-muted">
                (0 budgets)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-bg-tertiary flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-accent-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-text-secondary mb-2 text-sm">
                No budgets set
              </p>
              <p className="text-xs text-text-muted max-w-xs">
                Create budgets to track spending limits and get alerts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-accent-primary/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg bg-bg-tertiary hover:bg-accent-primary/10 border border-accent-primary/20 hover:border-accent-primary/40 text-left group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 group-hover:bg-accent-primary/20 flex items-center justify-center transition-all">
                    <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Import ANZ Transactions</div>
                    <div className="text-xs text-text-muted">Upload CSV from your bank</div>
                  </div>
                </div>
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-bg-tertiary hover:bg-accent-success/10 border border-white/5 hover:border-accent-success/20 text-left group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-success/10 group-hover:bg-accent-success/20 flex items-center justify-center transition-all">
                    <svg className="w-5 h-5 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Add Transaction</div>
                    <div className="text-xs text-text-muted">Manually log income or expense</div>
                  </div>
                </div>
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-bg-tertiary hover:bg-accent-warning/10 border border-white/5 hover:border-accent-warning/20 text-left group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-warning/10 group-hover:bg-accent-warning/20 flex items-center justify-center transition-all">
                    <svg className="w-5 h-5 text-accent-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Create Budget</div>
                    <div className="text-xs text-text-muted">Set spending limits by category</div>
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
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              AI-Powered Categorization
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Our intelligent system automatically categorizes your transactions using AI and learns from your corrections over time
            </p>
            <button className="px-6 py-2 bg-white text-accent-primary rounded-lg hover:bg-white/90 transition-all font-medium shadow-lg">
              Learn More
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
