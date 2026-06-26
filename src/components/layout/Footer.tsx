'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, MessageCircle, Share2, Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="text-xl font-serif tracking-[0.2em] uppercase leading-tight block">
            White Rose <br />
            <span className="text-[9px] text-zinc-500 font-sans tracking-[0.2em] font-light">Beauty Parlour Cosmetics & Tattoo Studio</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Premium beauty care and expert tattoo artistry. We believe in enhancing your natural beauty with a touch of elegance.
          </p>
          <div className="flex space-x-5">
            <Link href="https://www.instagram.com/white_roseparlour?igsh=MWpiYmYwMWk5cm45eQ==" target="_blank" className="hover:text-white transition-colors"><Share2 size={20} /></Link>
            <Link href="https://wa.me/917708504700" target="_blank" className="hover:text-white transition-colors"><MessageCircle size={20} /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/shop?category=Makeup" className="hover:text-white transition-colors">Makeup Kit</Link></li>
            <li><Link href="/shop?category=Skincare" className="hover:text-white transition-colors">Skincare Essentials</Link></li>
            <li><Link href="/shop?category=Hair Care" className="hover:text-white transition-colors">Hair Care</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns-exchanges" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Contact & Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <span>1801, Sevalpatti South Street, Madurai Road, Senthur Pipes Near, Rajapalayam - 626117</span>
            </li>
            <li className="flex items-start space-x-3">
              <Phone size={18} className="text-white mt-1 flex-shrink-0" />
              <div className="flex flex-col space-y-2">
                <span className="text-white font-medium uppercase text-xs tracking-widest">Contacts:</span>
                <Link href="tel:+919786030663" className="hover:text-white transition-colors">+91 97860 30663</Link>
                <Link href="tel:+918825783644" className="hover:text-white transition-colors">+91 88257 83644</Link>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={18} className="text-white mt-1 flex-shrink-0" />
              <Link href="mailto:support.whiterosebeautyparlour@gmail.com" className="hover:text-white transition-colors break-all">support.whiterosebeautyparlour@gmail.com</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest text-gray-500">
        <p>© 2026 White Rose Beauty Parlour Cosmetics & Tattoo Studio. All rights reserved.</p>
        <div className="flex space-x-8">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
