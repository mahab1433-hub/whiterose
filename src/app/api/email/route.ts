import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, orderId, items, total, shippingAddress } = await req.json();

    if (!email || !orderId || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailItems = items.map((item: any) => ({
      name: item.name || 'Product',
      quantity: item.quantity || 1,
      price: item.price || 0
    }));

    // 1. Send confirmation email to the customer
    await sendOrderConfirmationEmail(
      orderId,
      email,
      total,
      emailItems,
      shippingAddress
    );

    // 2. Send alert notification to administrators
    await sendAdminOrderNotificationEmail(
      orderId,
      total,
      emailItems,
      {
        ...shippingAddress,
        email: email
      }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Email Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
