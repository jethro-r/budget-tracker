'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImportPreview {
  date: string;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
}

interface ImportResponse {
  total: number;
  new: number;
  duplicates: number;
  preview: ImportPreview[];
  importData: any[];
}

interface ANZImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ANZImportDialog({ open, onOpenChange, onSuccess }: ANZImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/anz', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process CSV');
      }

      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/import/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: preview.importData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import transactions');
      }

      // Success!
      onOpenChange(false);
      setFile(null);
      setPreview(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import ANZ Transactions</DialogTitle>
          <DialogDescription>
            Upload your ANZ bank statement CSV file to import transactions automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <>
              <div className="border-2 border-dashed border-accent-primary/30 rounded-lg p-8 text-center hover:border-accent-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-accent-primary font-medium hover:underline">
                        Choose a CSV file
                      </span>
                      <span className="text-text-muted"> or drag and drop</span>
                    </label>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-text-muted mt-2">
                      ANZ bank statement CSV files only
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-accent-primary/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{file.name}</p>
                      <p className="text-xs text-text-muted">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-expense/10 border border-expense/30 rounded-lg">
                  <p className="text-sm text-expense">{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-bg-tertiary rounded-lg border border-white/10">
                  <p className="text-xs text-text-muted mb-1">Total Found</p>
                  <p className="text-2xl font-bold text-text-primary">{preview.total}</p>
                </div>
                <div className="p-4 bg-accent-success/10 rounded-lg border border-accent-success/30">
                  <p className="text-xs text-text-muted mb-1">New</p>
                  <p className="text-2xl font-bold text-accent-success">{preview.new}</p>
                </div>
                <div className="p-4 bg-bg-tertiary rounded-lg border border-white/10">
                  <p className="text-xs text-text-muted mb-1">Duplicates</p>
                  <p className="text-2xl font-bold text-text-muted">{preview.duplicates}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Preview (first 10 transactions)
                </h3>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg-tertiary">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Description</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-text-muted">Amount</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-text-muted">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {preview.preview.map((transaction, index) => (
                          <tr key={index} className="hover:bg-bg-tertiary/50">
                            <td className="px-4 py-2 text-sm text-text-primary whitespace-nowrap">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-sm text-text-primary truncate max-w-xs">
                              {transaction.description}
                            </td>
                            <td className="px-4 py-2 text-sm text-right font-mono">
                              <span className={transaction.type === 'INCOME' ? 'text-income' : 'text-expense'}>
                                ${transaction.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                transaction.type === 'INCOME'
                                  ? 'bg-income/10 text-income'
                                  : 'bg-expense/10 text-expense'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-expense/10 border border-expense/30 rounded-lg">
                  <p className="text-sm text-expense">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {!preview ? (
            <Button onClick={handleUpload} disabled={!file || loading}>
              {loading ? 'Processing...' : 'Preview Transactions'}
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={loading || preview.new === 0}>
              {loading ? 'Importing...' : `Import ${preview.new} Transactions`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
