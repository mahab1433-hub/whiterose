'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/store';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCart((state) => state.clearCart);

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [verifiedOrderId, setVerifiedOrderId] = useState<string>('');

  const paymentId = searchParams.get('razorpay_payment_id');
  const razorpayOrderId = searchParams.get('razorpay_order_id');
  const signature = searchParams.get('razorpay_signature');

  useEffect(() => {
    if (!paymentId || !razorpayOrderId) {
      setStatus('failed');
      setErrorMsg('Missing checkout session credentials.');
      return;
    }

    const pendingOrderStr = sessionStorage.getItem('pending_order_details');
    if (!pendingOrderStr) {
      setStatus('failed');
      setErrorMsg('Missing checkout order items context. Please contact support.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            razorpayPaymentId: paymentId,
            razorpayOrderId,
            razorpaySignature: signature || 'mock_signature',
            totalAmount: pendingOrder.totalAmount,
            shippingAddress: pendingOrder.shippingAddress,
            items: pendingOrder.items,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          clearCart();
          setVerifiedOrderId(data.orderId);
          sessionStorage.removeItem('pending_order_details');
          setStatus('success');
        } else {
          setStatus('failed');
          setErrorMsg(data.error || 'The payment signature could not be verified securely.');
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        setStatus('failed');
        setErrorMsg('A network error occurred while verifying the payment.');
      }
    };

    // Add a slight artificial delay so the user feels the security check completing
    const timer = setTimeout(() => {
      verifyPayment();
    }, 1500);

    return () => clearTimeout(timer);
  }, [paymentId, razorpayOrderId, signature, clearCart]);

  return (
    <div className="min-h-screen bg-black pt-40 pb-24 px-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-zinc-950 border border-white/5 p-12 text-center space-y-8 rounded-sm shadow-2xl relative overflow-hidden">
        {/* Top Shimmering Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-pink to-transparent animate-pulse" />

        {status === 'verifying' && (
          <div className="space-y-8 py-4">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Loader2 size={56} className="text-accent-pink animate-spin" />
                <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-10" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-xl font-serif uppercase tracking-[0.2em] text-white">Verifying Payment</h1>
              <p className="text-xs text-zinc-400 font-light tracking-widest uppercase">
                Securing transaction from our side
              </p>
              <p className="text-[10px] text-zinc-600 font-mono tracking-wide max-w-[280px] mx-auto leading-relaxed pt-2">
                Please do not close this window, press back, or refresh the page.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-widest text-zinc-500 bg-white/5 py-2 px-4 rounded-full max-w-fit mx-auto">
              <ShieldCheck size={12} className="text-zinc-500" />
              <span>Cryptographic SSL Verification</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8 py-4 animate-fadeIn">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-serif uppercase tracking-widest text-white">Verification Success</h1>
              <p className="text-xs text-zinc-400 font-light tracking-wide leading-relaxed">
                Your transaction has been validated by our servers. Your order has been placed successfully.
              </p>
            </div>

            {verifiedOrderId && (
              <div className="py-4 border-y border-white/5">
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Order Reference</p>
                <p className="font-mono text-white text-sm">WRB-{verifiedOrderId.substring(0, 8).toUpperCase()}</p>
              </div>
            )}

            <div className="pt-2">
              <Link 
                href={`/checkout/success?id=${verifiedOrderId}`}
                className="w-full py-4 bg-white !text-black hover:bg-accent-pink hover:!text-white transition-all flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold"
              >
                <span>View My Order Invoice</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-8 py-4 animate-fadeIn">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <XCircle size={48} className="text-red-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-xl font-serif uppercase tracking-widest text-white">Verification Failed</h1>
              <p className="text-xs text-red-400/80 font-light tracking-wide leading-relaxed">
                {errorMsg || 'We were unable to verify this transaction cryptographically.'}
              </p>
            </div>

            <div className="py-4 border-y border-white/5 text-[10px] text-zinc-500 tracking-widest uppercase space-y-1">
              {paymentId && (
                <div>Payment ID: <span className="font-mono text-white">{paymentId}</span></div>
              )}
              <div className="text-[9px] text-zinc-500 leading-normal pt-2">
                If money was deducted from your account, please contact us at support@whiterose.com with the payment reference shown above.
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                href="/cart" 
                className="w-full py-4 bg-white !text-black hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold"
              >
                <span>Return to Cart</span>
              </Link>
              <Link 
                href="/" 
                className="w-full py-4 border border-white/10 hover:border-white transition-colors flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-white"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-40 pb-24 px-6 flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-accent-pink" />
        <span className="mt-4 uppercase text-[10px] tracking-widest opacity-40">Loading verification context...</span>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
