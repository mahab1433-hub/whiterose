'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase';
import { Search, Mail, Phone, Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    const name = (customer.name || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower);
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-serif uppercase tracking-tight">Customer Management</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-2">View and manage your registered users</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-zinc-950 p-4 md:p-6 border border-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, EMAIL, OR PHONE..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent-pink transition-colors"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto border border-white/5 bg-zinc-950">
          {loading ? (
            <div className="p-12 text-center text-[10px] uppercase tracking-widest text-zinc-500 animate-pulse">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-[10px] uppercase tracking-widest text-zinc-500">No customers found</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-zinc-500 bg-black">
                  <th className="p-4 md:p-6 font-normal">Customer</th>
                  <th className="p-4 md:p-6 font-normal">Contact Information</th>
                  <th className="p-4 md:p-6 font-normal">Joined Date</th>
                  <th className="p-4 md:p-6 font-normal text-right">User ID</th>
                </tr>
              </thead>
              <tbody className="text-[10px] uppercase tracking-[0.1em]">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4 md:p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-widest">{customer.name || 'ANONYMOUS USER'}</div>
                          <div className="text-[9px] text-zinc-500 lowercase tracking-normal mt-1">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 space-y-2">
                      <div className="flex items-center space-x-2 text-zinc-400">
                        <Mail size={12} className="text-accent-pink" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                          <Phone size={12} className="text-accent-pink" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex items-center space-x-2 text-zinc-400">
                        <Calendar size={12} className="text-zinc-600" />
                        <span>{new Date(customer.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-right text-zinc-600 font-mono text-[9px] uppercase">
                      {customer.id.substring(0, 13)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
