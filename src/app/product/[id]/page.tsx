'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ShoppingBag, Heart, Share2, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import { useCart } from '@/lib/store';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-serif uppercase">Product Not Found</h1>
        <button onClick={() => router.back()} className="mt-8 text-accent-pink uppercase tracking-widest text-[10px] border-b border-accent-pink">
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Basic logic for quantity would need store update, for now we just add
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-12">
          <Link href="/">Home</Link>
          <ChevronRight size={10} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] bg-zinc-900 overflow-hidden relative"
            >
              <img 
                src={product.image_url || ''} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-zinc-900 border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={product.image_url || ''} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="border-b border-white/5 pb-8 mb-8 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex text-accent-pink">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">(12 Reviews)</span>
              </div>

              <p className="text-2xl font-light">₹{product.price}</p>
            </div>

            <div className="space-y-8 flex-1 text-zinc-400 font-light leading-relaxed tracking-wide">
              <p>{product.description}</p>
              
              <ul className="space-y-3 text-xs uppercase tracking-widest text-white">
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink"></span>
                  <span>Premium Ingredients</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink"></span>
                  <span>Cruelty-Free & Vegan</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink"></span>
                  <span>Expert Recommendation</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-12 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/10 h-14">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Shopping Bag</span>
                </button>
                <button className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Heart size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 pt-6">
                <span>SKU: WRB-{product.id.padStart(4, '0')}</span>
                <button className="flex items-center space-x-2">
                  <Share2 size={12} />
                  <span>Share Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
