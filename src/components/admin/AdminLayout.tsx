'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black sticky top-0 z-50">
        <div className="font-serif tracking-widest uppercase text-sm flex items-center space-x-2">
          <ShieldCheck className="text-accent-pink" size={20} />
          <span>Admin <span className="text-accent-pink">Panel</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="text-white p-2 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-black flex flex-col transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col h-full md:h-auto">
          {/* Mobile only: Close button inside sidebar */}
          <div className="md:hidden flex justify-end mb-4">
             <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-white">
               <X size={20} />
             </button>
          </div>

          <Link href="/" className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest">Back to Store</span>
          </Link>
          <div className="font-serif tracking-widest uppercase text-xl flex items-center space-x-2">
            <ShieldCheck className="text-accent-pink" size={24} />
            <span>Admin <span className="text-accent-pink">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 md:p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-4 px-4 py-4 rounded-sm transition-all text-[10px] uppercase tracking-[0.2em] ${
                  isActive 
                    ? 'bg-white !text-black font-bold' 
                    : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? '!text-black' : ''} />
                <span className={isActive ? '!text-black' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 md:p-6 border-t border-white/5 mt-auto">
          <button className="flex items-center space-x-4 px-4 py-4 w-full text-zinc-500 hover:text-red-400 transition-colors text-[10px] uppercase tracking-[0.2em]">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
