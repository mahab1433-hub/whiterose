import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';
import { randomUUID } from 'crypto';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  console.log('[Check-Status API] --- Payment Status Check Request Received ---');
  try {
    const user = await getAuthenticatedUser();
    
    const body = await req.json();
    const { 
      razorpayOrderId, 
      totalAmount,
      shippingAddress,
      items
    } = body;

    if (!razorpayOrderId || !totalAmount || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const key_id = process.env.RAZORPAY_KEY_ID;
    
    if (!secret || !key_id) {
      return NextResponse.json({ error: 'Server payment gateway configuration missing' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret: secret });

    // Fetch payments for this order directly from Razorpay
    const paymentsData = await razorpay.orders.fetchPayments(razorpayOrderId);
    const payments = paymentsData.items;

    const successfulPayment = payments.find((p: any) => p.status === 'captured' || p.status === 'authorized');

    if (!successfulPayment) {
      console.log(`[Check-Status API] Order ${razorpayOrderId} is NOT paid yet.`);
      return NextResponse.json({ success: false, message: 'Payment not successful yet' });
    }

    const razorpayPaymentId = successfulPayment.id;
    console.log(`[Check-Status API] Found successful payment: ${razorpayPaymentId} for Order: ${razorpayOrderId}`);

    const db = await openUserDb(user?.id || null);

    const existingOrder = await db.get('SELECT * FROM orders WHERE payment_id = ?', razorpayPaymentId);
    if (existingOrder) {
      console.log(`[Check-Status API] Order already exists. Returning existing ID.`);
      await db.close();
      return NextResponse.json({ success: true, orderId: existingOrder.id });
    }

    const orderId = randomUUID();
    
    await db.run('BEGIN TRANSACTION');
    try {
      await db.run(
        `INSERT INTO orders (id, user_id, total_amount, status, payment_id, payment_status, shipping_address) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, user?.id || null, totalAmount, 'processing', razorpayPaymentId, 'paid', JSON.stringify(shippingAddress)]
      );

      for (const item of items) {
        const orderItemId = randomUUID();
        await db.run(
          `INSERT INTO order_items (id, order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?, ?)`,
          [orderItemId, orderId, item.productId, item.quantity, item.price]
        );
      }

      if (user?.id) {
        await db.run('DELETE FROM cart_items');
      }

      await db.run('COMMIT');
    } catch (dbErr: any) {
      await db.run('ROLLBACK');
      await db.close();
      return NextResponse.json({ error: 'Failed to write order data: ' + dbErr.message }, { status: 500 });
    }

    // Emails (best effort)
    if (process.env.RESEND_API_KEY) {
      try {
        const shippingAddressParsed = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;
        const productIds = items.map((item: any) => item.productId);
        let products: any[] = [];
        if (productIds.length > 0) {
          const { data } = await supabaseAdmin.from('products').select('id, name').in('id', productIds);
          products = data || [];
        }

        const emailItems = items.map((item: any) => {
          const product = products.find((p: any) => p.id === item.productId);
          return { name: product?.name || 'Product', quantity: item.quantity, price: item.price };
        });

        const customerEmail = shippingAddressParsed.email || user?.email || '';
        if (customerEmail) {
          await sendOrderConfirmationEmail(orderId, customerEmail, totalAmount, emailItems, shippingAddressParsed);
        }
        await sendAdminOrderNotificationEmail(orderId, totalAmount, emailItems, { ...shippingAddressParsed, email: customerEmail });
      } catch (e) {}
    }

    await db.close();
    return NextResponse.json({ success: true, orderId });

  } catch (error: any) {
    console.error('[Check-Status API] Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
