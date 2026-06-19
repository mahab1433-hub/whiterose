import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { openUserDb } from '@/lib/user-db';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const db = await openUserDb(user.id);
    const order = await db.get('SELECT * FROM orders WHERE id = ?', id);

    if (!order) {
      await db.close();
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderItems = await db.all('SELECT * FROM order_items WHERE order_id = ?', id);

    // Fetch product details for these items
    const productIds = orderItems.map((item: any) => item.product_id);
    let products: any[] = [];
    if (productIds.length > 0) {
      const { data } = await supabaseServer
        .from('products')
        .select('*')
        .in('id', productIds);
      products = data || [];
    }

    const populatedItems = orderItems.map((item: any) => {
      const product = products.find((p: any) => p.id === item.product_id);
      const imgUrl = product?.image_url || '';
      const imagesList = product?.images || (imgUrl ? [imgUrl] : []);

      return {
        quantity: item.quantity,
        price: item.price,
        product_id: item.product_id,
        products: {
          name: product?.name || 'Unknown Product',
          image_url: imgUrl,
          images: imagesList
        }
      };
    });

    let shippingAddressParsed = null;
    if (order.shipping_address) {
      try {
        shippingAddressParsed = JSON.parse(order.shipping_address);
      } catch (e) {
        shippingAddressParsed = order.shipping_address;
      }
    }

    await db.close();

    return NextResponse.json({
      ...order,
      shipping_address: shippingAddressParsed,
      order_items: populatedItems
    });
  } catch (error: any) {
    console.error('Order detail GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
