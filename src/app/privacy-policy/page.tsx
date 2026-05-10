import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - White Rose',
  description: 'Privacy policy for White Rose Beauty Parlour Cosmetics & Tattoo Studio.',
};

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent-pink/[0.03] blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="space-y-6 mb-16 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent-pink font-bold">Data Protection</h2>
          <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Last Updated: May 10, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: <Shield size={20} />, text: "Secure Data" },
            { icon: <Lock size={20} />, text: "Encrypted" },
            { icon: <Eye size={20} />, text: "Transparent" },
            { icon: <UserCheck size={20} />, text: "User Control" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-zinc-950/50 backdrop-blur-sm space-y-3">
              <div className="text-accent-pink">{item.icon}</div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="bg-zinc-950 border border-white/5 p-8 md:p-16 space-y-12">
          <div className="prose prose-invert prose-p:text-zinc-400 prose-p:text-sm prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-white max-w-none space-y-10">
            <section className="space-y-4">
              <h3 className="text-xl border-b border-white/10 pb-4">1. Information Collection</h3>
              <p>
                We collect information that you provide directly to us when you create an account, make a purchase, or visit our studio in Rajapalayam. This includes your <strong>name, email address, phone number, and shipping address</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl border-b border-white/10 pb-4">2. Usage of Information</h3>
              <p>
                Your data helps us process your orders efficiently, provide personalized beauty recommendations, and notify you about exclusive studio offers. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl border-b border-white/10 pb-4">3. Security Measures</h3>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. All sensitive credit information is transmitted via <strong>Secure Socket Layer (SSL)</strong> technology and then encrypted into our Payment gateway providers database.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl border-b border-white/10 pb-4">4. Contact Information</h3>
              <p>
                If you have any questions regarding this policy, you may contact us at <Link href="mailto:gayathrirose1726@gmail.com" className="text-accent-pink">gayathrirose1726@gmail.com</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
