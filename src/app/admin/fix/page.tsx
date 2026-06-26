'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';

export default function AdminFix() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Email test states
  const [testEmail, setTestEmail] = useState('gayathrirose1726@gmail.com');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return toast.error('Please enter a recipient email');
    
    setEmailLoading(true);
    setEmailStatus(null);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          orderId: 'test_order_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          items: [
            { name: 'Moringa Luxury Soap (Test)', quantity: 1, price: 1 }
          ],
          total: 1,
          shippingAddress: {
            name: 'White Rose Tester',
            address: '123 Luxury Lane, Rajapalayam',
            city: 'Rajapalayam',
            pincode: '626117',
            phone: '8248850912',
            email: testEmail
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailStatus({
          success: true,
          message: 'Test emails successfully dispatched to Resend! Please check both inbox and spam folder.'
        });
        toast.success('Test email sent successfully!');
      } else {
        setEmailStatus({
          success: false,
          message: data.error || 'Unknown error occurred while sending.'
        });
        toast.error('Failed to send test email');
      }
    } catch (err: any) {
      setEmailStatus({
        success: false,
        message: err.message || 'Network request failed'
      });
      toast.error('Request failed');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto pt-12 space-y-12 pb-24">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-pink/10 mb-2">
            <Wand2 className="text-accent-pink" size={32} />
          </div>
          <h1 className="text-3xl font-serif uppercase tracking-tight">System Diagnostic Tools</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Verify and repair store transactions and email delivery services</p>
        </div>

        {/* 1. Order Recovery Section */}
        <div className="bg-zinc-950 border border-white/5 p-8 space-y-6">
          <h2 className="text-sm font-serif uppercase tracking-wider text-accent-pink border-b border-white/5 pb-3">Order Recovery System</h2>
          <div className="flex gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-sm">
            <AlertCircle className="text-blue-400 shrink-0" size={20} />
            <p className="text-[10px] text-blue-300 uppercase tracking-widest leading-relaxed">
              This tool manually recovers missing order records for Gayathri Rose in the database. 
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

        {/* 2. Email Test Section */}
        <div className="bg-zinc-950 border border-white/5 p-8 space-y-6">
          <h2 className="text-sm font-serif uppercase tracking-wider text-accent-pink border-b border-white/5 pb-3">Resend Email Delivery Test</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Trigger a manual test email using your configured Resend API key. This will attempt to send an <strong>Order Confirmation</strong> email to the address below, and an <strong>Admin Order Notification</strong> to the administrator list.
          </p>

          <form onSubmit={handleSendTestEmail} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="test-email-input" className="text-[10px] uppercase tracking-widest text-zinc-400">Recipient Email Address</label>
              <input 
                id="test-email-input"
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="enter recipient email address"
                className="bg-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-accent-pink transition-colors text-white"
              />
            </div>

            <button 
              type="submit"
              disabled={emailLoading}
              className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center"
            >
              <span>{emailLoading ? 'Sending Test...' : 'Send Test Order Email'}</span>
            </button>
          </form>

          {emailStatus && (
            <div className={`p-4 border rounded-sm ${
              emailStatus.success 
                ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-start gap-3">
                {emailStatus.success ? (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-widest font-bold">
                    {emailStatus.success ? 'Success' : 'API Failure Response'}
                  </div>
                  <p className="text-[11px] leading-relaxed uppercase tracking-wide opacity-90">{emailStatus.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
