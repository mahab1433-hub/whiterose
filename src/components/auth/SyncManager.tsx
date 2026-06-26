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
      
      const localCartOwner = useCart.getState().ownerId;
      const localWishlistOwner = useWishlist.getState().ownerId;

      if (!session) {
        if (localCartOwner !== null) {
          useCart.getState().clearCart();
        }
        if (localWishlistOwner !== null) {
          useWishlist.getState().setWishlist([]);
          useWishlist.getState().setOwnerId(null);
        }
        isInitializedRef.current = true;
        return;
      }

      try {
        // If local cart belongs to another user, clear it
        if (localCartOwner && localCartOwner !== session.user.id) {
          useCart.getState().clearCart();
        }
        if (localWishlistOwner && localWishlistOwner !== session.user.id) {
          useWishlist.getState().setWishlist([]);
          useWishlist.getState().setOwnerId(null);
        }

        const currentLocalCart = useCart.getState().items;
        const currentLocalWishlist = useWishlist.getState().wishlistIds;

        const syncRes = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
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
            useWishlist.getState().setOwnerId(session.user.id);
          }
          
          // 2. Fetch fully populated cart items from server
          const cartRes = await fetch('/api/user/cart', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (cartRes.ok) {
            const serverCart = await cartRes.json();
            setItems(serverCart);
            useCart.getState().setOwnerId(session.user.id);
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
        useCart.getState().clearCart();
        useWishlist.getState().setWishlist([]);
        useWishlist.getState().setOwnerId(null);
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
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
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
