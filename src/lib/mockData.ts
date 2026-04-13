import { Product } from "@/types";

const DUMMY_MAKEUP_IMG = "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop";
const DUMMY_SKINCARE_IMG = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop";
const DUMMY_HAIRCARE_IMG = "https://images.unsplash.com/photo-1631730359585-38a4935ccbbd?q=80&w=2070&auto=format&fit=crop";
const DUMMY_OTHER_IMG = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2042&auto=format&fit=crop";

export const MOCK_PRODUCTS: Product[] = [
  // --- MAKEUP ---
  { id: "M1", name: "BB Cream", description: "Allotment pending details", price: 899, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M2", name: "Stroke Cream", description: "Allotment pending details", price: 999, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M3", name: "Primer", description: "Allotment pending details", price: 1099, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M4", name: "Foundation", description: "Allotment pending details", price: 1299, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M5", name: "Compact Powder", description: "Allotment pending details", price: 799, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M6", name: "Eyeliner", description: "Allotment pending details", price: 499, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M7", name: "Mascara", description: "Allotment pending details", price: 549, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M8", name: "Kajal", description: "Allotment pending details", price: 299, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M9", name: "Sindoor", description: "Allotment pending details", price: 199, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M10", name: "Eyebrow Pencil", description: "Allotment pending details", price: 349, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M11", name: "Mini Makeup Brush Kit", description: "Allotment pending details", price: 1499, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M12", name: "Keysoul Wipes", description: "Allotment pending details", price: 149, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M13", name: "Lip Kit", description: "Lip Liner, Lipstick, Lip Balm, Lip Gloss, Lip Oil", price: 1999, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M14", name: "Eyeshadow Palette", description: "Allotment pending details", price: 1899, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M15", name: "3-in-1 Shine Palette", description: "Blush, Highlighter, Contour", price: 2199, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "M16", name: "3-in-1 Tint", description: "Eyes, Lip, Blush", price: 899, category: "Makeup", image_url: DUMMY_MAKEUP_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- SKINCARE ---
  { id: "S1", name: "Face Wash", description: "Allotment pending details", price: 449, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S2", name: "Toner", description: "Allotment pending details", price: 499, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S3", name: "Sunscreen", description: "Allotment pending details", price: 699, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S4", name: "Moisturizer (Oily Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S5", name: "Moisturizer (Normal/Combination)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S6", name: "Moisturizer (Dry Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S7", name: "Day Serum", description: "Allotment pending details", price: 899, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S8", name: "Night Serum", description: "Allotment pending details", price: 949, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S9", name: "Hair Serum", description: "Allotment pending details", price: 799, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "S10", name: "Serum Kit", description: "Day + Night + Hair", price: 2499, category: "Skincare", image_url: DUMMY_SKINCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- HAIR CARE ---
  { id: "HC1", name: "Hair Straightener Kit", description: "Allotment pending details", price: 2999, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC2", name: "Anti-dandruff Shampoo", description: "Allotment pending details", price: 649, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC3", name: "Hair Fall Control Shampoo", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC4", name: "Herbal Shampoo", description: "Allotment pending details", price: 549, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC5", name: "Herbal Oil", description: "Allotment pending details", price: 449, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC6", name: "Moringa Shampoo", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC7", name: "Moringa Oil", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "HC8", name: "Moringa Conditioner", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: DUMMY_HAIRCARE_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },

  // --- OTHERS ---
  { id: "O1", name: "Mini Facial Kit", description: "Allotment pending details", price: 1299, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O2", name: "Moringa Mini Facial Kit", description: "Allotment pending details", price: 1499, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O3", name: "Foot Cream", description: "Allotment pending details", price: 399, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O4", name: "Moringa Scrub", description: "Allotment pending details", price: 599, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O5", name: "Moringa Soap", description: "Allotment pending details", price: 149, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O6", name: "Nysa Sensation Soap", description: "Allotment pending details", price: 199, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
  { id: "O7", name: "Perfume", description: "Allotment pending details", price: 1999, category: "Others", image_url: DUMMY_OTHER_IMG, stock: 100, rating: 5.0, created_at: new Date().toISOString() },
];
