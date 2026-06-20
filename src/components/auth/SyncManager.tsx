'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart, useWishlist } from '@/lib/store';
import { usePathname } from 'next/navigation';

export default function SyncManager() {
  const { items, setItems } = useCart();
  const { wishlistIds, setWishlist } = useWishlist();
  const pathname = usePathname();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (pathname === '/login' || pathname === '/update-password') return;

    const syncData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        isInitializedRef.current = true;
        return;
      }

      try {
        // 1. Sync & merge wishlist and cart IDs
        const currentLocalCart = useCart.getState().items;
        const currentLocalWishlist = useWishlist.getState().wishlistIds;

        const syncRes = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
            email: session.user.email,
            phone: session.user.phone || null,
            role: session.user.user_metadata?.role || 'user',
            localCart: currentLocalCart.map(i => ({ id: i.id, quantity: i.quantity })),
            localWishlist: currentLocalWishlist
          })
        });

        if (syncRes.ok) {
          const data = await syncRes.json();
          if (data.wishlist) {
            setWishlist(data.wishlist);
          }
          
          // 2. Fetch fully populated cart items from server
          const cartRes = await fetch('/api/user/cart');
          if (cartRes.ok) {
            const serverCart = await cartRes.json();
            setItems(serverCart);
          }
        }
      } catch (err) {
        console.error('Error in syncData:', err);
      } finally {
        isInitializedRef.current = true;
      }
    };

    syncData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        isInitializedRef.current = false;
        syncData();
      } else if (event === 'SIGNED_OUT') {
        isInitializedRef.current = false;
        setItems([]);
        setWishlist([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [setItems, setWishlist]);

  // Sync local cart changes to DB
  useEffect(() => {
    if (pathname === '/login' || pathname === '/update-password') return;
    if (!isInitializedRef.current) return;

    const updateDbCart = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        await fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({ id: item.id, quantity: item.quantity }))
          })
        });
      } catch (err) {
        console.error('Error in updateDbCart:', err);
      }
    };

    updateDbCart();
  }, [items, pathname]);

  return null;
}
