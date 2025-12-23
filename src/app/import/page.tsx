'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ANZImportDialog } from '@/components/import/anz-import-dialog';
import { pageTransition } from '@/lib/animations';

export default function ImportPage() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImportSuccess = () => {
    setSuccessMessage('Transactions imported successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Import Transactions</h1>
          <p className="text-[rgb(var(--text-secondary))] mt-1">Import bank statements to track your finances</p>
        </div>
      </div>

      {successMessage && (
        <Card className="border-accent-success/30 bg-accent-success/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success" />
              <p className="text-accent-success font-medium">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-accent-primary/50 transition-all cursor-pointer" onClick={() => setImportDialogOpen(true)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-primary" />
              </div>
              ANZ Bank Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[rgb(var(--text-secondary))] mb-4">
              Import transactions from your ANZ bank statement CSV file. The file should include transaction dates, amounts, and descriptions.
            </p>
            <Button variant="outline" className="w-full">
              <Upload size={16} className="mr-2" />
              Import ANZ CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[rgb(var(--bg-tertiary))] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[rgb(var(--text-muted))]" />
              </div>
              Other Banks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[rgb(var(--text-secondary))] mb-4">
              Support for other bank statement formats coming soon. Contact support if you need a specific format.
            </p>
            <Button variant="outline" className="w-full" disabled>
              <Upload size={16} className="mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Import</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-[rgb(var(--text-secondary))]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-medium">1</span>
              <span>Download your bank statement as a CSV file from your bank's website</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-medium">2</span>
              <span>Click on your bank's import card above</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-medium">3</span>
              <span>Select your CSV file and preview the transactions</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-medium">4</span>
              <span>Confirm the import and your transactions will be automatically categorized</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <ANZImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={handleImportSuccess}
      />
    </motion.div>
  );
}
