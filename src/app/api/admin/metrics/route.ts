import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin } from '@/lib/auth';
import { adminGetMetrics } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get metrics aggregated from all SQLite user databases
    const sqliteMetrics = await adminGetMetrics();

    // 2. Get products count from Supabase
    const { count: productsCount, error: productsError } = await supabaseServer
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) {
      console.error('Error fetching products count for metrics:', productsError);
    }

    return NextResponse.json({
      revenue: sqliteMetrics.revenue,
      orders: sqliteMetrics.orders,
      users: sqliteMetrics.users,
      products: productsCount || 0
    });
  } catch (error: any) {
    console.error('Admin metrics GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
