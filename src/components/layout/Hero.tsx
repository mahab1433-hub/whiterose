'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Spectacular Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512496015851-a1cbfd3167ce?q=80&w=2670&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center h-full pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.8em] text-accent-pink font-sans font-medium mb-6 md:mb-8"
          >
            The Art of Elegance
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-white uppercase leading-[0.9] tracking-tight drop-shadow-2xl"
          >
            White Rose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-pink to-gold drop-shadow-[0_0_15px_rgba(223,167,180,0.5)]">
              Beauty
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-light leading-relaxed tracking-wider mt-8"
          >
            Experience the harmony of premium skincare, professional makeup, and world-class tattoo artistry in a sanctuary of luxury.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 relative z-20"
          >
            <Link
              href="/shop"
              className="px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-pink to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-black group-hover:text-black transition-colors duration-500">Shop Collection</span>
            </Link>
            
            <Link
              href="/#services"
              className="px-12 py-5 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-accent-pink transition-all duration-500 bg-black/30 backdrop-blur-sm"
            >
              Our Services
            </Link>
          </motion.div>

          {/* Scroll Indicator (Flow) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 15, 0] }}
            transition={{ 
              opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="flex flex-col items-center space-y-3 mt-8 lg:mt-12"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-accent-pink">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent-pink to-transparent"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

