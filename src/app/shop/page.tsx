'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/lib/supabase';
import { Product } from '@/types';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Makeup', 'Skincare', 'Hair Care', 'Others'];

const ShopContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // newest
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  if (loading) {
    return <div className="pt-40 text-center uppercase tracking-widest opacity-30">Loading Collection...</div>;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Collection</h2>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest">Shop All</h1>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border-y border-white/5 py-8">
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-[0.2em] transition-all pb-1 border-b ${
                  selectedCategory === cat ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pl-8 py-2 text-white text-[10px] tracking-widest focus:outline-none focus:border-accent-pink transition-colors"
            />
          </div>

          <div className="flex items-center justify-between w-full lg:w-auto space-x-6">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 text-[10px] uppercase tracking-widest"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mb-8 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 py-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`px-6 py-2 border text-[10px] uppercase tracking-widest transition-all ${
                      selectedCategory === cat ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">No products found matching your criteria.</p>
              <button 
                onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                className="text-accent-pink uppercase tracking-widest text-[10px] border-b border-accent-pink"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div className="pt-40 text-center uppercase tracking-widest opacity-30">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopPage;
