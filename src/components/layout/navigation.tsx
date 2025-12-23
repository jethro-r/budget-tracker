'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/import', label: 'Import', icon: Upload, highlight: true },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-[var(--z-sticky)] glass glass-border backdrop-blur-glass"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold gradient-purple bg-clip-text text-transparent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent-primary))] rounded"
              aria-label="Budget Tracker Home"
            >
              Budget Tracker
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1" role="menubar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg-primary))]',
                      'flex items-center gap-2',
                      active
                        ? item.highlight
                          ? 'text-[rgb(var(--accent-primary))] bg-[rgba(var(--accent-primary),0.1)]'
                          : 'text-[rgb(var(--text-primary))] bg-[rgb(var(--bg-tertiary))]'
                        : item.highlight
                        ? 'text-[rgb(var(--accent-primary))] hover:bg-[rgba(var(--accent-primary),0.1)]'
                        : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-tertiary))]'
                    )}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                    {active && !item.highlight && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[rgb(var(--bg-tertiary))] rounded-lg -z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-primary))] rounded transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[rgba(var(--border),var(--border-opacity))] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1" role="menu">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-primary))]',
                        active
                          ? item.highlight
                            ? 'text-[rgb(var(--accent-primary))] bg-[rgba(var(--accent-primary),0.1)]'
                            : 'text-[rgb(var(--text-primary))] bg-[rgb(var(--bg-tertiary))]'
                          : item.highlight
                          ? 'text-[rgb(var(--accent-primary))] hover:bg-[rgba(var(--accent-primary),0.1)]'
                          : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-tertiary))]'
                      )}
                    >
                      <Icon size={20} aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
