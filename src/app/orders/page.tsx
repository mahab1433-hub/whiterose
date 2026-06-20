'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  // const supabase = createClient(); // Use exported instance instead

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        const res = await fetch('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();

        if (isMounted) {
          setOrders(data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Order fetch error:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    // Listen for auth changes to re-fetch if needed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchOrders();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={18} className="text-yellow-500" />;
      case 'processing': return <Package size={18} className="text-blue-500" />;
      case 'shipped': return <Truck size={18} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={18} className="text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <div className="animate-pulse text-[10px] uppercase tracking-widest text-zinc-500">Loading Order History...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center space-y-8 min-h-screen bg-black">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
            <ShoppingBag size={40} />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-serif uppercase tracking-widest">No Orders Yet</h1>
          <p className="text-sm text-zinc-500 font-light tracking-wide">Start your beauty journey today.</p>
        </div>
        <Link 
          href="/shop" 
          className="inline-block px-12 py-5 bg-white !text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-all"
        >
          <span className="!text-black">Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-4 mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Account</h2>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tight">Order History</h1>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-white/5 p-8 space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Order Placed</p>
                  <p className="text-xs">{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total Amount</p>
                  <p className="text-xs">₹{order.total_amount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Order ID</p>
                  <p className="text-xs uppercase">WRB-{order.id.substring(0, 8)}</p>
                </div>
                <div className="flex items-center space-x-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                  {getStatusIcon(order.status)}
                  <span className="text-[10px] uppercase tracking-widest font-bold">{order.status}</span>
                </div>
              </div>

              {/* Shipping Address Summary */}
              {order.shipping_address && (
                <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] text-accent-pink">
                    <Truck size={12} />
                    <span>Shipping To</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold tracking-wider uppercase text-zinc-200">
                      {(order.shipping_address as any).name}
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md">
                      {(order.shipping_address as any).address}, {(order.shipping_address as any).city} - {(order.shipping_address as any).pincode}
                    </p>
                    <p className="text-[9px] text-zinc-600 tracking-widest pt-1">
                      CONTACT: {(order.shipping_address as any).phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex -space-x-4">
                  {order.order_items?.slice(0, 3).map((item: any, i: number) => {
                    const imageUrl = item.products?.images?.[0] || '';
                    return (
                      <div key={i} className="w-16 h-20 bg-zinc-900 border border-black overflow-hidden relative shadow-xl">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.products?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-accent-pink/5" />
                        )}
                      </div>
                    );
                  })}
                  {order.order_items && order.order_items.length > 3 && (
                    <div className="w-16 h-20 bg-black/80 border border-white/10 flex items-center justify-center text-[10px] font-bold z-10 relative shadow-xl">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>
                
                <Link 
                  href={`/orders/${order.id}`}
                  className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent-pink hover:text-white transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
