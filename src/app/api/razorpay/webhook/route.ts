import { NextResponse } from 'next/server';
import crypto from 'crypto';

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
      
      // The verify endpoint already creates the order, but you can use this 
      // webhook to update statuses if the user closed the app before /verify could be called.
      console.log(`[Webhook API] Payment captured for Razorpay Order: ${razorpayOrderId}`);
      
      // Example: You can use openUserDb() here to update the order status if needed
    } else if (event.event === 'payment.failed') {
      console.log(`[Webhook API] Payment failed for Razorpay Order: ${event.payload.payment.entity.order_id}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[Webhook API] Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler failed' }, { status: 500 });
  }
}
