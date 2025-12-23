import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/categories - List all categories for user
export async function GET() {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await ensureUser(user.id, user.email, user.name);

    const body = await request.json();
    const { name, type, color } = body;

    if (!name || !type || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        userId: user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 409 }
      );
    }
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
