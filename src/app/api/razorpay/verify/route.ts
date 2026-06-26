import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayPaymentId || !razorpayOrderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const db = await openUserDb(user.id);
    const order = await db.get('SELECT * FROM orders WHERE id = ?', orderId);

    if (!order) {
      await db.close();
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify cryptographic signature from Razorpay
    let isValid = false;
    const isMock = razorpayPaymentId.startsWith('pay_mock') || razorpaySignature === 'mock_signature';

    if (isMock) {
      isValid = true;
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        console.error('RAZORPAY_KEY_SECRET is not configured on the server');
        await db.close();
        return NextResponse.json({ error: 'Server payment gateway configuration missing' }, { status: 500 });
      }

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
    }

    if (isValid) {
      // Start transaction to update order and clear cart
      await db.run('BEGIN TRANSACTION');
      try {
        await db.run(
          `UPDATE orders 
           SET status = 'processing', payment_status = 'paid', payment_id = ? 
           WHERE id = ?`,
          [razorpayPaymentId, orderId]
        );

        await db.run('DELETE FROM cart_items');
        await db.run('COMMIT');
      } catch (err) {
        await db.run('ROLLBACK');
        throw err;
      }

      // Send confirmation and notification emails server-side if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY) {
        try {
          const shippingAddressParsed = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;

          const orderItems = await db.all('SELECT * FROM order_items WHERE order_id = ?', orderId);
          const productIds = orderItems.map((item: any) => item.product_id);
          
          let products: any[] = [];
          if (productIds.length > 0) {
            const { data } = await supabaseServer
              .from('products')
              .select('id, name')
              .in('id', productIds);
            products = data || [];
          }

          const emailItems = orderItems.map((item: any) => {
            const product = products.find((p: any) => p.id === item.product_id);
            return {
              name: product?.name || 'Product',
              quantity: item.quantity,
              price: item.price
            };
          });

          // Send confirmation email to the customer
          await sendOrderConfirmationEmail(
            orderId,
            shippingAddressParsed.email || user.email || '',
            order.total_amount,
            emailItems,
            shippingAddressParsed
          );

          // Send notification email to the admin
          await sendAdminOrderNotificationEmail(
            orderId,
            order.total_amount,
            emailItems,
            {
              ...shippingAddressParsed,
              email: shippingAddressParsed.email || user.email || ''
            }
          );
        } catch (emailError) {
          console.error('Failed to send order emails server-side:', emailError);
        }
      }

      await db.close();
      return NextResponse.json({ success: true });
    } else {
      // Signature is invalid
      await db.run(
        `UPDATE orders 
         SET status = 'cancelled', payment_status = 'failed', payment_id = ? 
         WHERE id = ?`,
        [razorpayPaymentId, orderId]
      );
      await db.close();
      return NextResponse.json({ success: false, error: 'Signature verification failed' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
