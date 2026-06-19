import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'databases');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

/**
 * Open or create a user's isolated SQLite database
 */
export async function openUserDb(userId: string): Promise<Database> {
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  const dbPath = path.join(DB_DIR, `user_${safeUserId}.db`);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON;');

  // Initialize schema if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      product_id TEXT PRIMARY KEY,
      quantity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      product_id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_id TEXT,
      payment_status TEXT DEFAULT 'unpaid',
      shipping_address TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  return db;
}

/**
 * Returns all user database files
 */
function getUserDbFiles(): string[] {
  if (!fs.existsSync(DB_DIR)) return [];
  return fs.readdirSync(DB_DIR)
    .filter(file => file.startsWith('user_') && file.endsWith('.db'));
}

/**
 * Extract userId from a database filename
 */
function getUserIdFromFilename(filename: string): string {
  return filename.replace(/^user_/, '').replace(/\.db$/, '');
}

/**
 * Aggregates all orders across all user databases for the admin panel
 */
export async function adminGetAllOrders(): Promise<any[]> {
  const dbFiles = getUserDbFiles();
  const allOrders: any[] = [];

  for (const file of dbFiles) {
    const userId = getUserIdFromFilename(file);
    try {
      const db = await openUserDb(userId);
      const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
      const profile = await db.get('SELECT name, email, phone, role FROM profiles WHERE id = ?', userId);

      for (const order of orders) {
        const orderItems = await db.all('SELECT * FROM order_items WHERE order_id = ?', order.id);
        
        // Parse shipping address
        let parsedAddress = null;
        if (order.shipping_address) {
          try {
            parsedAddress = JSON.parse(order.shipping_address);
          } catch (e) {
            parsedAddress = order.shipping_address;
          }
        }

        allOrders.push({
          ...order,
          user_id: userId,
          shipping_address: parsedAddress,
          profiles: profile || { name: 'Unknown', email: 'Unknown', phone: 'Unknown' },
          order_items: orderItems.map(item => ({
            quantity: item.quantity,
            price: item.price,
            product_id: item.product_id,
            // products placeholder will be populated dynamically or client-side
            products: { name: 'Product ' + item.product_id.substring(0, 4) }
          }))
        });
      }
      await db.close();
    } catch (err) {
      console.error(`Error reading database file ${file}:`, err);
    }
  }

  // Sort all orders by date descending
  return allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Updates status of an order by searching user databases
 */
export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const dbFiles = getUserDbFiles();
  for (const file of dbFiles) {
    const userId = getUserIdFromFilename(file);
    try {
      const db = await openUserDb(userId);
      const order = await db.get('SELECT 1 FROM orders WHERE id = ?', orderId);
      if (order) {
        await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        await db.close();
        return true;
      }
      await db.close();
    } catch (err) {
      console.error(`Error in adminUpdateOrderStatus for ${file}:`, err);
    }
  }
  return false;
}

/**
 * Deletes an order by searching user databases
 */
export async function adminDeleteOrder(orderId: string): Promise<boolean> {
  const dbFiles = getUserDbFiles();
  for (const file of dbFiles) {
    const userId = getUserIdFromFilename(file);
    try {
      const db = await openUserDb(userId);
      const order = await db.get('SELECT 1 FROM orders WHERE id = ?', orderId);
      if (order) {
        await db.run('DELETE FROM orders WHERE id = ?', [orderId]);
        await db.close();
        return true;
      }
      await db.close();
    } catch (err) {
      console.error(`Error in adminDeleteOrder for ${file}:`, err);
    }
  }
  return false;
}

/**
 * Aggregates all customers across all user databases for the admin panel
 */
export async function adminGetAllCustomers(): Promise<any[]> {
  const dbFiles = getUserDbFiles();
  const allCustomers: any[] = [];

  for (const file of dbFiles) {
    const userId = getUserIdFromFilename(file);
    try {
      const db = await openUserDb(userId);
      const profile = await db.get('SELECT * FROM profiles WHERE id = ?', userId);
      if (profile && profile.role !== 'admin') {
        allCustomers.push(profile);
      }
      await db.close();
    } catch (err) {
      console.error(`Error loading profile from ${file}:`, err);
    }
  }

  return allCustomers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Aggregates dashboard metrics (revenue, order count, user count)
 */
export async function adminGetMetrics(): Promise<any> {
  const dbFiles = getUserDbFiles();
  let revenue = 0;
  let ordersCount = 0;
  let usersCount = 0;

  for (const file of dbFiles) {
    const userId = getUserIdFromFilename(file);
    try {
      const db = await openUserDb(userId);
      const orders = await db.all('SELECT total_amount, status FROM orders');
      const profile = await db.get('SELECT role FROM profiles WHERE id = ?', userId);
      
      ordersCount += orders.length;
      revenue += orders
        .filter(o => o.status !== 'cancelled' && o.status !== 'pending')
        .reduce((sum, o) => sum + o.total_amount, 0);

      if (profile && profile.role !== 'admin') {
        usersCount++;
      }
      
      await db.close();
    } catch (err) {
      console.error(`Error gathering metrics from ${file}:`, err);
    }
  }

  return {
    revenue,
    orders: ordersCount,
    users: usersCount
  };
}
