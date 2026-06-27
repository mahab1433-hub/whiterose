'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Minus, HelpCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Local deliveries in Rajapalayam are usually completed within 24-48 hours."
      },
      {
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Yes, we offer Cash on Delivery (COD) as a payment option for most pin codes. You can verify eligibility at the checkout stage."
      },
      {
        question: "How can I track my order?",
        answer: "Once shipped, you'll receive a tracking link via email. You can also monitor your order status in real-time through your Account Dashboard."
      }
    ]
  },
  {
    category: "Products & Services",
    items: [
      {
        question: "Are your products cruelty-free?",
        answer: "Ethical beauty is our priority. Most of our products are cruelty-free and dermatologically tested. Specific details are available on each product page."
      },
      {
        question: "How do I book a tattoo appointment?",
        answer: "Tattoo consultations and bookings can be made by visiting our Rajapalayam studio or via WhatsApp. Our artists recommend booking at least 3 days in advance."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer: "We accept returns for unused, sealed items within 7 days. For hygiene reasons, opened beauty products cannot be returned unless defective."
      },
      {
        question: "How long do refunds take?",
        answer: "Once approved, refunds are typically processed within 5-7 business days back to your original payment method."
      }
    ]
  }
];

export default function FAQs() {
  const [activeItem, setActiveItem] = useState<string | null>("Orders & Shipping-0");

  const toggleFaq = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-pink/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/4" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Header Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] uppercase tracking-[0.5em] text-accent-pink font-bold"
              >
                Help Center
              </motion.h2>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-serif uppercase leading-tight tracking-tight"
              >
                Common <br />Questions
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-sm leading-relaxed max-w-sm"
            >
              Everything you need to know about our products, shipping, and studio services. Can't find what you're looking for? Reach out to us.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 gap-4 pt-8"
            >
              <div className="p-6 bg-zinc-950 border border-white/5 space-y-3 group hover:border-accent-pink/30 transition-colors">
                <HelpCircle className="text-accent-pink" size={24} />
                <h3 className="text-xs uppercase tracking-widest font-bold">24/7 Support</h3>
                <p className="text-[11px] text-zinc-500">We aim to respond to all inquiries within 2 hours.</p>
              </div>
            </motion.div>
          </div>

          {/* Accordion Section */}
          <div className="lg:col-span-7 space-y-12">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold border-l-2 border-accent-pink pl-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => {
                    const id = `${category.category}-${itemIndex}`;
                    const isOpen = activeItem === id;
                    
                    return (
                      <motion.div 
                        key={itemIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * itemIndex }}
                        className={`group border ${isOpen ? 'border-accent-pink/20 bg-zinc-950' : 'border-white/5 bg-transparent'} transition-all duration-500`}
                      >
                        <button
                          onClick={() => toggleFaq(id)}
                          className="w-full px-6 py-6 flex justify-between items-center text-left focus:outline-none"
                        >
                          <span className={`text-sm md:text-base font-medium tracking-wide transition-colors ${isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {item.question}
                          </span>
                          <div className={`flex-shrink-0 ml-4 transition-transform duration-500 ${isOpen ? 'rotate-180 text-accent-pink' : 'text-zinc-600'}`}>
                            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            >
                              <div className="px-6 pb-8 text-sm text-zinc-400 leading-relaxed font-light">
                                <div className="pt-2 border-t border-white/5 mt-0">
                                  {item.answer}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 bg-gradient-to-br from-zinc-900 to-black border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageSquare size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-serif text-3xl uppercase tracking-wider">Still confused?</h3>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Our beauty experts are just a message away.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+919786030663"
                className="flex items-center space-x-3 px-8 py-4 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                <Phone size={14} />
                <span>Call Us</span>
              </a>
              <a 
                href="https://wa.me/917708504700"
                target="_blank"
                className="flex items-center space-x-3 px-8 py-4 bg-accent-pink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                <MessageSquare size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
