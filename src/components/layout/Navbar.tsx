'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { ShoppingBag, Menu, X, User, ShieldCheck, LogOut, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { totalItems, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const ADMIN_EMAILS = ['mahab1433@gmail.com', 'babutmuthumari@gmail.com', 'gayathrirose1726@gmail.com'];

  useEffect(() => {
    setMounted(true);
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || 'User');
          setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
        }
      } catch (error) {
        console.error('Navbar auth error:', error);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || 'User');
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/#about' },
  ];

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2 glass-panel' : 'py-4 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group relative cursor-pointer z-50">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-all duration-500">
              {/* Note: The invert(1) filter makes the black text/logo white, and the white background black to blend perfectly with the dark theme! */}
              <Image
                src="/logo.png"
                alt="White Rose Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-serif tracking-[0.2em] uppercase font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-zinc-400 group-hover:to-white transition-all duration-500 leading-none">
                White Rose
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-light mt-1 whitespace-nowrap hidden sm:block">
                Beauty Parlour Cosmetics & Tattoo Studio
              </span>
            </div>
          </Link>

          {/* Centered Desktop Nav */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all duration-300 relative group ${pathname === link.href ? 'text-accent-pink' : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-[1px] bg-accent-pink transform origin-left transition-transform duration-300 ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] transition-all duration-300 relative group text-accent-pink font-bold border border-accent-pink/20 px-2 py-0.5 rounded-sm hover:bg-accent-pink hover:text-black`}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className={`flex items-center space-x-2 text-zinc-400 hover:text-accent-pink transition-all duration-300 ${userName ? 'border border-white/10 px-3 py-1.5 rounded-sm hover:border-accent-pink/50' : ''}`}
              >
                <User size={18} />
                {mounted && userName && (
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
                    Hi, {userName.split(' ')[0]}
                  </span>
                )}
              </Link>
              {userName && (
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toast.success('Signed out');
                    router.refresh();
                    router.push('/');
                  }}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

            <Link href="/cart" className="relative text-white hover:text-accent-pink transition-colors">
              <ShoppingBag size={18} />
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-pink text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems()}
                </span>
              )}
            </Link>

            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-zinc-400"
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col space-y-10 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-24 bg-white/20 mx-auto my-4"></div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-[0.3em] text-zinc-400 flex items-center justify-center space-x-2"
              >
                <span>Account</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.3em] text-accent-pink font-bold border border-accent-pink/20 px-4 py-2 rounded-sm flex items-center justify-center space-x-2"
                >
                  <ShieldCheck size={18} />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
