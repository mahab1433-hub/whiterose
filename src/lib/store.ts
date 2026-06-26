import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  ownerId: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setOwnerId: (ownerId: string | null) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

interface WishlistStore {
  wishlistIds: string[];
  ownerId: string | null;
  setWishlist: (ids: string[]) => void;
  setOwnerId: (ownerId: string | null) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [], ownerId: null }),
      setItems: (items) => set({ items }),
      setOwnerId: (ownerId) => set({ ownerId }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
         get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      ownerId: null,
      setWishlist: (ids) => set({ wishlistIds: ids }),
      setOwnerId: (ownerId) => set({ ownerId }),
      toggleWishlist: (productId) => {
        const ids = get().wishlistIds;
        if (ids.includes(productId)) {
          set({ wishlistIds: ids.filter(id => id !== productId) });
        } else {
          set({ wishlistIds: [...ids, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlistIds.includes(productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
