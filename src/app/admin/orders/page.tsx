'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase';
import { Search, Filter, Download, FileText, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();

    // Real-time subscription
    const channel = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchOrders(); // Re-fetch to get joined data cleanly
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles ( name, phone ),
          order_items (
            quantity,
            price,
            products ( name )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Failed to load orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      // fetchOrders will be called by realtime subscription, but we can update state optimistically
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fake/test order?')) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Order deleted successfully');
      setOrders(orders.filter(o => o.id !== id));
    } catch (error: any) {
      toast.error('Failed to delete order');
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Products', 'Total Amount', 'Payment Method', 'Status'];
    const csvContent = orders.map(o => {
      const address = o.shipping_address ? `${o.shipping_address.address}, ${o.shipping_address.city} - ${o.shipping_address.pincode}` : 'N/A';
      const products = o.order_items?.map((item: any) => `${item.products?.name} (x${item.quantity})`).join('; ') || 'N/A';
      
      return [
        o.id,
        new Date(o.created_at).toLocaleString(),
        `"${o.shipping_address?.name || 'N/A'}"`,
        o.shipping_address?.phone || 'N/A',
        `"${address}"`,
        `"${products}"`,
        o.total_amount,
        o.payment_status === 'cod' ? 'COD' : 'Paid Online',
        o.status
      ].join(',');
    });
    
    const csvStr = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const customerName = (order.shipping_address?.name || '').toLowerCase();
    const customerPhone = (order.shipping_address?.phone || '').toLowerCase();
    
    const matchesSearch = searchTerm === '' || 
      customerName.includes(searchLower) || 
      customerPhone.includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower);
      
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}} />

      <div className="space-y-8 print-area">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-serif uppercase tracking-tight">Order Management</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-2">Manage incoming orders, update status, and export data</p>
          </div>
          <div className="flex gap-4 no-print">
            <button onClick={exportToCSV} className="flex items-center space-x-2 px-4 py-2 border border-white/10 hover:border-accent-pink hover:text-accent-pink transition-colors text-[10px] uppercase tracking-widest">
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 border border-white/10 hover:border-accent-pink hover:text-accent-pink transition-colors text-[10px] uppercase tracking-widest">
              <FileText size={14} />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 no-print bg-zinc-950 p-6 border border-white/5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, PHONE, OR ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent-pink transition-colors"
            />
          </div>
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent-pink transition-colors appearance-none"
            >
              <option value="all">ALL STATUSES</option>
              <option value="pending">PENDING</option>
              <option value="processing">CONFIRMED (PROCESSING)</option>
              <option value="shipped">SHIPPED</option>
              <option value="delivered">DELIVERED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-white/5 bg-zinc-950">
          {loading ? (
            <div className="p-12 text-center text-[10px] uppercase tracking-widest text-zinc-500 animate-pulse">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-[10px] uppercase tracking-widest text-zinc-500">No orders found</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-zinc-500 bg-black">
                  <th className="p-6 font-normal w-32">Order ID</th>
                  <th className="p-6 font-normal">Customer & Email</th>
                  <th className="p-6 font-normal">Products</th>
                  <th className="p-6 font-normal">Total</th>
                  <th className="p-6 font-normal">Payment</th>
                  <th className="p-6 font-normal">Status</th>
                  <th className="p-6 font-normal text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filteredOrders.map((order) => {
                  const isCOD = order.payment_status === 'cod';
                  
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-6 text-zinc-400 font-mono text-[10px] uppercase tracking-wider" title={order.id}>
                        #{order.id.split('-')[0]}
                        <div className="text-[9px] text-zinc-600 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium uppercase tracking-wider text-[10px]">{order.shipping_address?.name || 'Unknown'}</div>
                        <div className="text-[9px] text-zinc-400 mt-1 tracking-wider lowercase">{order.shipping_address?.email}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 tracking-wider">{order.shipping_address?.phone}</div>
                      </td>
                      <td className="p-6">
                        <div className="max-w-xs space-y-1">
                          {order.order_items?.map((item: any, i: number) => (
                            <div key={i} className="text-[10px] uppercase tracking-widest text-zinc-400 truncate">
                              {item.quantity}x {item.products?.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 font-mono text-[11px]">
                        ₹{order.total_amount}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-sm text-[9px] uppercase tracking-widest border ${
                          isCOD ? 'border-orange-500/20 text-orange-400 bg-orange-500/10' : 
                          order.payment_status === 'paid' ? 'border-green-500/20 text-green-400 bg-green-500/10' : 
                          'border-red-500/20 text-red-400 bg-red-500/10'
                        }`}>
                          {isCOD ? 'COD' : order.payment_status}
                        </span>
                      </td>
                      <td className="p-6">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`bg-transparent border-b outline-none text-[10px] uppercase tracking-widest py-1 cursor-pointer
                            ${order.status === 'delivered' ? 'border-green-500 text-green-400' : 
                              order.status === 'cancelled' ? 'border-red-500 text-red-400' : 
                              order.status === 'processing' ? 'border-blue-500 text-blue-400' : 
                              'border-yellow-500 text-yellow-400'}`}
                        >
                          <option value="pending" className="bg-zinc-900 text-white">PENDING</option>
                          <option value="processing" className="bg-zinc-900 text-white">CONFIRMED</option>
                          <option value="shipped" className="bg-zinc-900 text-white">SHIPPED</option>
                          <option value="delivered" className="bg-zinc-900 text-white">DELIVERED</option>
                          <option value="cancelled" className="bg-zinc-900 text-white">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-6 text-right no-print">
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Fake Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
