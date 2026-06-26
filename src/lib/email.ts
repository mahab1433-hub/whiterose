import { Resend } from 'resend';

let resendInstance: Resend | null = null;
function getResend() {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || 're_dummy_for_build_checks');
  }
  return resendInstance;
}

const SENDER_EMAIL = 'White Rose <orders@whiterosekeysoulcosmatics.com>';
const ADMIN_EMAILS = ['mahab1433@gmail.com', 'babutmuthumari@gmail.com', 'gayathrirose1726@gmail.com'];

export interface EmailOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface EmailShippingAddress {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email?: string;
}

/**
 * Sends a premium order confirmation HTML email to the customer.
 */
export async function sendOrderConfirmationEmail(
  orderId: string,
  customerEmail: string,
  totalAmount: number,
  items: EmailOrderItem[],
  shippingAddress: EmailShippingAddress
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured. Skipping customer email.');
    return;
  }

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid #222; text-align: left; color: #ccc;">
        <div style="font-weight: bold; color: #fff; font-size: 14px;">${item.name}</div>
        <div style="font-size: 11px; color: #777; margin-top: 4px;">Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #222; text-align: right; color: #dfa7b4; font-weight: bold; font-size: 14px;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            font-family: 'Outfit', sans-serif;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Outfit', sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px; border-bottom: 1px solid #111;">
                    <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; letter-spacing: 6px; text-transform: uppercase; color: #ffffff; margin: 0; line-height: 1.2;">White Rose</h1>
                    <p style="font-size: 9px; text-transform: uppercase; letter-spacing: 4px; color: #dfa7b4; margin: 8px 0 0; font-weight: 600;">Beauty Parlour Cosmetics & Tattoo Studio</p>
                  </td>
                </tr>
                
                <!-- Hero Body -->
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; color: #dfa7b4; margin: 0 0 16px;">Thank You For Your Order</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #aaaaaa; margin: 0;">We have successfully received your order and are currently preparing it for processing. Your purchase transaction details are listed below.</p>
                    
                    <div style="margin-top: 24px; padding: 12px 16px; background-color: #111111; border-left: 3px solid #dfa7b4; font-size: 13px; color: #dddddd;">
                      Order Identifier: <strong style="color: #ffffff; font-family: monospace;">#${orderId.substring(0, 8).toUpperCase()}</strong>
                    </div>
                  </td>
                </tr>

                <!-- Order Items Table -->
                <tr>
                  <td style="padding: 10px 40px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <thead>
                        <tr style="border-bottom: 1px solid #222;">
                          <th style="padding: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #777; text-align: left;">Product</th>
                          <th style="padding: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #777; text-align: right;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td style="padding: 16px 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #777; text-align: left;">Shipping</td>
                          <td style="padding: 16px 10px 8px; font-size: 12px; color: #ffffff; font-weight: bold; text-align: right;">FREE</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 10px; font-family: 'Playfair Display', serif; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; color: #dfa7b4; text-align: left;">Total Paid</td>
                          <td style="padding: 8px 10px; font-size: 20px; color: #dfa7b4; font-weight: bold; text-align: right;">₹${totalAmount}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </td>
                </tr>

                <!-- Shipping Details -->
                <tr>
                  <td style="padding: 30px 40px 40px;">
                    <div style="padding: 24px; background-color: #111111; border: 1px solid #1a1a1a; border-radius: 2px;">
                      <h3 style="font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; color: #dfa7b4; margin: 0 0 16px; border-bottom: 1px solid #222; padding-bottom: 10px;">Delivery Address</h3>
                      <p style="font-size: 13px; font-weight: 600; color: #ffffff; margin: 0 0 6px;">${shippingAddress.name}</p>
                      <p style="font-size: 13px; line-height: 1.5; color: #999999; margin: 0 0 12px;">${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
                      <p style="font-size: 12px; color: #777777; margin: 0;">Phone: <span style="color: #aaaaaa; font-weight: 600;">${shippingAddress.phone}</span></p>
                    </div>
                  </td>
                </tr>

                <!-- Footer Info -->
                <tr>
                  <td align="center" style="padding: 30px 40px; background-color: #030303; border-top: 1px solid #111; font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 2px; line-height: 1.8;">
                    <p style="margin: 0 0 8px; color: #888888;">White Rose Luxury Studio</p>
                    <p style="margin: 0 0 8px;">123, Luxury Lane, Rajapalayam, Tamil Nadu</p>
                    <p style="margin: 0;">support: +91 82488 50912 | gayathrirose1726@gmail.com</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [customerEmail],
      subject: `Order Confirmed - #${orderId.substring(0, 8).toUpperCase()}`,
      html: htmlContent
    });
  } catch (error) {
    console.error('Resend error sending customer email:', error);
  }
}

/**
 * Sends a premium order notification HTML email to the administrator.
 */
export async function sendAdminOrderNotificationEmail(
  orderId: string,
  totalAmount: number,
  items: EmailOrderItem[],
  shippingAddress: EmailShippingAddress
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured. Skipping admin email.');
    return;
  }

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #222; text-align: left; color: #ccc;">
        <span style="color: #fff; font-weight: bold;">${item.name}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #222; text-align: center; color: #aaa;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #222; text-align: right; color: #dfa7b4; font-weight: bold;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            font-family: 'Outfit', sans-serif;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Outfit', sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px; border-bottom: 1px solid #111; background-color: #0e0a0b;">
                    <div style="display: inline-block; padding: 4px 10px; background-color: #dfa7b4; color: #000; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-radius: 2px;">Admin Notification</div>
                    <h1 style="font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 400; letter-spacing: 4px; text-transform: uppercase; color: #ffffff; margin: 0; line-height: 1.2;">New Order Received</h1>
                    <p style="font-size: 11px; letter-spacing: 1px; color: #888888; margin: 8px 0 0;">An order has been successfully placed and paid.</p>
                  </td>
                </tr>
                
                <!-- Order Status Card -->
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <div style="padding: 20px; background-color: #dfa7b40d; border: 1px dashed #dfa7b450; border-radius: 2px; text-align: center; margin-bottom: 30px;">
                      <div style="font-size: 11px; text-transform: uppercase; tracking-widest; color: #888; margin-bottom: 6px;">Total Revenue</div>
                      <div style="font-size: 28px; font-weight: bold; color: #dfa7b4;">₹${totalAmount}</div>
                      <div style="font-size: 12px; color: #aaa; margin-top: 8px; font-family: monospace;">Order ID: #${orderId.toUpperCase()}</div>
                    </div>
                  </td>
                </tr>

                <!-- Order items -->
                <tr>
                  <td style="padding: 10px 40px;">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; color: #dfa7b4; margin: 0 0 12px; border-bottom: 1px solid #222; padding-bottom: 8px;">Order Details</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <thead>
                        <tr style="border-bottom: 1px solid #222;">
                          <th style="padding: 8px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #777; text-align: left;">Item</th>
                          <th style="padding: 8px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #777; text-align: center; width: 60px;">Qty</th>
                          <th style="padding: 8px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #777; text-align: right; width: 100px;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Shipping and Customer Profile -->
                <tr>
                  <td style="padding: 30px 40px 40px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100%" style="padding: 20px; background-color: #111111; border: 1px solid #1a1a1a; border-radius: 2px;">
                          <h3 style="font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; color: #dfa7b4; margin: 0 0 12px; border-bottom: 1px solid #222; padding-bottom: 8px;">Customer & Delivery info</h3>
                          <p style="font-size: 13px; margin: 0 0 6px; color: #fff;"><strong>Name:</strong> ${shippingAddress.name}</p>
                          <p style="font-size: 13px; margin: 0 0 6px; color: #aaa;"><strong>Address:</strong> ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
                          <p style="font-size: 13px; margin: 0 0 6px; color: #aaa;"><strong>Phone:</strong> ${shippingAddress.phone}</p>
                          <p style="font-size: 13px; margin: 0; color: #aaa;"><strong>Email:</strong> ${shippingAddress.email || 'N/A'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Dashboard Link -->
                <tr>
                  <td align="center" style="padding: 0 40px 40px;">
                    <a href="https://whiterosekeysoulcosmatics.com/admin/orders" style="display: inline-block; padding: 14px 30px; background-color: #ffffff; color: #000000; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 2px; transition: background 0.3s;">
                      Manage in Admin Dashboard
                    </a>
                  </td>
                </tr>

                <!-- Footer Info -->
                <tr>
                  <td align="center" style="padding: 30px 40px; background-color: #030303; border-top: 1px solid #111; font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 2px; line-height: 1.8;">
                    <p style="margin: 0;">White Rose Store Automated Alert System</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: ADMIN_EMAILS,
      subject: `[ALERT] New Order Received - ₹${totalAmount} (#${orderId.substring(0, 8).toUpperCase()})`,
      html: htmlContent
    });
  } catch (error) {
    console.error('Resend error sending admin notification email:', error);
  }
}
