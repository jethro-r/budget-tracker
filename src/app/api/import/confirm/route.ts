import { NextRequest, NextResponse } from 'next/server';
import { getAuthentikUser } from '@/lib/auth';
import { prisma, ensureUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthentikUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in database
    await ensureUser(user.id, user.email, user.name);

    const body = await request.json();
    const { transactions } = body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: 'No transactions to import' }, { status: 400 });
    }

    // Validate all transactions have required fields
    for (const transaction of transactions) {
      if (!transaction.amount || !transaction.type || !transaction.categoryId || !transaction.description || !transaction.date) {
        return NextResponse.json({ error: 'Invalid transaction data' }, { status: 400 });
      }
    }

    // Import all transactions in a transaction
    const imported = await prisma.transaction.createMany({
      data: transactions.map((t: any) => ({
        ...t,
        userId: user.id,
        date: new Date(t.date),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      imported: imported.count,
    });
  } catch (error) {
    console.error('Import confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import transactions' },
      { status: 500 }
    );
  }
}
