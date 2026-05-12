'use client';

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', wishlistIds);

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="pt-40 text-center uppercase tracking-[0.4em] opacity-30 animate-pulse">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-12 space-y-4">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Saved Items</h2>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest">My Wishlist</h1>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center space-y-8 border border-white/5 bg-zinc-950/30 rounded-sm"
          >
            <div className="flex justify-center">
              <Heart size={48} className="text-zinc-800" />
            </div>
            <div className="space-y-2">
              <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">Your wishlist is empty</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Save your favorite beauty essentials here.</p>
            </div>
            <Link 
              href="/shop" 
              className="inline-flex items-center space-x-3 bg-white !text-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-colors"
            >
              <span className="!text-black">Explore Shop</span>
              <ArrowRight size={14} className="!text-black" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
