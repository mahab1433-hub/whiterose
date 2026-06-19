import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, email, phone, role, localCart, localWishlist } = await request.json();

    const db = await openUserDb(user.id);

    // 1. Sync / Save Profile
    const existingProfile = await db.get('SELECT 1 FROM profiles WHERE id = ?', user.id);
    const finalRole = isUserAdmin(user.email) ? 'admin' : (role || 'user');
    
    if (existingProfile) {
      await db.run(
        'UPDATE profiles SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?',
        [fullName, email, phone || null, finalRole, user.id]
      );
    } else {
      await db.run(
        'INSERT INTO profiles (id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)',
        [user.id, fullName, email, phone || null, finalRole]
      );
    }

    // 2. Sync Wishlist
    // Get existing wishlist items from DB
    const dbWishlist = await db.all('SELECT product_id FROM wishlist');
    const dbWishlistIds = dbWishlist.map((w: any) => w.product_id);

    // Add any missing local wishlist items to DB
    if (Array.isArray(localWishlist)) {
      for (const prodId of localWishlist) {
        if (!dbWishlistIds.includes(prodId)) {
          await db.run(
            'INSERT INTO wishlist (product_id) VALUES (?) ON CONFLICT(product_id) DO NOTHING',
            [prodId]
          );
        }
      }
    }

    // Get final synced wishlist
    const finalWishlist = (await db.all('SELECT product_id FROM wishlist')).map((w: any) => w.product_id);

    // 3. Sync Cart
    // Get existing cart items from DB
    const dbCart = await db.all('SELECT product_id, quantity FROM cart_items');
    
    if (Array.isArray(localCart)) {
      for (const item of localCart) {
        const dbItem = dbCart.find((c: any) => c.product_id === item.id);
        if (dbItem) {
          // If exists in both, use the max or sum. Let's use max for safety/logical sense
          const newQty = Math.max(dbItem.quantity, item.quantity);
          await db.run(
            'UPDATE cart_items SET quantity = ? WHERE product_id = ?',
            [newQty, item.id]
          );
        } else {
          await db.run(
            'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?) ON CONFLICT(product_id) DO NOTHING',
            [item.id, item.quantity]
          );
        }
      }
    }

    // Get final synced cart items
    const finalCartItems = await db.all('SELECT product_id, quantity FROM cart_items');

    await db.close();

    return NextResponse.json({
      success: true,
      wishlist: finalWishlist,
      cart: finalCartItems
    });
  } catch (error: any) {
    console.error('Error syncing user data:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
