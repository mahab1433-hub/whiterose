import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { openUserDb } from '@/lib/user-db';

export async function POST(req: Request) {
  console.log('[Webhook API] --- Razorpay Webhook Received ---');
  
  try {
    const textBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    // You'll need to add this to your .env file
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[Webhook API] Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      console.error('[Webhook API] No signature found in headers');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(textBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Webhook API] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(textBody);
    console.log('[Webhook API] Event:', event.event);

    // Handle specific events
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;
      
      console.log(`[Webhook API] Payment captured for Razorpay Order: ${razorpayOrderId} / Payment: ${razorpayPaymentId}`);
      
      const db = await openUserDb(null);
      try {
        // Find the pending order we created before checkout opened. We saved razorpayOrderId in the payment_id field.
        const pendingOrder = await db.get('SELECT id, status FROM orders WHERE payment_id = ?', razorpayOrderId);
        
        if (pendingOrder) {
          if (pendingOrder.status === 'pending') {
             await db.run(
               `UPDATE orders SET status = 'processing', payment_status = 'paid', payment_id = ? WHERE id = ?`,
               [razorpayPaymentId, pendingOrder.id]
             );
             console.log(`[Webhook API] SUCCESS: Updated pending order ${pendingOrder.id} to paid!`);
          } else {
             console.log(`[Webhook API] Order ${pendingOrder.id} is already processed (status: ${pendingOrder.status}).`);
          }
        } else {
          // Check if it was already updated by the frontend verify/check-status
          const existingOrder = await db.get('SELECT id FROM orders WHERE payment_id = ?', razorpayPaymentId);
          if (existingOrder) {
             console.log(`[Webhook API] Order ${existingOrder.id} was already updated successfully by the frontend.`);
          } else {
             console.error(`[Webhook API] CRITICAL: Could not find any order matching Razorpay Order: ${razorpayOrderId}`);
          }
        }
      } catch (dbErr) {
        console.error('[Webhook API] Database Error:', dbErr);
      } finally {
        await db.close();
      }

    } else if (event.event === 'payment.failed') {
      console.log(`[Webhook API] Payment failed for Razorpay Order: ${event.payload.payment.entity.order_id}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[Webhook API] Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler failed' }, { status: 500 });
  }
}
