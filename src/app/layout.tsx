import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track your income, expenses, and budgets with AI-powered categorization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen">
          <nav className="sticky top-0 z-50 glass glass-border backdrop-blur-glass">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold gradient-purple bg-clip-text text-transparent">
                    Budget Tracker
                  </Link>
                  <div className="hidden md:flex gap-1">
                    <Link
                      href="/"
                      className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/transactions"
                      className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                    >
                      Transactions
                    </Link>
                    <Link
                      href="/budgets"
                      className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                    >
                      Budgets
                    </Link>
                    <Link
                      href="/reports"
                      className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                    >
                      Reports
                    </Link>
                    <Link
                      href="/import"
                      className="px-4 py-2 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all"
                    >
                      Import
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
