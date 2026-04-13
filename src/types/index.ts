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
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  rating: number;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_id: string | null;
  payment_status: 'unpaid' | 'paid';
  shipping_address: any;
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
