import React from 'react';
import Link from 'next/link';
import { ChevronLeft, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Returns & Exchanges - White Rose',
  description: 'Return and exchange policy for White Rose Beauty Parlour Cosmetics & Tattoo Studio.',
};

const returnSteps = [
  {
    num: "01",
    title: "Contact Us",
    desc: "Email our support team within 7 days of delivery with your order ID."
  },
  {
    num: "02",
    title: "Approval",
    desc: "Our team will review your request and provide return instructions."
  },
  {
    num: "03",
    title: "Ship Back",
    desc: "Pack the item securely and ship it back to our Rajapalayam studio."
  },
  {
    num: "04",
    title: "Refund",
    desc: "Once inspected, your refund will be processed to the original payment source."
  }
];

export default function ReturnsExchanges() {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent-pink/5 rounded-full blur-[120px] -z-10 -translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Header Section */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent-pink font-bold">Satisfaction</h2>
              <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tight leading-tight">Returns <br />& Refunds</h1>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">
                We take pride in our quality, but if something isn't right, we're here to help make it better.
              </p>
            </div>

            <div className="p-8 bg-zinc-950 border border-white/5 space-y-6">
              <div className="flex gap-4">
                <ShieldAlert className="text-accent-pink shrink-0" size={24} />
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Important Note</h4>
                  <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                    Due to hygiene standards, cosmetics and skincare products that have been opened or tested are not eligible for return.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Detail Section */}
          <div className="lg:w-2/3 space-y-12">
            {/* The Process Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {returnSteps.map((step, i) => (
                <div key={i} className="p-8 bg-zinc-950/50 border border-white/5 backdrop-blur-sm relative group hover:border-accent-pink/20 transition-all">
                  <span className="text-3xl font-serif text-white/10 absolute top-4 right-6 group-hover:text-accent-pink/20 transition-colors">{step.num}</span>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed uppercase tracking-wider">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Detailed text */}
            <div className="prose prose-invert prose-p:text-zinc-400 prose-p:text-sm prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-widest max-w-none space-y-10 bg-zinc-950 border border-white/5 p-8 md:p-12">
              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <AlertCircle size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">Eligibility for Returns</h3>
                </div>
                <p>
                  To be eligible for a return, your item must be <strong>unused and in the same condition</strong> that you received it. It must also be in the original packaging with all seals intact. Returns must be initiated within <strong>7 days</strong> of the delivery date.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <RefreshCw size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">Exchanges</h3>
                </div>
                <p>
                  We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <Link href="mailto:gayathrirose1726@gmail.com" className="text-white hover:text-accent-pink underline decoration-accent-pink/30">gayathrirose1726@gmail.com</Link> and our team will guide you through the process.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <CheckCircle2 size={18} className="text-accent-pink" />
                  <h3 className="text-lg m-0">Refund Policy</h3>
                </div>
                <p>
                  Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <strong>5-7 business days</strong>.
                </p>
                <div className="p-4 bg-zinc-900 border border-white/10 text-[11px] uppercase tracking-widest text-zinc-500">
                  Note: Shipping costs are non-refundable. If you receive a refund, the cost of initial shipping will be deducted from your refund amount.
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
