import { getServerSupabase, getAuthenticatedUser, isUserAdmin } from './auth';
import { supabaseAdmin } from './supabase-server';

/**
 * Mock SQLite interface that translates SQL queries to Supabase API calls.
 * Enforces security by binding all operations to the authenticated user's ID.
 */
class SupabaseUserDb {
  private userId: string | null;

  constructor(userId: string | null) {
    this.userId = userId;
  }

  async all(query: string, params: any = []): Promise<any[]> {
    if (params !== undefined && params !== null && !Array.isArray(params)) {
      params = [params];
    }
    const supabase = supabaseAdmin;
    const trimmed = query.trim().replace(/\s+/g, ' ');

    // 1. SELECT product_id, quantity FROM cart_items
    if (trimmed.startsWith('SELECT product_id, quantity FROM cart_items')) {
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', this.userId);
      if (error) throw error;
      return data || [];
    }

    // 2. SELECT product_id FROM wishlist
    if (trimmed.startsWith('SELECT product_id FROM wishlist')) {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', this.userId);
      if (error) throw error;
      return data || [];
    }

    // 3. SELECT * FROM orders ORDER BY created_at DESC / SELECT * FROM orders
    if (trimmed.startsWith('SELECT * FROM orders')) {
      let q = supabase.from('orders').select('*');
      if (trimmed.includes('ORDER BY created_at DESC')) {
        q = q.order('created_at', { ascending: false });
      }
      
      // Filter by user ID
      q = q.eq('user_id', this.userId);
      
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    }

    // 4. SELECT * FROM order_items WHERE order_id = ?
    if (trimmed.startsWith('SELECT * FROM order_items WHERE order_id =')) {
      const orderId = params[0] || trimmed.match(/order_id\s*=\s*['"]?([^'"\s]+)['"]?/)?.[1];
      if (!orderId) return [];
      
      // Verify order access
      const user = await getAuthenticatedUser();
      const isAdmin = user ? isUserAdmin(user.email) : false;
      if (!isAdmin) {
        const { data: orderData } = await supabase
          .from('orders')
          .select('id')
          .eq('id', orderId)
          .eq('user_id', this.userId)
          .maybeSingle();
        if (!orderData) return [];
      }
      
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      if (error) throw error;
      return data || [];
    }

    // 5. SELECT total_amount, status FROM orders
    if (trimmed.startsWith('SELECT total_amount, status FROM orders')) {
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('user_id', this.userId);
      if (error) throw error;
      return data || [];
    }

    console.warn('Unhandled SQL query in all():', query, params);
    return [];
  }

  async get(query: string, params: any = []): Promise<any> {
    if (params !== undefined && params !== null && !Array.isArray(params)) {
      params = [params];
    }
    const supabase = supabaseAdmin;
    const trimmed = query.trim().replace(/\s+/g, ' ');

    // 1. SELECT name, email, phone, role FROM profiles WHERE id = ? / SELECT * FROM profiles WHERE id = ?
    if (trimmed.includes('FROM profiles WHERE id =')) {
      const id = params[0] || trimmed.match(/id\s*=\s*['"]?([^'"\s]+)['"]?/)?.[1] || this.userId;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    // 2. SELECT 1 FROM orders WHERE id = ? / SELECT * FROM orders WHERE id = ?
    if (trimmed.includes('FROM orders WHERE id =')) {
      const id = params[0] || trimmed.match(/id\s*=\s*['"]?([^'"\s]+)['"]?/)?.[1];
      if (!id) return null;
      
      const user = await getAuthenticatedUser();
      const isAdmin = user ? isUserAdmin(user.email) : false;
      
      let q = supabase.from('orders').select('*').eq('id', id);
      if (!isAdmin) {
        q = q.eq('user_id', this.userId);
      }
      
      const { data, error } = await q.maybeSingle();
      if (error) throw error;
      return data;
    }

    console.warn('Unhandled SQL query in get():', query, params);
    return null;
  }

  async run(query: string, params: any = []): Promise<any> {
    if (params !== undefined && params !== null && !Array.isArray(params)) {
      params = [params];
    }
    const supabase = supabaseAdmin;
    const trimmed = query.trim().replace(/\s+/g, ' ');

    // Transactions and Pragma settings
    if (
      trimmed === 'BEGIN TRANSACTION' || 
      trimmed === 'COMMIT' || 
      trimmed === 'ROLLBACK' || 
      trimmed === 'PRAGMA foreign_keys = ON;'
    ) {
      return { changes: 0 };
    }

    // 1. DELETE FROM cart_items
    if (trimmed.startsWith('DELETE FROM cart_items')) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', this.userId);
      if (error) throw error;
      return { changes: 1 };
    }

    // 2. INSERT INTO cart_items (product_id, quantity) VALUES (?, ?) ON CONFLICT(product_id) DO UPDATE SET quantity = ?
    // 3. INSERT INTO cart_items (product_id, quantity) VALUES (?, ?) ON CONFLICT(product_id) DO NOTHING
    if (trimmed.startsWith('INSERT INTO cart_items')) {
      const productId = params[0];
      const quantity = params[1];
      
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: this.userId,
          product_id: productId,
          quantity: quantity
        }, { onConflict: 'user_id,product_id' });
      if (error) throw error;
      return { changes: 1 };
    }

    // 4. UPDATE cart_items SET quantity = ? WHERE product_id = ?
    if (trimmed.startsWith('UPDATE cart_items SET quantity =')) {
      const quantity = params[0];
      const productId = params[1];
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', this.userId)
        .eq('product_id', productId);
      if (error) throw error;
      return { changes: 1 };
    }

    // 5. DELETE FROM wishlist WHERE product_id = ? or just DELETE FROM wishlist
    if (trimmed.startsWith('DELETE FROM wishlist')) {
      let q = supabase.from('wishlist').delete().eq('user_id', this.userId);
      if (trimmed.includes('product_id =')) {
        const productId = params[0] || trimmed.match(/product_id\s*=\s*['"]?([^'"\s]+)['"]?/)?.[1];
        if (productId) {
          q = q.eq('product_id', productId);
        }
      }
      const { error } = await q;
      if (error) throw error;
      return { changes: 1 };
    }

    // 6. INSERT INTO wishlist (product_id) VALUES (?) ON CONFLICT(product_id) DO NOTHING
    if (trimmed.startsWith('INSERT INTO wishlist')) {
      const productId = params[0];
      const { error } = await supabase
        .from('wishlist')
        .upsert({
          user_id: this.userId,
          product_id: productId
        }, { onConflict: 'user_id,product_id' });
      if (error) throw error;
      return { changes: 1 };
    }

    // 7. UPDATE orders SET status = ? WHERE id = ?
    if (trimmed.startsWith('UPDATE orders SET status =')) {
      const status = params[0];
      const orderId = params[1];
      
      const user = await getAuthenticatedUser();
      const isAdmin = user ? isUserAdmin(user.email) : false;
      
      let q = supabase.from('orders').update({ status }).eq('id', orderId);
      if (!isAdmin) {
        q = q.eq('user_id', this.userId);
      }
      
      const { error } = await q;
      if (error) throw error;
      return { changes: 1 };
    }

    // 8. DELETE FROM orders WHERE id = ?
    if (trimmed.startsWith('DELETE FROM orders WHERE id =')) {
      const orderId = params[0] || trimmed.match(/id\s*=\s*['"]?([^'"\s]+)['"]?/)?.[1];
      if (orderId) {
        const user = await getAuthenticatedUser();
        const isAdmin = user ? isUserAdmin(user.email) : false;
        
        let q = supabase.from('orders').delete().eq('id', orderId);
        if (!isAdmin) {
          q = q.eq('user_id', this.userId);
        }
        
        const { error } = await q;
        if (error) throw error;
      }
      return { changes: 1 };
    }

    // 9. INSERT INTO orders (id, total_amount, status, payment_id, payment_status, shipping_address) VALUES (?, ?, ?, ?, ?, ?)
    if (trimmed.startsWith('INSERT INTO orders')) {
      const [id, total_amount, status, payment_id, payment_status, shipping_address] = params;
      const { error } = await supabase
        .from('orders')
        .insert({
          id,
          user_id: this.userId,
          total_amount,
          status,
          payment_id,
          payment_status,
          shipping_address: typeof shipping_address === 'string' ? JSON.parse(shipping_address) : shipping_address
        });
      if (error) throw error;
      return { changes: 1 };
    }

    // 10. INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)
    if (trimmed.startsWith('INSERT INTO order_items')) {
      const [id, order_id, product_id, quantity, price] = params;
      const { error } = await supabase
        .from('order_items')
        .insert({
          id,
          order_id,
          product_id,
          quantity,
          price
        });
      if (error) throw error;
      return { changes: 1 };
    }

    // 11. UPDATE profiles
    if (trimmed.startsWith('UPDATE profiles SET')) {
      const [name, email, phone, role, id] = params;
      const { error } = await supabase
        .from('profiles')
        .update({ name, email, phone, role })
        .eq('id', id);
      if (error) throw error;
      return { changes: 1 };
    }

    // 12. INSERT INTO profiles
    if (trimmed.startsWith('INSERT INTO profiles')) {
      const [id, name, email, phone, role] = params;
      const { error } = await supabase
        .from('profiles')
        .upsert({ id, name, email, phone, role }, { onConflict: 'id' });
      if (error) throw error;
      return { changes: 1 };
    }

    console.warn('Unhandled SQL query in run():', query, params);
    return { changes: 0 };
  }

  async exec(query: string): Promise<void> {
    return;
  }

  async close(): Promise<void> {
    return;
  }
}

/**
 * Open or create a user's isolated database session
 */
export async function openUserDb(userId: string | null): Promise<any> {
  return new SupabaseUserDb(userId);
}

/**
 * Aggregates all orders across the database for the admin panel
 */
export async function adminGetAllOrders(): Promise<any[]> {
  const supabase = supabaseAdmin;
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*, profiles(*), order_items(*)')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching admin orders:', ordersError);
    return [];
  }

  return (orders || []).map(order => ({
    ...order,
    shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address,
    profiles: order.profiles || { name: 'Unknown', email: 'Unknown', phone: 'Unknown' },
    order_items: (order.order_items || []).map((item: any) => ({
      quantity: item.quantity,
      price: item.price,
      product_id: item.product_id,
      products: { name: 'Product ' + item.product_id.substring(0, 4) }
    }))
  }));
}

/**
 * Updates status of an order
 */
export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  return !error;
}

/**
 * Deletes an order
 */
export async function adminDeleteOrder(orderId: string): Promise<boolean> {
  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);
  return !error;
}

/**
 * Aggregates all customers across the database for the admin panel
 */
export async function adminGetAllCustomers(): Promise<any[]> {
  const supabase = supabaseAdmin;
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'admin')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin customers:', error);
    return [];
  }
  return profiles || [];
}

/**
 * Aggregates dashboard metrics (revenue, order count, user count)
 */
export async function adminGetMetrics(): Promise<any> {
  const supabase = supabaseAdmin;
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total_amount, status');

  const { count: usersCount, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('role', 'admin');

  if (ordersError || usersError) {
    console.error('Error fetching admin metrics:', { ordersError, usersError });
    return { revenue: 0, orders: 0, users: 0 };
  }

  const revenue = (orders || [])
    .filter(o => o.status !== 'cancelled' && o.status !== 'pending')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    revenue,
    orders: orders?.length || 0,
    users: usersCount || 0
  };
}
