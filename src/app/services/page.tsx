'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Droplet,
  Zap,
  Scissors,
  Hand,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const ServicesPage = () => {
  const serviceCategories = [
    {
      title: "Bridal Services",
      icon: <Heart size={32} />,
      services: [
        "Bridal Makeup",
        "Advanced Facial (Bridal Glow)"
      ],
      description: "Be the most radiant version of yourself on your special day."
    },
    {
      title: "Skin & Facial Treatments",
      icon: <Sparkles size={32} />,
      services: [
        "Hydra Facial",
        "Diamond Dermabrasion"
      ],
      description: "Advanced hydration and exfoliation for youthful, glowing skin."
    },
    {
      title: "Advanced Skin Treatment",
      icon: <Zap size={32} />,
      services: [
        "RF (Radio Frequency)"
      ],
      description: "Non-invasive skin tightening and rejuvenation for a lifted appearance."
    },
    {
      title: "Parlour Services",
      icon: <Scissors size={32} />,
      services: [
        "All types of parlour services are available"
      ],
      description: "From hair styling to threading, we cover all your beauty needs."
    },
    {
      title: "Hand & Foot Care",
      icon: <Hand size={32} />,
      services: [
        "Manicure",
        "Pedicure (Machine Available)"
      ],
      description: "Professional care for your hands and feet to keep them soft and beautiful."
    }
  ];

  const containerVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-semibold"
          >
            Enhance Your Natural Beauty
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif uppercase tracking-wider text-white"
          >
            Our Services
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-[1px] bg-white mx-auto"
          />
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {serviceCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-zinc-950/50 p-10 rounded-2xl border border-white/5 group hover:border-white/20 transition-all duration-500"
            >
              <div className="mb-6 w-16 h-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                <div className="text-white group-hover:text-black transition-colors duration-500">
                  {category.icon}
                </div>
              </div>

              <h3 className="text-2xl font-serif mb-4 text-white uppercase tracking-wide">
                {category.title}
              </h3>

              <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-light">
                {category.description}
              </p>

              <ul className="space-y-4">
                {category.services.map((service) => (
                  <li key={service} className="flex items-start space-x-3 text-sm font-medium text-zinc-300">
                    <CheckCircle2 size={16} className="text-white mt-0.5 flex-shrink-0 opacity-50" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        {/* Call to Action */}
        <div className="mt-32 p-12 md:p-20 border border-white/20 bg-zinc-900 rounded-2xl relative text-center shadow-2xl">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-wider">
              Ready for your <span className="text-accent-pink">Transformation?</span>
            </h3>
            <p className="text-zinc-300 font-light tracking-wide text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Book your slot today and experience the high-end luxury of White Rose Beauty Parlour Cosmetics & Tattoo Studio treatments.
            </p>
            <div className="pt-6">
              <Link
                href="https://wa.me/919876543210"
                className="inline-flex items-center justify-center space-x-3 px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-zinc-300 transition-colors"
              >
                <Calendar size={18} />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-20 py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3 text-white mb-2">
                <MapPin size={20} className="opacity-60" />
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Location</h4>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed tracking-wider">
                123 Luxury Lane, Beauty Avenue,<br />
                Fashion City, India
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3 text-white mb-2">
                <Phone size={20} className="opacity-60" />
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Call Us</h4>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed tracking-wider">
                +91 98765 43210<br />
                Available 10:00 AM - 08:00 PM
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3 text-white mb-2">
                <Mail size={20} className="opacity-60" />
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Email Us</h4>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed tracking-wider">
                hello@whiterosebeauty.com<br />
                booking@whiterosebeauty.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
