import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await openUserDb(user.id);
    const wishlistItems = await db.all('SELECT product_id FROM wishlist');
    await db.close();

    return NextResponse.json(wishlistItems.map(item => item.product_id));
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, action } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const db = await openUserDb(user.id);
    
    if (action === 'add') {
      await db.run(
        'INSERT INTO wishlist (product_id) VALUES (?) ON CONFLICT(product_id) DO NOTHING',
        [productId]
      );
    } else if (action === 'remove') {
      await db.run('DELETE FROM wishlist WHERE product_id = ?', [productId]);
    } else {
      // Toggle
      const exists = await db.get('SELECT 1 FROM wishlist WHERE product_id = ?', [productId]);
      if (exists) {
        await db.run('DELETE FROM wishlist WHERE product_id = ?', [productId]);
      } else {
        await db.run('INSERT INTO wishlist (product_id) VALUES (?)', [productId]);
      }
    }

    await db.close();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
