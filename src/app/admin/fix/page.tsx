'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';

export default function AdminFix() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const runFix = async () => {
    setLoading(true);
    try {
      const userId = '2f95c842-347b-4410-9adb-18a5d967e68b'; // Gayathri Rose
      const productId = 'e2cccc2e-55dd-4267-b336-beecd5b358f3'; // Moringa Soap

      // 1. Create the order
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: userId,
        total_amount: 60,
        status: 'processing',
        payment_status: 'paid',
        payment_id: 'manual_fix_razorpay_60',
        shipping_address: {
          name: 'Gayathri Rose',
          email: 'gayathrirose1726@gmail.com',
          phone: '8248850912',
          city: 'Rajapalayam',
          address: 'Manual Entry Fix (System Recovery)',
          pincode: '626117'
        }
      }).select().single();

      if (orderError) throw orderError;

      // 2. Add the item
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: productId,
        quantity: 1,
        price: 60
      });

      if (itemError) throw itemError;

      setSuccess(true);
      toast.success('Gayathri Rose order recovered successfully!');
    } catch (err: any) {
      console.error('Fix error:', err);
      toast.error('Recovery failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-pink/10 mb-4">
            <Wand2 className="text-accent-pink" size={32} />
          </div>
          <h1 className="text-3xl font-serif uppercase tracking-tight">Order Recovery System</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Manually recover missing orders for Gayathri Rose (₹60 Moringa Soap)</p>
        </div>

        <div className="bg-zinc-950 border border-white/5 p-8 space-y-6">
          <div className="flex gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-sm">
            <AlertCircle className="text-blue-400 shrink-0" size={20} />
            <p className="text-[10px] text-blue-300 uppercase tracking-widest leading-relaxed">
              This tool will manually create the missing order record for Gayathri Rose in the database. 
              Only use this if the payment was already confirmed on Razorpay.
            </p>
          </div>

          {!success ? (
            <button 
              onClick={runFix}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
            >
              <span>{loading ? 'Recovering...' : 'Run Order Recovery'}</span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-green-400">
              <CheckCircle2 size={48} />
              <p className="text-[10px] uppercase tracking-widest font-bold">Order Successfully Recovered!</p>
              <a href="/admin/orders" className="text-white hover:text-accent-pink text-[10px] uppercase tracking-widest underline decoration-white/20">Go to Orders List</a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
