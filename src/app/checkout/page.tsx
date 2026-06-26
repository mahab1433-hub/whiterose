'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/lib/store';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CheckoutContent = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const total = totalPrice();
  const router = useRouter();
  const supabase = createClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const shippingFee = 0;
  const finalTotal = total;


  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to complete your checkout');
        router.push('/login?redirect=/checkout');
        return;
      }
      setUser(session.user);
      setHasHydrated(true);
    };

    checkAuth();
  }, [supabase, router]);

  if (!hasHydrated) {
    return (
      <div className="pt-40 text-center min-h-screen bg-black">
        <div className="animate-pulse text-[10px] uppercase tracking-[0.4em] text-zinc-500">Checking Authentication...</div>
      </div>
    );
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    
    setLoading(true);
    const scriptLoaded = await loadRazorpay();

    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          receipt: `rcpt_${Math.random().toString(36).substring(7)}`,
        }),
      });

      const orderData = await response.json();
      if (orderData.error) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'White Rose Beauty Parlour Cosmetics & Tattoo Studio',
        description: 'Luxury Beauty Purchase',
        order_id: orderData.id,
        handler: async function (response: any) {
          toast.success('Payment is successful');
          
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user?.id;

            if (!currentUserId || !session) {
              throw new Error('User not authenticated. Please contact support with payment ID: ' + response.razorpay_payment_id);
            }

            const orderRes = await fetch('/api/user/orders', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                totalAmount: finalTotal,
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'pending',
                shippingAddress: { ...formData, shipping_fee: shippingFee },
                items: items.map(item => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price
                }))
              })
            });

            if (!orderRes.ok) {
              const errData = await orderRes.json();
              throw new Error(errData.error || 'Order saving failed');
            }

            const { order } = await orderRes.json();

            // Redirect to secure verification page
            router.push(
              `/checkout/verify?order_id=${order.id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`
            );
          } catch (err: any) {
            console.error('CRITICAL ORDER INSERTION ERROR:', err);
            toast.error('Order saving failed: ' + (err.message || 'Unknown error') + '. Please contact support with Payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#000000' },
      };

      const rzp1 = (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      toast.error(error.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-12">
            <h1 className="text-4xl font-serif uppercase tracking-tight">Checkout</h1>
            <form onSubmit={handlePayment} className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-xl font-serif uppercase tracking-widest border-b border-white/5 pb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input required placeholder="FULL NAME" name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input required placeholder="EMAIL" type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input required placeholder="PHONE" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input required placeholder="CITY" name="city" value={formData.city} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input required placeholder="PINCODE" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <textarea required placeholder="STREET ADDRESS" name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full md:col-span-2 bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-500 text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Secure Payment via Razorpay</span>
                </div>
                <button disabled={loading || items.length === 0} className="w-full bg-white !text-black py-6 text-xs font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-4">
                  <Lock size={16} className="!text-black" />
                  <span className="!text-black">{loading ? 'Processing...' : `Pay ₹${finalTotal} Now`}</span>
                </button>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-96">
            <div className="bg-zinc-950 border border-white/5 p-8 space-y-8 sticky top-32">
              <h3 className="text-xl font-serif uppercase tracking-widest">Order Summary</h3>
              <div className="space-y-4">
                {items.map((item) => {
                  const latestImage = item.image_url;
                  
                  return (
                    <div key={item.id} className="flex justify-between items-center text-[10px] uppercase tracking-wider group">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-zinc-900 border border-white/5 relative overflow-hidden flex-shrink-0">
                          {latestImage ? (
                            <Image 
                              src={latestImage} 
                              alt={item.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[6px]">
                              NO PHOTO
                            </div>
                          )}
                        </div>
                        <span className="truncate w-32 group-hover:text-accent-pink transition-colors">{item.name}</span>
                        <span className="text-zinc-500 font-sans">x{item.quantity}</span>
                      </div>
                      <span className="font-sans">₹{item.price * item.quantity}</span>
                    </div>
                  );
                })}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-sans">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500">
                    <span>Shipping</span>
                    <span className="font-sans text-white">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl text-accent-pink pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 p-8 text-center space-y-6 rounded-sm relative shadow-2xl">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <CheckCircle size={40} className="text-green-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-serif uppercase tracking-widest text-white">Payment is Successful</h2>
              <p className="text-xs text-zinc-400 font-light tracking-wide leading-relaxed">
                Your payment was successfully received. Thank you for your purchase!
              </p>
            </div>

            {successOrderId && (
              <div className="py-3 border-y border-white/5 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                Order Ref: <span className="text-white">WRB-{successOrderId.substring(0, 8).toUpperCase()}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/checkout/success?id=${successOrderId}`);
                }}
                className="w-full py-3 bg-white !text-black hover:bg-accent-pink hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={<div className="pt-40 text-center uppercase tracking-widest opacity-30">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
