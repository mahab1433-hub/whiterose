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

    const db = await openUserDb(user.id);
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    
    const resultOrders = [];
    for (const order of orders) {
      const orderItems = await db.all('SELECT * FROM order_items WHERE order_id = ?', order.id);
      
      // Fetch product details for these items
      const productIds = orderItems.map(item => item.product_id);
      let products: any[] = [];
      if (productIds.length > 0) {
        const { data } = await supabaseServer
          .from('products')
          .select('*')
          .in('id', productIds);
        products = data || [];
      }

      // Map order items to include product metadata matching client expectations
      const populatedItems = orderItems.map(item => {
        const product = products.find(p => p.id === item.product_id);
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

      let shippingAddressParsed = null;
      if (order.shipping_address) {
        try {
          shippingAddressParsed = JSON.parse(order.shipping_address);
        } catch (e) {
          shippingAddressParsed = order.shipping_address;
        }
      }

      resultOrders.push({
        ...order,
        shipping_address: shippingAddressParsed,
        order_items: populatedItems
      });
    }

    await db.close();

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
          'processing', // default status on successful payment
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

      // 3. Clear cart since checkout was successful
      await db.run('DELETE FROM cart_items');

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
