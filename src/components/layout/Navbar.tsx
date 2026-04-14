'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2 glass-panel' : 'py-4 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group relative cursor-pointer z-50">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-[1.5px] border-white/40 group-hover:border-white transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {/* Note: The invert(1) filter makes the black text/logo white, and the white background black to blend perfectly with the dark theme! */}
              <img
                src="/logo.png"
                alt="White Rose Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
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
          </nav>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-zinc-400 hover:text-accent-pink transition-colors">
              <User size={18} />
            </Link>

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
                className="text-sm uppercase tracking-[0.3em] text-accent-pink flex items-center justify-center space-x-2"
              >
                <span>Account</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
