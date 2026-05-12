'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart, useWishlist } from '@/lib/store';
import { usePathname } from 'next/navigation';

export default function SyncManager() {
  const { items, setItems } = useCart();
  const { wishlistIds, setWishlist } = useWishlist();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login' || pathname === '/update-password') return;

    const syncData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // 1. Sync Wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);
      
      if (wishlistData) {
        setWishlist(wishlistData.map(w => w.product_id));
      }

      // 2. Sync Cart
      // Fetch server cart
      const { data: serverCart } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', userId);

      if (serverCart && serverCart.length > 0) {
        const cartItems = serverCart.map(item => ({
          ...item.products,
          quantity: item.quantity
        }));
        setItems(cartItems);
      } else if (items.length > 0) {
        // If server cart is empty but local cart has items, upload them
        for (const item of items) {
          await supabase.from('cart_items').upsert({
            user_id: userId,
            product_id: item.id,
            quantity: item.quantity
          }, { onConflict: 'user_id,product_id' });
        }
      }
    };

    syncData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        syncData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setItems, setWishlist]);

  // Sync local cart changes to DB
  useEffect(() => {
    if (pathname === '/login' || pathname === '/update-password') return;

    const updateDbCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Simple sync: clear and re-upload or upsert
      // For efficiency, we just upsert the current items
      for (const item of items) {
        await supabase.from('cart_items').upsert({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity
        }, { onConflict: 'user_id,product_id' });
      }
    };

    updateDbCart();
  }, [items, pathname]);

  return null;
}
