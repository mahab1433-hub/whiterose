import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

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

    const { amount, currency = 'INR', receipt } = body;

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: 'Invalid amount', received: amount }, { status: 400 });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
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
