import { Product } from "@/types";

const DUMMY_MAKEUP_IMG = "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop";
const DUMMY_SKINCARE_IMG = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop";
const DUMMY_HAIRCARE_IMG = "https://images.unsplash.com/photo-1631730359585-38a4935ccbbd?q=80&w=2070&auto=format&fit=crop";
const DUMMY_OTHER_IMG = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2042&auto=format&fit=crop";

export const MOCK_PRODUCTS: Product[] = [
  // --- MAKEUP ---
  { id: "M1", name: "BB Cream", description: "Allotment pending details", price: 899, category: "Makeup", image_url: "/products/bb-cream.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M2", name: "Stroke Cream", description: "Allotment pending details", price: 999, category: "Makeup", image_url: "/products/stroke-cream.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M3", name: "Primer", description: "Allotment pending details", price: 1099, category: "Makeup", image_url: "/products/primer.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M4", name: "Foundation", description: "Allotment pending details", price: 1299, category: "Makeup", image_url: "/products/foundation.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M5", name: "Compact Powder", description: "Allotment pending details", price: 799, category: "Makeup", image_url: "/products/compact-powder.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M6", name: "Eyeliner", description: "Allotment pending details", price: 499, category: "Makeup", image_url: "/products/eyeliner.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M7", name: "Mascara", description: "Allotment pending details", price: 549, category: "Makeup", image_url: "/products/mascara.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M8", name: "Kajal", description: "Allotment pending details", price: 299, category: "Makeup", image_url: "/products/kajal.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M9", name: "Sindoor", description: "Allotment pending details", price: 199, category: "Makeup", image_url: "/products/sindoor.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M10", name: "Eyebrow Pencil", description: "Allotment pending details", price: 349, category: "Makeup", image_url: "/products/eyebrow-pencil.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M11", name: "Mini Makeup Brush Kit", description: "Allotment pending details", price: 1499, category: "Makeup", image_url: "/products/mini-makeup-brush-kit.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M12", name: "Keysoul Wipes", description: "Allotment pending details", price: 149, category: "Makeup", image_url: "/products/wipes.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M13", name: "Lip Kit", description: "Lip Liner, Lipstick, Lip Balm, Lip Gloss, Lip Oil", price: 1999, category: "Makeup", image_url: "/products/lip-kit.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M14", name: "Eyeshadow Palette", description: "Allotment pending details", price: 1899, category: "Makeup", image_url: "/products/eyeshadow-palette.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M15", name: "3-in-1 Shine Palette", description: "Blush, Highlighter, Contour", price: 2199, category: "Makeup", image_url: "/products/3-in-1-shine-palette.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M16", name: "3-in-1 Tint", description: "Eyes, Lip, Blush", price: 899, category: "Makeup", image_url: "/products/3-in-1-tint.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M17", name: "Concealer", description: "High coverage creamy concealer", price: 599, category: "Makeup", image_url: "/products/concealer.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M18", name: "Lip Balm", description: "Nourishing lip protection", price: 249, category: "Makeup", image_url: "/products/lip-balm.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M19", name: "Lip Balm V2", description: "Advanced lip hydration", price: 299, category: "Makeup", image_url: "/products/lip-balm-2.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- SKINCARE ---
  { id: "S1", name: "Face Wash", description: "Allotment pending details", price: 449, category: "Skincare", image_url: "/products/face-wash.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S2", name: "Toner", description: "Allotment pending details", price: 499, category: "Skincare", image_url: "/products/toner.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S3", name: "Sunscreen", description: "Allotment pending details", price: 699, category: "Skincare", image_url: "/products/sunscreen.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S4", name: "Moisturizer (Oily Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-oily.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S5", name: "Moisturizer (Normal/Combination)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-normal.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S6", name: "Moisturizer (Dry Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-dry.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S7", name: "Day Serum", description: "Allotment pending details", price: 899, category: "Skincare", image_url: "/products/day-serum.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S8", name: "Night Serum", description: "Allotment pending details", price: 949, category: "Skincare", image_url: "/products/night-serum.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S9", name: "Hair Serum", description: "Allotment pending details", price: 799, category: "Skincare", image_url: "/products/hair-serum.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S10", name: "Serum Kit", description: "Day + Night + Hair", price: 2499, category: "Skincare", image_url: "/products/serum-kit.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- HAIR CARE ---
  { id: "HC1", name: "Hair Revival Kit", description: "Allotment pending details", price: 2999, category: "Hair Care", image_url: "/products/hair-revival-kit.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC2", name: "Anti-dandruff Shampoo", description: "Allotment pending details", price: 649, category: "Hair Care", image_url: "/products/anti-dandruff-shampoo.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC3", name: "Hair Fall Control Shampoo", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: "/products/hair-fall-control-shampoo.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC4", name: "Herbal Shampoo", description: "Allotment pending details", price: 549, category: "Hair Care", image_url: "/products/herbal-shampoo.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC5", name: "Herbal Oil", description: "Allotment pending details", price: 449, category: "Hair Care", image_url: "/products/herbal-oil.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC6", name: "Moringa Shampoo", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: "/products/hair-fall-control-shampoo.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC7", name: "Moringa Oil", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: "/products/moringa-oil.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC8", name: "Moringa Conditioner", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: "/products/hair-conditioner.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- OTHERS ---
  { id: "O2", name: "Moringa Mini Facial Kit", description: "Allotment pending details", price: 1499, category: "Others", image_url: "/products/moringa-mini-facial-kit.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O3", name: "Foot Cream", description: "Allotment pending details", price: 399, category: "Others", image_url: "/products/foot-cream.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O4", name: "Moringa Scrub", description: "Allotment pending details", price: 599, category: "Others", image_url: "/products/moringa-scrub.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O5", name: "Moringa Soap", description: "Allotment pending details", price: 149, category: "Others", image_url: "/products/moringa-soap.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O6", name: "Nysa Sensation Soap", description: "Allotment pending details", price: 199, category: "Others", image_url: "/products/nysa-soap.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O7", name: "Perfume", description: "Allotment pending details", price: 1999, category: "Others", image_url: "/products/perfume.jpeg", stock: 100, rating: 5.0, created_at: new Date().toISOString() },
];
