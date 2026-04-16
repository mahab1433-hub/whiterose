'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = React.useMemo(() => [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop", // Professional Studio
    "https://images.unsplash.com/photo-1512496015851-a1cbfd3167ce?q=80&w=1600&auto=format&fit=crop", // Luxury Interior
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1600&auto=format&fit=crop", // Skincare Art
    "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?q=80&w=1600&auto=format&fit=crop"  // Professional Treatments
  ], []);

  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen sm:h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Spectacular Background Image Slideshow - Consistent Black & White Theme */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale brightness-[0.35] contrast-125"
            style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center h-full pt-10 sm:pt-20 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >

          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-8xl lg:text-9xl font-serif text-white uppercase leading-[0.9] tracking-tight drop-shadow-2xl"
          >
            White Rose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Beauty Parlour
            </span>
            <span className="block text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] sm:tracking-[0.4em] text-zinc-400 mt-6 md:mt-10 font-sans">
              Cosmetics & Tattoo Studio
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="max-w-xl mx-auto text-xs sm:text-base text-zinc-300 font-light leading-relaxed tracking-wider mt-8 px-4"
          >
            Experience the harmony of premium skincare, professional makeup, and world-class tattoo artistry in a sanctuary of luxury.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 relative z-20 w-full px-6"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-white !text-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] relative group overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 !text-black group-hover:text-black transition-colors duration-500">Shop Collection</span>
            </Link>
            
            <Link
              href="/services"
              className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white transition-all duration-500 bg-black/30 backdrop-blur-sm text-center"
            >
              Our Services
            </Link>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex space-x-3 mt-12 sm:mt-16">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  currentImageIndex === index ? 'bg-white w-8' : 'bg-white/20'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

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
            <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

