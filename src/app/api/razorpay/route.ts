import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay API keys are missing in environment variables');
    return NextResponse.json({ error: 'Payment gateway configuration missing' }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    console.log('Environment Check:', {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      keyIdStart: process.env.RAZORPAY_KEY_ID?.substring(0, 8),
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await req.json();
    console.log('Request Body:', body);

    const { amount, currency = 'INR', receipt, items, shippingAddress } = body;

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: 'Invalid amount', received: amount }, { status: 400 });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    // Save pending order to handle cases where user completely exits website during payment redirect
    if (items && shippingAddress) {
      const user = await getAuthenticatedUser();
      const db = await openUserDb(user?.id || null);
      
      const orderId = randomUUID();
      await db.run('BEGIN TRANSACTION');
      try {
        // Use Razorpay Order ID as temporary payment_id for webhook matching
        await db.run(
          `INSERT INTO orders (id, user_id, total_amount, status, payment_id, payment_status, shipping_address) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, user?.id || null, amount, 'pending', order.id, 'pending', JSON.stringify(shippingAddress)]
        );
        for (const item of items) {
          const orderItemId = randomUUID();
          await db.run(
            `INSERT INTO order_items (id, order_id, product_id, quantity, price) 
             VALUES (?, ?, ?, ?, ?)`,
            [orderItemId, orderId, item.productId, item.quantity, item.price]
          );
        }
        await db.run('COMMIT');
        console.log(`[API] Created pending order: ${orderId} for Razorpay Order: ${order.id}`);
      } catch (err) {
        await db.run('ROLLBACK');
        console.error('[API] Failed to create pending order:', err);
      } finally {
        await db.close();
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('RAZORPAY_CRITICAL_ERROR:', error);
    // Return the full error to the browser for debugging
    return NextResponse.json({ 
      error: error.message || 'Payment gateway error',
      fullError: error,
      envCheck: {
        hasKeyId: !!process.env.RAZORPAY_KEY_ID,
        hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      }
    }, { status: 500 });
  }
}
