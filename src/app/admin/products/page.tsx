'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { getProducts } from '@/lib/supabase';
import { Product } from '@/types';
import Image from 'next/image';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif uppercase tracking-tight">Products</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Manage your inventory and product details</p>
          </div>
          <button className="px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-all flex items-center space-x-3">
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 border-y border-white/5 py-8">
          <div className="relative flex-1">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, SKU, OR CATEGORY" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pl-8 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-white/10 text-[10px] uppercase tracking-widest flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors">
              <Filter size={14} />
              <span>Category</span>
            </button>
            <button className="px-6 py-2 border border-white/10 text-[10px] uppercase tracking-widest flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors">
              <span>Stock Status</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center uppercase tracking-widest opacity-30 text-[10px]">
              Fetching Live Inventory...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500 font-normal">
                  <th className="py-4 font-normal">Product info</th>
                  <th className="py-4 font-normal">SKU</th>
                  <th className="py-4 font-normal">Category</th>
                  <th className="py-4 font-normal">Price</th>
                  <th className="py-4 font-normal">Stock</th>
                  <th className="py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[10px] uppercase tracking-[0.2em]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-zinc-900 overflow-hidden flex-shrink-0 relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full text-[8px] flex items-center justify-center opacity-30">NO IMG</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-sm tracking-widest text-white group-hover:text-accent-pink transition-colors">{product.name}</p>
                          <p className="text-zinc-600">ID: {product.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-zinc-400">WRB-{product.id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-6">{product.category}</td>
                    <td className="py-6 text-white font-serif">₹{product.price}</td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {product.stock} Units
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end space-x-4 text-zinc-500">
                        <button className="hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="hover:text-white transition-colors">
                          <ExternalLink size={16} />
                        </button>
                        <button className="hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
};

export default AdminProducts;
