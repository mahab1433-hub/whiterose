import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin } from '@/lib/auth';
import { adminGetAllOrders, adminUpdateOrderStatus, adminDeleteOrder } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // 1. Fetch raw aggregated orders
    let orders = await adminGetAllOrders();

    if (limit !== undefined) {
      orders = orders.slice(0, limit);
    }

    // 2. Resolve product details from Supabase in batch
    const productIds = new Set<string>();
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        if (item.product_id) productIds.add(item.product_id);
      });
    });

    let products: any[] = [];
    if (productIds.size > 0) {
      const { data } = await supabaseServer
        .from('products')
        .select('*')
        .in('id', Array.from(productIds));
      products = data || [];
    }

    // 3. Populate product details on each order item
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const product = products.find(p => p.id === item.product_id);
        item.products = {
          name: product?.name || 'Unknown Product',
          image_url: product?.image_url || '',
          images: product?.images || (product?.image_url ? [product.image_url] : [])
        };
      });
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 });
    }

    const updated = await adminUpdateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin orders PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const deleted = await adminDeleteOrder(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin orders DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
