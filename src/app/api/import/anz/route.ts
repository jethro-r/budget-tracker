import { NextRequest, NextResponse } from 'next/server';
import { getAuthentikUser } from '@/lib/auth';
import { prisma, ensureUser } from '@/lib/db';
import { TransactionType } from '@prisma/client';

interface ParsedTransaction {
  date: Date;
  amount: number;
  description: string;
  type: TransactionType;
  importId: string;
}

function parseANZCSV(csvContent: string): ParsedTransaction[] {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Skip header row - expecting: Type,Details,Particulars,Code,Reference,Amount,Date,ForeignCurrencyAmount,ConversionCharge
  const dataLines = lines.slice(1);

  const transactions: ParsedTransaction[] = [];

  for (const line of dataLines) {
    // Parse CSV line (handle quoted fields)
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length < 7) continue;

    // ANZ format: Type,Details,Particulars,Code,Reference,Amount,Date,ForeignCurrencyAmount,ConversionCharge
    // Index 0: Type (e.g., "Visa Purchase")
    // Index 1: Details (card number)
    // Index 2: Particulars
    // Index 3: Code (merchant name - use as description)
    // Index 4: Reference
    // Index 5: Amount
    // Index 6: Date

    const dateStr = fields[6].replace(/"/g, '');
    const date = parseDate(dateStr);

    if (!date || isNaN(date.getTime())) {
      continue; // Skip invalid dates
    }

    // Get description from Code field (index 3) or fallback to other fields
    const codeField = fields[3]?.replace(/"/g, '').trim();
    const detailsField = fields[1]?.replace(/"/g, '').trim();
    const particularsField = fields[2]?.replace(/"/g, '').trim();

    let description: string;
    if (codeField) {
      description = codeField;
    } else if (particularsField) {
      description = particularsField;
    } else if (detailsField) {
      description = detailsField;
    } else {
      description = fields[0]?.replace(/"/g, '').trim() || 'Unknown Transaction';
    }

    // Parse amount from index 5
    const amountStr = fields[5].replace(/[^0-9.-]/g, '');
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount === 0) continue;

    // Negative amount = expense, positive = income
    const type = amount < 0 ? TransactionType.EXPENSE : TransactionType.INCOME;
    const absAmount = Math.abs(amount);

    // Create unique import ID
    const importId = `anz-${dateStr}-${absAmount}-${description.substring(0, 20)}`;

    transactions.push({
      date,
      amount: absAmount,
      description,
      type,
      importId,
    });
  }

  return transactions;
}

function parseDate(dateStr: string): Date {
  // Try common ANZ date formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (match[1].length === 4) {
        // YYYY-MM-DD format
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      } else {
        // DD/MM/YYYY or DD-MM-YYYY format
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
      }
    }
  }

  // Fallback to built-in date parsing
  return new Date(dateStr);
}

async function categorizeTransaction(
  userId: string,
  description: string,
  type: TransactionType
): Promise<string | null> {
  // Get matching rules from database
  const rules = await prisma.categoryRule.findMany({
    where: {
      userId,
      category: { type },
    },
    include: {
      category: true,
    },
    orderBy: [
      { confidence: 'desc' },
      { matchCount: 'desc' },
    ],
  });

  const lowerDesc = description.toLowerCase();

  for (const rule of rules) {
    try {
      // Try regex match first
      const regex = new RegExp(rule.pattern, 'i');
      if (regex.test(lowerDesc)) {
        // Update match count
        await prisma.categoryRule.update({
          where: { id: rule.id },
          data: { matchCount: { increment: 1 } },
        });
        return rule.categoryId;
      }
    } catch {
      // If regex fails, try exact substring match
      if (lowerDesc.includes(rule.pattern.toLowerCase())) {
        await prisma.categoryRule.update({
          where: { id: rule.id },
          data: { matchCount: { increment: 1 } },
        });
        return rule.categoryId;
      }
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthentikUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in database
    await ensureUser(user.id, user.email, user.name);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    const csvContent = await file.text();
    const parsedTransactions = parseANZCSV(csvContent);

    if (parsedTransactions.length === 0) {
      return NextResponse.json({ error: 'No valid transactions found in CSV' }, { status: 400 });
    }

    // Get default category for uncategorized transactions
    let defaultExpenseCategory = await prisma.category.findFirst({
      where: { userId: user.id, type: TransactionType.EXPENSE, name: 'Uncategorized' },
    });

    let defaultIncomeCategory = await prisma.category.findFirst({
      where: { userId: user.id, type: TransactionType.INCOME, name: 'Other Income' },
    });

    // Create default categories if they don't exist
    if (!defaultExpenseCategory) {
      defaultExpenseCategory = await prisma.category.create({
        data: {
          name: 'Uncategorized',
          type: TransactionType.EXPENSE,
          userId: user.id,
          color: '#6B7280',
        },
      });
    }

    if (!defaultIncomeCategory) {
      defaultIncomeCategory = await prisma.category.create({
        data: {
          name: 'Other Income',
          type: TransactionType.INCOME,
          userId: user.id,
          color: '#10B981',
        },
      });
    }

    // Check for duplicates and categorize
    const toImport: Array<{
      transaction: ParsedTransaction;
      categoryId: string;
      isNew: boolean;
    }> = [];

    for (const transaction of parsedTransactions) {
      // Check if already imported
      const existing = await prisma.transaction.findFirst({
        where: {
          userId: user.id,
          importSource: 'anz-csv',
          importId: transaction.importId,
        },
      });

      if (existing) {
        continue; // Skip duplicates
      }

      // Try to categorize
      const categoryId = await categorizeTransaction(user.id, transaction.description, transaction.type);

      toImport.push({
        transaction,
        categoryId: categoryId || (transaction.type === TransactionType.EXPENSE
          ? defaultExpenseCategory.id
          : defaultIncomeCategory.id),
        isNew: true,
      });
    }

    // Return preview for user confirmation
    return NextResponse.json({
      total: parsedTransactions.length,
      new: toImport.length,
      duplicates: parsedTransactions.length - toImport.length,
      preview: toImport.slice(0, 10).map(item => ({
        date: item.transaction.date,
        amount: item.transaction.amount,
        description: item.transaction.description,
        type: item.transaction.type,
      })),
      importData: toImport.map(item => ({
        amount: item.transaction.amount,
        type: item.transaction.type,
        categoryId: item.categoryId,
        description: item.transaction.description,
        date: item.transaction.date,
        importSource: 'anz-csv',
        importId: item.transaction.importId,
        originalDesc: item.transaction.description,
      })),
    });
  } catch (error) {
    console.error('ANZ CSV import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process CSV' },
      { status: 500 }
    );
  }
}
