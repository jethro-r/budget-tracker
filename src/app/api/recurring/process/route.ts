import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

function getNextDate(date: Date, frequency: string): Date {
  switch (frequency) {
    case 'DAILY':
      return addDays(date, 1);
    case 'WEEKLY':
      return addWeeks(date, 1);
    case 'MONTHLY':
      return addMonths(date, 1);
    case 'YEARLY':
      return addYears(date, 1);
    default:
      return date;
  }
}

// POST /api/recurring/process - Process recurring transactions
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const now = new Date();
    let processedCount = 0;

    // Get all active recurring transactions for user
    const recurring = await prisma.recurringTransaction.findMany({
      where: {
        userId: user.id,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
    });

    for (const rec of recurring) {
      // Determine if we need to process this recurring transaction
      let shouldProcess = false;
      let processDate = rec.startDate;

      if (!rec.lastProcessed) {
        // Never processed, check if start date has passed
        shouldProcess = rec.startDate <= now;
      } else {
        // Calculate the next expected date
        const nextDate = getNextDate(rec.lastProcessed, rec.frequency);
        shouldProcess = nextDate <= now;
        processDate = nextDate;
      }

      if (shouldProcess && (!rec.endDate || processDate <= rec.endDate)) {
        // Create the transaction
        await prisma.transaction.create({
          data: {
            amount: rec.amount,
            type: rec.type,
            categoryId: rec.categoryId,
            description: rec.description,
            date: processDate,
            userId: user.id,
            recurringTransactionId: rec.id,
          },
        });

        // Update lastProcessed
        await prisma.recurringTransaction.update({
          where: { id: rec.id },
          data: { lastProcessed: processDate },
        });

        processedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      message: `Processed ${processedCount} recurring transaction(s)`,
    });
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
    return NextResponse.json(
      { error: 'Failed to process recurring transactions' },
      { status: 500 }
    );
  }
}
