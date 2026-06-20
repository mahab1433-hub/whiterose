import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';
import { Resend } from 'resend';
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

      // Send confirmation email server-side if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
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

          const itemsHtml = emailItems.map((item: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
            </tr>
          `).join('');

          await resend.emails.send({
            from: 'White Rose <orders@whiterosekeysoulcosmatics.com>', 
            to: [shippingAddressParsed.email],
            subject: `Order Confirmation - #${orderId.substring(0, 8)}`,
            html: `
              <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border: 1px solid #333;">
                <h1 style="text-align: center; text-transform: uppercase; letter-spacing: 5px; color: #dfa7b4;">White Rose</h1>
                <p style="text-align: center; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; color: #999;">Beauty Parlour Cosmetics & Tattoo Studio</p>
                
                <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
                  <h2 style="font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">Thank you for your order!</h2>
                  <p style="font-size: 14px; color: #ccc; line-height: 1.6;">We've received your order and we're getting it ready for you. Your order ID is <strong>#${orderId.substring(0, 8)}</strong>.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                  <thead>
                    <tr style="text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #999; border-bottom: 1px solid #333;">
                      <th style="text-align: left; padding: 10px;">Product</th>
                      <th style="text-align: right; padding: 10px;">Price</th>
                    </tr>
                  </thead>
                  <tbody style="font-size: 13px;">
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style="padding: 20px 10px 10px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #999;">Shipping</td>
                      <td style="padding: 20px 10px 10px; text-align: right;">FREE</td>
                    </tr>
                    <tr style="font-size: 18px; color: #dfa7b4;">
                      <td style="padding: 10px; text-transform: uppercase; letter-spacing: 2px;">Total Amount</td>
                      <td style="padding: 10px; text-align: right; font-weight: bold;">₹${order.total_amount}</td>
                    </tr>
                  </tfoot>
                </table>

                <div style="margin-top: 40px; padding: 20px; background-color: #111; border: 1px solid #333;">
                  <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #dfa7b4; margin-bottom: 10px;">Shipping Address</h3>
                  <p style="font-size: 13px; margin: 0; color: #ccc;">${shippingAddressParsed.name}</p>
                  <p style="font-size: 13px; margin: 5px 0 0; color: #ccc;">${shippingAddressParsed.address}, ${shippingAddressParsed.city} - ${shippingAddressParsed.pincode}</p>
                  <p style="font-size: 13px; margin: 5px 0 0; color: #ccc;">Phone: ${shippingAddressParsed.phone}</p>
                </div>

                <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
                  <p>123, Luxury Lane, Rajapalayam, Tamil Nadu</p>
                  <p>+91 82488 50912 | gayathrirose1726@gmail.com</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email server-side:', emailError);
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
