import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin } from '@/lib/auth';
import { adminGetAllCustomers } from '@/lib/user-db';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await adminGetAllCustomers();
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Admin customers GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
