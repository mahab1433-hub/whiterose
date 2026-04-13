import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredCategories = [
    { name: "Makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop", count: 12 },
    { name: "Skincare", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1974&auto=format&fit=crop", count: 8 },
    { name: "Hair Care", image: "https://images.unsplash.com/photo-1527799822344-935df389063d?q=80&w=2072&auto=format&fit=crop", count: 15 },
  ];

  return (
    <div>
      <Hero />

      {/* Featured Categories */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Categories</h2>
              <h3 className="text-3xl md:text-5xl font-serif uppercase tracking-wider">The Collection</h3>
            </div>
            <Link href="/shop" className="text-xs uppercase tracking-widest flex items-center space-x-2 border-b border-white hover:text-accent-pink hover:border-accent-pink transition-all pb-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((cat) => (
              <Link key={cat.name} href={`/shop?category=${cat.name}`} className="group relative aspect-[4/5] overflow-hidden bg-zinc-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-60"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] mb-2">{cat.count} Products</span>
                  <h4 className="text-2xl font-serif uppercase tracking-widest">{cat.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=2070&auto=format&fit=crop" 
              alt="Experience" 
              className="object-cover w-full h-full"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-white/10 hidden lg:block" />
          </div>
          <div className="space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">The Experience</h2>
            <h3 className="text-4xl md:text-6xl font-serif uppercase tracking-tight leading-tight">
              Where Art Meets <br />
              Eternal Beauty
            </h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              At White Rose, we blend the precision of professional tattoo artistry with the delicacy of high-end beauty treatments. Every service is a curated experience designed to celebrate your individuality.
            </p>
            <div className="grid grid-cols-2 gap-10 pt-8">
              <div>
                <h5 className="font-serif text-3xl mb-1">15k+</h5>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Happy Clients</p>
              </div>
              <div>
                <h5 className="font-serif text-3xl mb-1">10y+</h5>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Of Expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-serif uppercase tracking-[0.2em] mb-6">Join The Circle</h3>
          <p className="text-zinc-400 text-sm mb-12 tracking-wide font-light">
            Subscribe to receive exclusive offers, beauty tips, and early access to our new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-1 bg-transparent border-b border-white/20 py-4 text-xs tracking-widest focus:outline-none focus:border-white transition-colors"
            />
            <button className="px-12 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-pink transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
