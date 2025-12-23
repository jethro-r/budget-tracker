import { NextResponse } from 'next/server';
import { ensureUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/auth/user - Get current user info
export async function GET() {
  try {
    const user = await requireAuth();
    const dbUser = await ensureUser(user.id, user.email, user.name);

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
