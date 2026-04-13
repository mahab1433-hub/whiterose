'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/store';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import Image from 'next/image';

const CartPage = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const total = totalPrice();

  if (!hasHydrated) {
    return <div className="pt-40 text-center uppercase tracking-widest opacity-30">Loading Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center space-y-8 min-h-screen">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
            <ShoppingBag size={40} />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-serif uppercase tracking-widest">Your bag is empty</h1>
          <p className="text-sm text-zinc-500 font-light tracking-wide">Looks like you haven't added anything yet.</p>
        </div>
        <Link 
          href="/shop" 
          className="inline-block px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
              <h1 className="text-4xl font-serif uppercase tracking-tight">Shopping Bag</h1>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">{items.length} Items</span>
            </div>

            <div className="space-y-8">
              <AnimatePresence>
                {items.map((item) => {
                  const latestImage = MOCK_PRODUCTS.find(p => p.id === item.id)?.image_url || item.image_url;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col sm:flex-row gap-6 border-b border-white/5 pb-8 group"
                    >
                      <div className="w-32 aspect-[3/4] bg-zinc-900 overflow-hidden relative border border-white/5">
                        {latestImage ? (
                          <Image 
                            src={latestImage} 
                            alt={item.name} 
                            fill
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px] uppercase tracking-widest">
                            No Photo
                          </div>
                        )}
                      </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-accent-pink">{item.category}</p>
                          <h3 className="text-lg font-serif uppercase tracking-wider">{item.name}</h3>
                          <p className="text-sm text-zinc-500 font-light">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-lg font-light">₹{item.price * item.quantity}</p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center border border-white/10 h-10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

          {/* Summary */}
          <div className="w-full lg:w-96 space-y-8">
            <div className="bg-zinc-950 border border-white/5 p-8 space-y-8 sticky top-32">
              <h2 className="text-xl font-serif uppercase tracking-widest">Order Summary</h2>
              
              <div className="space-y-4 text-[10px] uppercase tracking-[0.2em]">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-zinc-500 border-b border-white/5 pb-4">
                  <span>Estimated Tax</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-lg font-light text-white pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/checkout"
                  className="w-full bg-white text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
                >
                  <span className="text-black">Proceed to Checkout</span>
                  <ArrowRight size={14} className="text-black" />
                </Link>
                <Link 
                  href="/shop"
                  className="block text-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="pt-6 text-[9px] text-zinc-600 uppercase tracking-[0.2em] leading-loose text-center">
                Tax Calculated at next step. <br />
                Secure checkout with Razorpay.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
