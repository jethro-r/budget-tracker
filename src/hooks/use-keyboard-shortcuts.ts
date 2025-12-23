'use client';

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * Hook for implementing keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcuts to register
 * @param enabled - Whether the shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;
        const altMatch = shortcut.altKey === undefined || shortcut.altKey === event.altKey;
        const metaMatch = shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          metaMatch
        ) {
          event.preventDefault();
          shortcut.action();
          break; // Only trigger the first matching shortcut
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Common keyboard shortcuts used across the application
 */
export const commonShortcuts = {
  search: { key: '/', description: 'Focus search' },
  newTransaction: { key: 'n', ctrlKey: true, description: 'New transaction' },
  newBudget: { key: 'b', ctrlKey: true, description: 'New budget' },
  importTransactions: { key: 'i', ctrlKey: true, description: 'Import transactions' },
  goToDashboard: { key: '1', altKey: true, description: 'Go to Dashboard' },
  goToTransactions: { key: '2', altKey: true, description: 'Go to Transactions' },
  goToBudgets: { key: '3', altKey: true, description: 'Go to Budgets' },
  goToReports: { key: '4', altKey: true, description: 'Go to Reports' },
  help: { key: '?', shiftKey: true, description: 'Show keyboard shortcuts' },
};
