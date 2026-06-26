import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';
import crypto from 'crypto';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  console.log('[Verify API] --- Payment Verification Request Received ---');
  try {
    // 1. Authenticate user (optional to support guest checkout)
    const user = await getAuthenticatedUser();
    if (user) {
      console.log(`[Verify API] Authenticated customer detected. ID: ${user.id}, Email: ${user.email}`);
    } else {
      console.log('[Verify API] Guest / Anonymous checkout detected.');
    }

    // 2. Parse request body
    const body = await req.json();
    const { 
      razorpayPaymentId, 
      razorpayOrderId, 
      razorpaySignature,
      totalAmount,
      shippingAddress,
      items
    } = body;

    console.log(`[Verify API] Parameters: PaymentId: ${razorpayPaymentId}, OrderId: ${razorpayOrderId}, Items count: ${items?.length}, Total: ${totalAmount}`);

    // 3. Validation
    if (!razorpayPaymentId || !razorpayOrderId || !totalAmount || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      console.error('[Verify API] Validation failed: Missing required parameters or empty items list.', {
        razorpayPaymentId: !!razorpayPaymentId,
        razorpayOrderId: !!razorpayOrderId,
        totalAmount: !!totalAmount,
        shippingAddress: !!shippingAddress,
        itemsCount: items?.length || 0
      });
      return NextResponse.json({ error: 'Missing required parameters or empty items list' }, { status: 400 });
    }

    // 4. Verify cryptographic signature from Razorpay
    let isValid = false;
    const isMock = razorpayPaymentId.startsWith('pay_mock') || razorpaySignature === 'mock_signature';

    if (isMock) {
      console.log('[Verify API] Mock payment detected, bypassing cryptographic check.');
      isValid = true;
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        console.error('[Verify API] ERROR: RAZORPAY_KEY_SECRET is not configured on the server.');
        return NextResponse.json({ error: 'Server payment gateway configuration missing' }, { status: 500 });
      }

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
      console.log(`[Verify API] Cryptographic signature validation result: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    }

    if (!isValid) {
      console.error('[Verify API] Cryptographic verification failed.');
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // 5. Open database session
    const db = await openUserDb(user?.id || null);

    // 6. Check for duplicate payment execution
    console.log(`[Verify API] Scanning database for duplicate payment ID: ${razorpayPaymentId}...`);
    const existingOrder = await db.get('SELECT * FROM orders WHERE payment_id = ?', razorpayPaymentId);
    if (existingOrder) {
      console.log(`[Verify API] Order already exists for Payment ID: ${razorpayPaymentId} (Order Reference: ${existingOrder.id}). Preventing duplicate creation.`);
      await db.close();
      return NextResponse.json({ success: true, orderId: existingOrder.id });
    }

    // 7. Insert Order & Order Items inside a secure transaction block
    const orderId = randomUUID();
    console.log(`[Verify API] Initiating database transaction for order: ${orderId}...`);
    
    await db.run('BEGIN TRANSACTION');
    try {
      // 1. Insert parent order
      await db.run(
        `INSERT INTO orders (id, user_id, total_amount, status, payment_id, payment_status, shipping_address) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          user?.id || null,
          totalAmount,
          'processing',
          razorpayPaymentId,
          'paid',
          JSON.stringify(shippingAddress)
        ]
      );
      console.log('[Verify API] Order metadata saved successfully.');

      // 2. Insert child order items
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
      console.log(`[Verify API] Saved ${items.length} order items successfully.`);

      // 3. Clear cart items if checkout belongs to a logged-in user
      if (user?.id) {
        await db.run('DELETE FROM cart_items');
        console.log(`[Verify API] Cleared online cart for authenticated user: ${user.id}`);
      }

      await db.run('COMMIT');
      console.log('[Verify API] Database transaction committed successfully.');
    } catch (dbErr: any) {
      console.error('[Verify API] Database write failure, rolling back transaction:', dbErr);
      await db.run('ROLLBACK');
      await db.close();
      return NextResponse.json({ error: 'Failed to write order data to the database: ' + dbErr.message }, { status: 500 });
    }

    // 8. Order confirmation emails via Resend (Only run if DB transaction was successful)
    console.log('[Verify API] Database save completed. Initializing Resend notifications...');
    if (process.env.RESEND_API_KEY) {
      try {
        const shippingAddressParsed = typeof shippingAddress === 'string' 
          ? JSON.parse(shippingAddress) 
          : shippingAddress;

        // Fetch product names for email from database
        const productIds = items.map((item: any) => item.productId);
        let products: any[] = [];
        if (productIds.length > 0) {
          const { data } = await supabaseAdmin
            .from('products')
            .select('id, name')
            .in('id', productIds);
          products = data || [];
        }

        const emailItems = items.map((item: any) => {
          const product = products.find((p: any) => p.id === item.productId);
          return {
            name: product?.name || 'Product',
            quantity: item.quantity,
            price: item.price
          };
        });

        const customerEmail = shippingAddressParsed.email || user?.email || '';
        if (customerEmail) {
          console.log(`[Verify API] Dispatching order confirmation email to customer: ${customerEmail}`);
          await sendOrderConfirmationEmail(
            orderId,
            customerEmail,
            totalAmount,
            emailItems,
            shippingAddressParsed
          );
          console.log('[Verify API] Customer confirmation email sent.');
        } else {
          console.warn('[Verify API] Could not find customer email address. Skipping confirmation email.');
        }

        console.log('[Verify API] Dispatching order notification email to admin...');
        await sendAdminOrderNotificationEmail(
          orderId,
          totalAmount,
          emailItems,
          {
            ...shippingAddressParsed,
            email: customerEmail
          }
        );
        console.log('[Verify API] Admin notification email sent.');
      } catch (emailError) {
        console.error('[Verify API] ERROR: Notification emails failed to send:', emailError);
      }
    } else {
      console.warn('[Verify API] RESEND_API_KEY is not defined. Email dispatch skipped.');
    }

    await db.close();
    console.log('[Verify API] --- Payment Verification Request Completed Successfully ---');
    return NextResponse.json({ success: true, orderId });

  } catch (error: any) {
    console.error('[Verify API] CRITICAL: Unexpected handler exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
