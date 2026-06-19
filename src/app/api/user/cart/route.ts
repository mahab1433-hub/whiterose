import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await openUserDb(user.id);
    const cartItems = await db.all('SELECT product_id, quantity FROM cart_items');
    await db.close();

    if (cartItems.length === 0) {
      return NextResponse.json([]);
    }

    const productIds = cartItems.map(item => item.product_id);
    const { data: products, error } = await supabaseServer
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error) {
      console.error('Error fetching products for cart:', error);
      return NextResponse.json({ error: 'Failed to fetch product details' }, { status: 500 });
    }

    const result = cartItems
      .map(item => {
        const product = products?.find(p => p.id === item.product_id);
        return {
          ...product,
          id: item.product_id, // ensure ID is preserved
          quantity: item.quantity,
        };
      })
      .filter(item => item.name); // only return items that successfully resolved to a product

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cart GET handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json(); // expect items as array of { id, quantity }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    const db = await openUserDb(user.id);
    
    // Begin transaction for database integrity
    await db.run('BEGIN TRANSACTION');
    try {
      await db.run('DELETE FROM cart_items');
      for (const item of items) {
        if (item.id && item.quantity > 0) {
          await db.run(
            'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?) ON CONFLICT(product_id) DO UPDATE SET quantity = ?',
            [item.id, item.quantity, item.quantity]
          );
        }
      }
      await db.run('COMMIT');
    } catch (e) {
      await db.run('ROLLBACK');
      throw e;
    }
    
    await db.close();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart POST handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
