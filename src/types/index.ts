export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  sku?: string;
  category: string;
  brand?: string | null;
  description?: string | null;
  price: number;
  offerPrice?: number | null;
  stock: number;
  ingredients?: string | null;
  benefits?: string | null;
  usage?: string | null;
  skinType?: string | null;
  weight?: string | null;
  featured?: boolean;
  status?: 'Active' | 'Draft';
  images?: string[];
  image_url?: string | null; // Compatibility fallback
  rating?: number; // Compatibility fallback
  created_at: string;
  updated_at?: string;
  createdAt?: string; // Compatibility camelCase
  updatedAt?: string; // Compatibility camelCase
};

export type Order = {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_id: string | null;
  payment_status: 'unpaid' | 'paid' | 'cod';
  shipping_address: any;
  order_items?: any[];
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};
