'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ShoppingBag, Package, TrendingUp, Users } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { name: 'Total Revenue', value: '₹1,24,500', icon: TrendingUp, change: '+12.5%', color: 'text-green-500' },
    { name: 'Orders', value: '156', icon: ShoppingBag, change: '+5.2%', color: 'text-blue-500' },
    { name: 'Products', value: '42', icon: Package, change: '0%', color: 'text-purple-500' },
    { name: 'Active Users', value: '890', icon: Users, change: '+18.7%', color: 'text-pink-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Real-time metrics for White Rose Beauty</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-black border border-white/5 p-8 rounded-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/5 rounded-sm">
                    <Icon size={20} className="text-accent-pink" />
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest ${stat.color}`}>{stat.change}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">{stat.name}</p>
                  <p className="text-2xl font-serif tracking-widest uppercase">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-6 pt-8">
          <h2 className="text-xl font-serif uppercase tracking-widest border-b border-white/5 pb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="py-4 font-normal">Order ID</th>
                  <th className="py-4 font-normal">Customer</th>
                  <th className="py-4 font-normal">Status</th>
                  <th className="py-4 font-normal">Amount</th>
                  <th className="py-4 font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="text-[10px] uppercase tracking-[0.2em]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="py-6 text-zinc-400">#WRB-100{i}</td>
                    <td className="py-6">Maya Sharma</td>
                    <td className="py-6">
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full">Processing</span>
                    </td>
                    <td className="py-6">₹1,250</td>
                    <td className="py-6 text-zinc-500">April 13, 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
