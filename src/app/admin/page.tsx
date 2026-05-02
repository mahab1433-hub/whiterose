'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ShoppingBag, Package, TrendingUp, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

const AdminOverview = () => {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Orders for revenue and count
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Calculate Revenue (only from successful/processing orders)
      const validOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending');
      const totalRevenue = validOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Fetch Products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Fetch Users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      if (usersError) throw usersError;

      setMetrics({
        revenue: totalRevenue,
        orders: orders.length,
        products: productsCount || 0,
        users: usersCount || 0,
      });

      // Set Recent Orders (Top 5)
      setRecentOrders(orders.slice(0, 5));

    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: 'Total Revenue', value: `₹${metrics.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { name: 'Total Orders', value: metrics.orders.toString(), icon: ShoppingBag, color: 'text-blue-500' },
    { name: 'Total Products', value: metrics.products.toString(), icon: Package, color: 'text-purple-500' },
    { name: 'Total Users', value: metrics.users.toString(), icon: Users, color: 'text-pink-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Real-time metrics for White Rose Beauty Parlour Cosmetics & Tattoo Studio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-black border border-white/5 p-8 rounded-sm space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-pink/10 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="p-3 bg-white/5 rounded-sm">
                    <Icon size={20} className="text-accent-pink" />
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">{stat.name}</p>
                  <p className={`text-2xl font-serif tracking-widest uppercase ${loading ? 'animate-pulse text-transparent bg-white/10 rounded w-1/2 h-8' : ''}`}>
                    {loading ? '' : stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-6 pt-8">
          <h2 className="text-xl font-serif uppercase tracking-widest border-b border-white/5 pb-4">Recent Orders</h2>
          <div className="overflow-x-auto border border-white/5 bg-black">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-950">
                  <th className="p-6 font-normal">Order ID</th>
                  <th className="p-6 font-normal">Customer</th>
                  <th className="p-6 font-normal">Status</th>
                  <th className="p-6 font-normal">Amount</th>
                  <th className="p-6 font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="text-[10px] uppercase tracking-[0.2em]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500 animate-pulse">Loading recent orders...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-6 text-zinc-400 font-mono" title={order.id}>#{order.id.split('-')[0]}</td>
                      <td className="p-6">{order.shipping_address?.name || 'Unknown'}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 border rounded-sm text-[9px] ${
                          order.status === 'delivered' ? 'border-green-500/20 text-green-400 bg-green-500/10' : 
                          order.status === 'cancelled' ? 'border-red-500/20 text-red-400 bg-red-500/10' : 
                          order.status === 'processing' ? 'border-blue-500/20 text-blue-400 bg-blue-500/10' : 
                          'border-yellow-500/20 text-yellow-400 bg-yellow-500/10'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6 font-mono text-[11px]">₹{order.total_amount}</td>
                      <td className="p-6 text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
