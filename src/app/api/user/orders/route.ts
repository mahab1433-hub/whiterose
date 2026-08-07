import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getServerSupabase } = await import('@/lib/auth');
    const supabase = await getServerSupabase();
    
    // 1. Fetch all orders and their items for the user in ONE query
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 2. Extract all unique product IDs across all orders
    const productIds = new Set<string>();
    (orders || []).forEach(order => {
      (order.order_items || []).forEach((item: any) => {
        if (item.product_id) productIds.add(item.product_id);
      });
    });

    // 3. Fetch all products in ONE query
    let products: any[] = [];
    if (productIds.size > 0) {
      const { data: productsData } = await supabaseServer
        .from('products')
        .select('*')
        .in('id', Array.from(productIds));
      products = productsData || [];
    }

    // 4. Map the results
    const resultOrders = (orders || []).map(order => {
      const populatedItems = (order.order_items || []).map((item: any) => {
        const product = products.find((p: any) => p.id === item.product_id);
        const imgUrl = product?.image_url || '';
        const imagesList = product?.images || (imgUrl ? [imgUrl] : []);

        return {
          quantity: item.quantity,
          price: item.price,
          product_id: item.product_id,
          products: {
            name: product?.name || 'Unknown Product',
            image_url: imgUrl,
            images: imagesList
          }
        };
      });

      let shippingAddressParsed = order.shipping_address;
      if (typeof order.shipping_address === 'string') {
        try {
          shippingAddressParsed = JSON.parse(order.shipping_address);
        } catch (e) {
          shippingAddressParsed = {};
        }
      }

      return {
        ...order,
        shipping_address: shippingAddressParsed,
        order_items: populatedItems
      };
    });

    return NextResponse.json(resultOrders);
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { totalAmount, paymentId, paymentStatus, shippingAddress, items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing or empty order items' }, { status: 400 });
    }

    const db = await openUserDb(user.id);
    const orderId = randomUUID();

    // Start transaction
    await db.run('BEGIN TRANSACTION');
    try {
      // 1. Insert order
      await db.run(
        `INSERT INTO orders (id, total_amount, status, payment_id, payment_status, shipping_address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          totalAmount,
          paymentStatus === 'pending' ? 'pending' : 'processing',
          paymentId || null,
          paymentStatus || 'unpaid',
          JSON.stringify(shippingAddress)
        ]
      );

      // 2. Insert order items
      for (const item of items) {
        const orderItemId = randomUUID();
        await db.run(
          `INSERT INTO order_items (id, order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            orderItemId,
            orderId,
            item.productId,
            item.quantity,
            item.price
          ]
        );
      }

      // 3. Clear cart since checkout was successful (only if not pending verification)
      if (paymentStatus !== 'pending') {
        await db.run('DELETE FROM cart_items');
      }

      await db.run('COMMIT');
    } catch (err) {
      await db.run('ROLLBACK');
      throw err;
    }

    await db.close();

    return NextResponse.json({
      success: true,
      order: { id: orderId }
    });
  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
