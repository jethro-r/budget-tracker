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
  description: "Track your income, expenses, and budgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <nav className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold">
                    Budget Tracker
                  </Link>
                  <div className="hidden md:flex gap-4">
                    <Link
                      href="/"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/transactions"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Transactions
                    </Link>
                    <Link
                      href="/budgets"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Budgets
                    </Link>
                    <Link
                      href="/reports"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Reports
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
