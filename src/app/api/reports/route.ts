import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

// GET /api/reports - Get reports and analytics
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const where: any = { userId: user.id };
    if (Object.keys(dateFilter).length > 0) {
      where.date = dateFilter;
    }

    // Get spending by category
    const spendingByCategory = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where,
      _sum: {
        amount: true,
      },
    });

    // Get category details
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const categoriesData = spendingByCategory.map(item => ({
      category: categoryMap.get(item.categoryId),
      type: item.type,
      total: item._sum.amount?.toNumber() || 0,
    }));

    // Get monthly trends (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

      const [income, expenses] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId: user.id,
            type: 'INCOME',
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId: user.id,
            type: 'EXPENSE',
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      monthlyData.push({
        month: monthStart.toISOString(),
        income: income._sum.amount?.toNumber() || 0,
        expenses: expenses._sum.amount?.toNumber() || 0,
        net: (income._sum.amount?.toNumber() || 0) - (expenses._sum.amount?.toNumber() || 0),
      });
    }

    // Get summary stats
    const [totalIncome, totalExpenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    const summary = {
      totalIncome: totalIncome._sum.amount?.toNumber() || 0,
      totalExpenses: totalExpenses._sum.amount?.toNumber() || 0,
      netIncome: (totalIncome._sum.amount?.toNumber() || 0) - (totalExpenses._sum.amount?.toNumber() || 0),
    };

    return NextResponse.json({
      summary,
      categoriesData,
      monthlyData,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
