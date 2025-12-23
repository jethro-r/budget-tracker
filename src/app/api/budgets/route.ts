import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/budgets - List budgets with current spending
export async function GET() {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        category: true,
      },
      orderBy: { startDate: 'desc' },
    });

    // Calculate current spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId: user.id,
            categoryId: budget.categoryId,
            type: 'EXPENSE',
            date: {
              gte: budget.startDate,
              ...(budget.endDate && { lte: budget.endDate }),
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          ...budget,
          spent: spent._sum.amount?.toNumber() || 0,
          remaining: budget.amount.toNumber() - (spent._sum.amount?.toNumber() || 0),
          percentUsed: spent._sum.amount
            ? (spent._sum.amount.toNumber() / budget.amount.toNumber()) * 100
            : 0,
        };
      })
    );

    return NextResponse.json({ budgets: budgetsWithSpending });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const body = await request.json();
    const { categoryId, amount, period, startDate, endDate, alertThreshold } = body;

    if (!categoryId || !amount || !period || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        categoryId,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        alertThreshold: alertThreshold || 80,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Budget already exists for this category and period' },
        { status: 409 }
      );
    }
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
