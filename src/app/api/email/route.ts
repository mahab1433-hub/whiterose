import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email, orderId, items, total, shippingAddress } = await req.json();

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: 'White Rose <orders@whiterosekeysoulcosmatics.com>', 
      to: [email],
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
                <td style="padding: 20px 10px 10px; text-align: right;">₹80</td>
              </tr>
              <tr style="font-size: 18px; color: #dfa7b4;">
                <td style="padding: 10px; text-transform: uppercase; letter-spacing: 2px;">Total Amount</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">₹${total}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 40px; padding: 20px; background-color: #111; border: 1px solid #333;">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #dfa7b4; margin-bottom: 10px;">Shipping Address</h3>
            <p style="font-size: 13px; margin: 0; color: #ccc;">${shippingAddress.name}</p>
            <p style="font-size: 13px; margin: 5px 0 0; color: #ccc;">${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
            <p style="font-size: 13px; margin: 5px 0 0; color: #ccc;">Phone: ${shippingAddress.phone}</p>
          </div>

          <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
            <p>123, Luxury Lane, Rajapalayam, Tamil Nadu</p>
            <p>+91 82488 50912 | gayathrirose1726@gmail.com</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
