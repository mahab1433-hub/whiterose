import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Truck, Clock, Globe, ShieldCheck, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy - White Rose',
  description: 'Shipping policy and delivery information for White Rose Beauty Parlour Cosmetics & Tattoo Studio.',
};

const shippingFeatures = [
  {
    icon: <Truck className="text-accent-pink" size={24} />,
    title: "Standard Shipping",
    desc: "Free shipping on all orders across India."
  },
  {
    icon: <Clock className="text-accent-pink" size={24} />,
    title: "Fast Delivery",
    desc: "24-48 hours delivery for local Rajapalayam orders."
  },
  {
    icon: <ShieldCheck className="text-accent-pink" size={24} />,
    title: "Secure Packing",
    desc: "Tamper-proof packaging to ensure product integrity."
  }
];

export default function ShippingPolicy() {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-pink/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Side: Features & Summary */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent-pink font-bold">Logistics</h2>
              <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tight leading-tight">Shipping <br />Information</h1>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">
                We partner with premium courier services to ensure your beauty essentials reach you in perfect condition.
              </p>
            </div>

            <div className="space-y-8">
              {shippingFeatures.map((f, i) => (
                <div key={i} className="flex gap-4 p-6 bg-zinc-950 border border-white/5 hover:border-accent-pink/20 transition-colors group">
                  <div className="mt-1">{f.icon}</div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-white">{f.title}</h3>
                    <p className="text-[11px] text-zinc-500 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Detailed Content */}
          <div className="lg:col-span-8 bg-zinc-950/50 border border-white/5 p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-p:text-zinc-400 prose-p:text-sm prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-white max-w-none space-y-12">
              
              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-white">
                  <Clock size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">1. Order Processing Time</h3>
                </div>
                <p>
                  All orders are meticulously prepared and processed within <strong>1 to 3 business days</strong>. You will receive a confirmation email once your order has been verified, and another with tracking details once it's on its way.
                </p>
                <div className="p-4 bg-accent-pink/5 border-l-2 border-accent-pink text-[11px] uppercase tracking-wider text-accent-pink">
                  Note: Processing may take longer during festive seasons or product launches.
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-white">
                  <Globe size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">2. Shipping Rates & Delivery</h3>
                </div>
                <div className="overflow-hidden border border-white/10 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-zinc-400">
                        <th className="p-4 border-b border-white/10">Location</th>
                        <th className="p-4 border-b border-white/10">Method</th>
                        <th className="p-4 border-b border-white/10">Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] text-zinc-500">
                      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                         <td className="p-4 text-white uppercase">All India</td>
                        <td className="p-4">Standard Shipping</td>
                        <td className="p-4">Free</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-white">
                  <MapPin size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">3. Delivery Address</h3>
                </div>
                <p>
                  Please ensure your shipping address and contact number are accurate. We cannot be held responsible for delivery failures due to incorrect information. For security reasons, we do not ship to P.O. Boxes.
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-white">
                  <ShieldCheck size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">4. Damaged Items</h3>
                </div>
                <p>
                  If you receive a package that shows signs of tampering or damage, please do not accept the delivery and contact us immediately at <Link href="mailto:gayathrirose1726@gmail.com" className="text-white hover:text-accent-pink underline decoration-accent-pink/30">gayathrirose1726@gmail.com</Link> or call <span className="text-white">+91 82488 50912</span>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
