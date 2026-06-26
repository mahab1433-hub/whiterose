'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/lib/supabase';
import { Product } from '@/types';
import { ShoppingBag, Heart, Share2, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import { useCart } from '@/lib/store';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'usage' | 'benefits'>('details');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 text-center uppercase tracking-[0.2em] opacity-30 min-h-screen">
        Retrieving Product Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <h1 className="text-2xl font-serif uppercase">Product Not Found</h1>
        <p className="text-zinc-500 text-xs mt-4 uppercase tracking-widest">The requested product could not be found or does not exist.</p>
        <button onClick={() => router.back()} className="mt-8 text-white uppercase tracking-widest text-[10px] border-b border-white">
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addItem(product, quantity);
    toast.success(`Proceeding to checkout...`);
    router.push('/checkout');
  };

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || ''];
  const activeImage = imagesList[activeImageIndex] || imagesList[0] || '';

  return (
    <div className="pt-32 pb-36 lg:pb-24 bg-black min-h-screen">
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
              className="aspect-[4/5] bg-zinc-900 overflow-hidden relative border border-white/5"
            >
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs uppercase tracking-widest font-sans">
                  No Image
                </div>
              )}
            </motion.div>
            
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {imagesList.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square bg-zinc-900 border transition-all cursor-pointer overflow-hidden ${
                      activeImageIndex === idx ? 'border-accent-pink opacity-100' : 'border-white/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="border-b border-white/5 pb-8 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">{product.category}</span>
                <span className={`px-2 py-0.5 border text-[8px] uppercase tracking-widest ${
                  product.stock > 0 
                    ? (product.stock < 10 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20') 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {product.stock > 0 
                    ? (product.stock < 10 ? `Only ${product.stock} left` : 'In Stock') 
                    : 'Out of Stock'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex text-accent-pink">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">(12 Reviews)</span>
              </div>

              {product.offerPrice ? (
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-light text-accent-pink">₹{product.offerPrice}</span>
                  <span className="text-lg text-zinc-500 line-through font-light">₹{product.price}</span>
                  <span className="text-[9px] uppercase tracking-widest bg-accent-pink/10 text-accent-pink px-2.5 py-1 font-bold">
                    Save ₹{product.price - product.offerPrice}
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-light">₹{product.price}</p>
              )}
            </div>

            {/* Info Tabs */}
            <div className="flex-1">
              <div className="flex border-b border-white/10 mb-6">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'ingredients', label: 'Ingredients', show: !!product.ingredients },
                  { id: 'usage', label: 'How to Use', show: !!product.usage },
                  { id: 'benefits', label: 'Benefits', show: !!product.benefits || !!product.skinType }
                ].filter(tab => tab.show !== false).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-4 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-accent-pink text-white' 
                        : 'border-transparent text-zinc-500 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-zinc-400 text-xs font-light leading-relaxed tracking-wide min-h-[120px]">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{product.description || 'No description available.'}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[9px] uppercase tracking-widest">
                      {product.brand && (
                        <div>
                          <span className="text-zinc-500 block">Brand</span>
                          <span className="text-white font-medium">{product.brand}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div>
                          <span className="text-zinc-500 block">Size / Weight</span>
                          <span className="text-white font-medium">{product.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <p className="whitespace-pre-line">{product.ingredients}</p>
                )}

                {activeTab === 'usage' && (
                  <p className="whitespace-pre-line">{product.usage}</p>
                )}

                {activeTab === 'benefits' && (
                  <div className="space-y-4">
                    {product.benefits && (
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-1">Key Benefits</span>
                        <p className="whitespace-pre-line text-zinc-400">{product.benefits}</p>
                      </div>
                    )}
                    {product.skinType && (
                      <div className="pt-2">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-1">Suitable Skin Type</span>
                        <p className="text-white font-medium uppercase tracking-wider">{product.skinType}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  {product.stock > 0 && (
                    <div className="flex items-center border border-white/10 h-14">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-white text-black h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-pink hover:text-black transition-all flex items-center justify-center space-x-3 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:border disabled:border-white/5"
                  >
                    <ShoppingBag size={18} />
                    <span>{product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
                  </button>
                  <button className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Heart size={20} />
                  </button>
                </div>

                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full bg-accent-pink text-black h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center space-x-3 font-bold disabled:bg-zinc-950 disabled:text-zinc-700 disabled:cursor-not-allowed disabled:border disabled:border-white/5"
                >
                  <span>{product.stock > 0 ? 'Buy It Now' : 'Out of Stock'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 pt-6 border-t border-white/5">
                <span>SKU: {product.sku || `WRB-${product.id.substring(0, 8).toUpperCase()}`}</span>
                <button className="flex items-center space-x-2">
                  <Share2 size={12} />
                  <span>Share Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-zinc-950/95 backdrop-blur-md border-t border-white/10 p-4 px-6 flex items-center justify-between space-x-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 truncate">{product.category}</span>
          <span className="text-xs font-serif uppercase text-white truncate max-w-[120px]">{product.name}</span>
          <span className="text-xs text-accent-pink mt-0.5 font-sans font-bold">
            ₹{product.offerPrice || product.price}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 max-w-[120px] bg-zinc-900 border border-white/10 text-white h-11 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:border-white/5"
          >
            {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 max-w-[140px] bg-accent-pink text-black h-11 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
