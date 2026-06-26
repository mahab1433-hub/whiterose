'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, ExternalLink, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const initialFormState = {
  name: '',
  category: 'Skincare',
  brand: 'White Rose',
  description: '',
  price: '',
  offerPrice: '',
  stock: '10',
  ingredients: '',
  benefits: '',
  usage: '',
  skinType: '',
  weight: '',
  featured: false,
  status: 'Active' as 'Active' | 'Draft',
  images: [] as string[]
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [imageInput, setImageInput] = useState('');

  // Delete State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/products?admin=true', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingProduct(null);
    setFormData(initialFormState);
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || 'White Rose',
      description: product.description || '',
      price: product.price.toString(),
      offerPrice: product.offerPrice ? product.offerPrice.toString() : '',
      stock: product.stock.toString(),
      ingredients: product.ingredients || '',
      benefits: product.benefits || '',
      usage: product.usage || '',
      skinType: product.skinType || '',
      weight: product.weight || '',
      featured: product.featured || false,
      status: product.status || 'Active',
      images: product.images || (product.image_url ? [product.image_url] : [])
    });
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageInput.trim()]
    }));
    setImageInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSave = async (addAnother = false) => {
    if (!formData.name.trim()) return toast.error('Product Name is required');
    if (!formData.price || isNaN(Number(formData.price))) return toast.error('Price must be a valid number');
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) return toast.error('Stock must be a non-negative number');
    
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const url = modalMode === 'add' ? '/api/products' : `/api/products/${editingProduct?.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          ...formData,
          featured: formData.featured,
          price: Number(formData.price),
          offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
          stock: Number(formData.stock)
        })
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save product');
      }

      toast.success(modalMode === 'add' ? 'Product created successfully' : 'Product updated successfully');

      if (modalMode === 'add') {
        setProducts(prev => [responseData, ...prev]);
      } else {
        setProducts(prev => prev.map(p => p.id === responseData.id ? responseData : p));
      }

      if (addAnother && modalMode === 'add') {
        // Keep category and brand, reset rest
        setFormData({
          ...initialFormState,
          category: formData.category,
          brand: formData.brand
        });
        setImageInput('');
      } else {
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err: any) {
      toast.error(err.message || 'Error deleting product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    let matchesStock = true;
    if (selectedStockStatus === 'In Stock') {
      matchesStock = product.stock > 0;
    } else if (selectedStockStatus === 'Out of Stock') {
      matchesStock = product.stock === 0;
    } else if (selectedStockStatus === 'Low Stock') {
      matchesStock = product.stock > 0 && product.stock < 10;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-serif uppercase tracking-tight">Products</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Manage your inventory and product details</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="w-full md:w-auto px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-pink hover:text-black transition-all flex items-center justify-center space-x-3"
          >
            <Plus size={16} />
            <span className="text-black hover:text-black font-bold">Add New Product</span>
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
          <div className="flex flex-wrap gap-4">
            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-black border border-white/10 px-6 py-2 pr-10 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors focus:outline-none focus:border-accent-pink rounded-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Makeup">Makeup</option>
                <option value="Skincare">Skincare</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Others">Others</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Filter size={10} />
              </div>
            </div>
            {/* Stock Select */}
            <div className="relative">
              <select
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
                className="appearance-none bg-black border border-white/10 px-6 py-2 pr-10 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors focus:outline-none focus:border-accent-pink rounded-none cursor-pointer"
              >
                <option value="All">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Low Stock">Low Stock (&lt; 10)</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Filter size={10} />
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto border border-white/5 bg-zinc-950">
          {loading ? (
            <div className="py-20 text-center uppercase tracking-widest opacity-30 text-[10px]">
              Fetching Live Inventory...
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500 bg-black">
                  <th className="p-6 font-normal">Product info</th>
                  <th className="p-6 font-normal">SKU</th>
                  <th className="p-6 font-normal">Category</th>
                  <th className="p-6 font-normal">Price</th>
                  <th className="p-6 font-normal">Stock</th>
                  <th className="p-6 font-normal">Status</th>
                  <th className="p-6 font-normal">Featured</th>
                  <th className="p-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[10px] uppercase tracking-[0.2em]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-zinc-500">No products found matching filters.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-16 bg-zinc-900 overflow-hidden flex-shrink-0 relative border border-white/5">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : product.image_url ? (
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
                      <td className="p-6 text-zinc-400">{product.sku || `WRB-${product.id.substring(0, 8).toUpperCase()}`}</td>
                      <td className="p-6">{product.category}</td>
                      <td className="p-6 text-white font-serif">
                        {product.offerPrice ? (
                          <div className="space-y-1">
                            <span className="line-through text-zinc-500 mr-2">₹{product.price}</span>
                            <span className="text-accent-pink">₹{product.offerPrice}</span>
                          </div>
                        ) : (
                          <span>₹{product.price}</span>
                        )}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-sm border ${product.stock > 10 ? 'bg-green-500/10 text-green-500 border-green-500/20' : product.stock === 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                          {product.stock} Units
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-0.5 border text-[8px] ${product.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-6 text-zinc-400">
                        {product.featured ? (
                          <span className="text-accent-pink">Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end space-x-4 text-zinc-500">
                          <button 
                            onClick={() => handleOpenEditModal(product)}
                            className="hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <a 
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                            title="View Product Page"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button 
                            onClick={() => setDeletingProduct(product)}
                            className="hover:text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-4xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto rounded-none relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-2 border-b border-white/5 pb-4">
                <h2 className="text-xl md:text-2xl font-serif uppercase tracking-wider">
                  {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                </h2>
                <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
                  {modalMode === 'add' ? 'Create a new catalog item' : `Editing SKU: ${editingProduct?.sku || 'WRB-AUTO'}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Product Name *</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                      placeholder="E.G. SILK LIPSTICK"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Category *</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent-pink rounded-none"
                      >
                        <option value="Makeup">Makeup</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Hair Care">Hair Care</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Brand</label>
                      <input 
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="WHITE ROSE"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Product Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink resize-none"
                      placeholder="ENTER DETAILED DESCRIPTION..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500">Ingredients</label>
                    <textarea 
                      value={formData.ingredients}
                      onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                      rows={2}
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink resize-none"
                      placeholder="E.G. AQUA, GLYCERIN, HYALURONIC ACID..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Benefits</label>
                      <input 
                        type="text"
                        value={formData.benefits}
                        onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="E.G. DEEP HYDRATION, BRIGHTENING"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Usage Instructions</label>
                      <input 
                        type="text"
                        value={formData.usage}
                        onChange={(e) => setFormData(prev => ({ ...prev, usage: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="E.G. APPLY TWICE DAILY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Suitable Skin Type</label>
                      <input 
                        type="text"
                        value={formData.skinType}
                        onChange={(e) => setFormData(prev => ({ ...prev, skinType: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="E.G. ALL SKIN TYPES"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Weight / Size</label>
                      <input 
                        type="text"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="E.G. 50G / 1.7 OZ"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Inventory & Images */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">SKU (Auto-Generated)</label>
                      <input 
                        type="text"
                        value={modalMode === 'add' ? 'AUTO-GENERATED ON SAVE' : (editingProduct?.sku || '')}
                        disabled
                        className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-zinc-500 text-xs tracking-wide cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Stock Quantity *</label>
                      <input 
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Price (INR) *</label>
                      <input 
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="999"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Offer Price (Optional)</label>
                      <input 
                        type="text"
                        value={formData.offerPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, offerPrice: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                        placeholder="799"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Draft' }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent-pink rounded-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500">Featured Product</label>
                      <select 
                        value={formData.featured ? 'Yes' : 'No'}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.value === 'Yes' }))}
                        className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent-pink rounded-none"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 block">Product Images (Multiple)</label>
                    
                    {/* Add Image via URL */}
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="PASTE IMAGE URL..."
                        className="flex-1 bg-zinc-900 border border-white/10 px-4 py-2 text-white text-xs tracking-wide focus:outline-none focus:border-accent-pink"
                      />
                      <button 
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 bg-zinc-800 text-white text-[10px] uppercase tracking-widest border border-white/10 hover:bg-zinc-700 transition-colors"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Local File Upload */}
                    <div className="relative border border-dashed border-white/15 p-4 text-center cursor-pointer hover:border-accent-pink transition-colors bg-zinc-900/50">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <Upload size={20} className="text-zinc-500" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400">Drag & Drop or Browse files</span>
                        <span className="text-[8px] text-zinc-600">Supports PNG, JPG, JPEG</span>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="aspect-[3/4] bg-zinc-900 relative group border border-white/10">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 bg-accent-pink text-black text-[6px] uppercase tracking-widest px-1 font-bold">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                {modalMode === 'add' && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave(true)}
                    className="px-8 py-4 bg-zinc-900 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    Save & Add Another
                  </button>
                )}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSave(false)}
                  className="px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-accent-pink hover:text-black transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : modalMode === 'add' ? 'Save Product' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-md p-6 space-y-6 rounded-none text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-serif uppercase tracking-wider text-red-500">Confirm Deletion</h3>
                <p className="text-zinc-400 text-xs font-light">
                  Are you sure you want to delete <span className="text-white font-semibold">"{deletingProduct.name}"</span>? 
                  This action cannot be undone and will remove it from the catalog immediately.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-6 py-3 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 text-white text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
