'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const supabase = createClient(); // Use exported instance instead

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!id) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price,
              products (
                name,
                images
              )
            )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (isMounted) {
          if (!error && data) {
            setOrder(data);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Order detail fetch error:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchOrder();
      } else {
        setOrder(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={24} className="text-yellow-500" />;
      case 'processing': return <Package size={24} className="text-blue-500" />;
      case 'shipped': return <Truck size={24} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={24} className="text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <div className="animate-pulse text-[10px] uppercase tracking-widest text-zinc-500">Loading Order Details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-40 pb-24 text-center space-y-8 min-h-screen bg-black">
        <div className="space-y-4">
          <h1 className="text-3xl font-serif uppercase tracking-widest">Order Not Found</h1>
          <p className="text-sm text-zinc-500 font-light tracking-wide">This order doesn't exist or you don't have access to it.</p>
        </div>
        <Link 
          href="/orders" 
          className="inline-block px-12 py-5 bg-white !text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-all"
        >
          <span className="!text-black">Back to Orders</span>
        </Link>
      </div>
    );
  }

  const isCOD = order.payment_status === 'cod';

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <Link href="/orders" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            <span>Back to Orders</span>
          </Link>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Order Details</h2>
          <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-tight">Order #{order.id.split('-')[0]}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-white/5 p-8"
            >
              <h3 className="text-xs uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Items</h3>
              <div className="space-y-6">
                {order.order_items?.map((item: any, i: number) => {
                  const imageUrl = item.products?.images?.[0] || '';
                  return (
                    <div key={i} className="flex gap-6">
                      <div className="w-20 h-28 bg-zinc-900 border border-black overflow-hidden relative shadow-xl flex-shrink-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.products?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-accent-pink/5" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium uppercase tracking-wider">{item.products?.name}</h4>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-mono">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-950 border border-white/5 p-8 space-y-6"
            >
              <div>
                <h3 className="text-xs uppercase tracking-widest mb-4 pb-4 border-b border-white/5">Order Status</h3>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <span className="text-sm uppercase tracking-widest font-bold">{order.status}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest mb-4 pb-4 border-b border-white/5">Shipping Details</h3>
                <div className="text-xs text-zinc-400 space-y-2">
                  <p className="text-white font-medium uppercase tracking-wider">{order.shipping_address?.name}</p>
                  <p>{order.shipping_address?.address}</p>
                  <p>{order.shipping_address?.city} - {order.shipping_address?.pincode}</p>
                  <p className="pt-2">Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest mb-4 pb-4 border-b border-white/5">Payment Info</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-widest">Method</span>
                  <span className="font-medium uppercase">{isCOD ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest mb-4 pb-4 border-b border-white/5">Order Summary</h3>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-500 uppercase tracking-widest">Subtotal</span>
                  <span>₹{order.total_amount}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-4 pb-4 border-b border-white/5">
                  <span className="text-zinc-500 uppercase tracking-widest">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="uppercase tracking-widest">Total</span>
                  <span className="font-mono">₹{order.total_amount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
