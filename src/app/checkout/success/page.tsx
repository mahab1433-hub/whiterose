'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black pt-40 pb-24 px-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-zinc-950 border border-white/5 p-12 text-center space-y-8 rounded-sm">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Order Placed!</h1>
          <p className="text-sm text-zinc-400 font-light tracking-wide leading-relaxed">
            Thank you for your purchase. Your payment was successful and your order is now being processed.
          </p>
        </div>

        {orderId && (
          <div className="py-4 border-y border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Order Reference</p>
            <p className="font-mono text-white text-sm">WRB-{orderId.substring(0, 8).toUpperCase()}</p>
          </div>
        )}

        <div className="pt-4 flex flex-col space-y-4">
          <Link 
            href="/orders" 
            className="w-full py-4 border border-white/10 hover:border-white transition-colors flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-white"
          >
            <Package size={14} />
            <span>View My Orders</span>
          </Link>
          <Link 
            href="/shop" 
            className="w-full py-4 bg-white !text-black hover:bg-accent-pink transition-colors flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold"
          >
            <span className="!text-black">Continue Shopping</span>
            <ArrowRight size={14} className="!text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center uppercase tracking-widest opacity-30 min-h-screen bg-black text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
