import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/recurring - List recurring transactions
export async function GET() {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const recurring = await prisma.recurringTransaction.findMany({
      where: { userId: user.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ recurring });
  } catch (error) {
    console.error('Error fetching recurring transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring transactions' },
      { status: 500 }
    );
  }
}

// POST /api/recurring - Create a new recurring transaction
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const body = await request.json();
    const { amount, type, categoryId, description, frequency, startDate, endDate } = body;

    if (!amount || !type || !categoryId || !frequency || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recurring = await prisma.recurringTransaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        categoryId,
        description: description || '',
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(recurring, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring transaction' },
      { status: 500 }
    );
  }
}
