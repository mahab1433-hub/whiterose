import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Scale, FileText, Gavel, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - White Rose',
  description: 'Terms of service for White Rose Beauty Parlour Cosmetics & Tattoo Studio.',
};

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-pink/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="space-y-6 mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent-pink font-bold">Legal Agreement</h2>
          <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tight">Terms of <br />Service</h1>
          <div className="flex items-center space-x-4 pt-4">
             <div className="h-px w-12 bg-accent-pink/30" />
             <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Revision: 1.2 • May 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 bg-zinc-950 border border-white/5 space-y-6">
              <div className="space-y-2">
                <FileText className="text-accent-pink" size={20} />
                <h4 className="text-[10px] uppercase tracking-widest font-bold">Summary</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                  By using this site, you agree to our usage, studio, and product policies.
                </p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="space-y-2">
                <Gavel className="text-accent-pink" size={20} />
                <h4 className="text-[10px] uppercase tracking-widest font-bold">Governing Law</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                  Subject to the jurisdiction of courts in Tamil Nadu, India.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-zinc-950 border border-white/5 p-8 md:p-12">
            <div className="prose prose-invert prose-p:text-zinc-400 prose-p:text-sm prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-widest max-w-none space-y-12">
              
              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <Scale size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">1. Acceptance of Terms</h3>
                </div>
                <p>
                  Welcome to White Rose Beauty Parlour. By accessing our platform and services, you signify your agreement to these Terms of Service. If you disagree with any part of these terms, please refrain from using our website or studio services.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <AlertTriangle size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">2. Usage Disclaimer</h3>
                </div>
                <p>
                  The content on this website is for general information and aesthetic purposes only. White Rose reserves the right to modify product prices, studio availability, and appointment timings without prior notice.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg border-b border-white/10 pb-4">3. Intellectual Property</h3>
                <p>
                  All content, including logo designs, product photography, and tattoo portfolio images, are the property of White Rose. Unauthorized reproduction or usage of these materials is strictly prohibited.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg border-b border-white/10 pb-4">4. Studio Appointments</h3>
                <p>
                  Studio services in Rajapalayam, specifically tattoo sessions and bridal makeup, require advance booking. Cancellations must be made at least 24 hours in advance to be eligible for a rescheduled slot.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
