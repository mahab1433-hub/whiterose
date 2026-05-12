import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart, useWishlist } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return toast.error('Please login to use wishlist');
    }

    toggleWishlist(product.id);

    if (!isFavorite) {
      const { error } = await supabase
        .from('wishlist')
        .upsert({ user_id: session.user.id, product_id: product.id }, { onConflict: 'user_id,product_id' });
      if (!error) toast.success('Added to wishlist');
    } else {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', product.id);
      if (!error) toast.success('Removed from wishlist');
    }
  };

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="group flex flex-col h-full bg-zinc-950/50 backdrop-blur-sm border border-white/5 hover:border-accent-pink/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(223,167,180,0.15)] hover:-translate-y-2 rounded-sm overflow-hidden"
    >
      <div className="relative aspect-[3/4] w-full bg-zinc-900 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs uppercase tracking-widest font-sans">
            No Image
          </div>
        )}
        
        {/* Luxury gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 z-30 p-2 rounded-full transition-all duration-300 ${
            isFavorite ? 'bg-accent-pink text-black' : 'bg-black/40 text-white hover:bg-white hover:text-black'
          }`}
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10 flex justify-center">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white !text-black py-3 px-4 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest hover:bg-accent-pink transition-colors font-bold rounded-sm"
          >
            <ShoppingBag size={14} className="!text-black" />
            <span className="!text-black">Add to Cart</span>
          </button>
        </div>
      </div>
      
      <div className="pt-6 pb-6 px-4 flex flex-col items-center text-center space-y-2 relative z-20 bg-gradient-to-b from-transparent to-black/40">
        <span className="text-[9px] uppercase tracking-[0.3em] text-accent-pink font-sans">{product.category}</span>
        <h3 className="font-serif text-sm md:text-base uppercase tracking-wider text-zinc-100 group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-zinc-400 text-xs font-sans tracking-widest mt-1">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
