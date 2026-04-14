import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MOCK_PRODUCTS = [
  { name: "BB Cream", description: "Allotment pending details", price: 899, category: "Makeup", image_url: "/products/bb-cream.jpeg", stock: 100, rating: 5.0 },
  { name: "Stroke Cream", description: "Allotment pending details", price: 999, category: "Makeup", image_url: "/products/stroke-cream.jpeg", stock: 100, rating: 5.0 },
  { name: "Primer", description: "Allotment pending details", price: 1099, category: "Makeup", image_url: "/products/primer.jpeg", stock: 100, rating: 5.0 },
  { name: "Foundation", description: "Allotment pending details", price: 1299, category: "Makeup", image_url: "/products/foundation.jpeg", stock: 100, rating: 5.0 },
  { name: "Compact Powder", description: "Allotment pending details", price: 799, category: "Makeup", image_url: "/products/compact-powder.jpeg", stock: 100, rating: 5.0 },
  { name: "Eyeliner", description: "Allotment pending details", price: 499, category: "Makeup", image_url: "/products/eyeliner.jpeg", stock: 100, rating: 5.0 },
  { name: "Mascara", description: "Allotment pending details", price: 549, category: "Makeup", image_url: "/products/mascara.jpeg", stock: 100, rating: 5.0 },
  { name: "Kajal", description: "Allotment pending details", price: 299, category: "Makeup", image_url: "/products/kajal.jpeg", stock: 100, rating: 5.0 },
  { name: "Sindoor", description: "Allotment pending details", price: 199, category: "Makeup", image_url: "/products/sindoor.jpeg", stock: 100, rating: 5.0 },
  { name: "Eyebrow Pencil", description: "Allotment pending details", price: 349, category: "Makeup", image_url: "/products/eyebrow-pencil.jpeg", stock: 100, rating: 5.0 },
  { name: "Mini Makeup Brush Kit", description: "Allotment pending details", price: 1499, category: "Makeup", image_url: "/products/mini-makeup-brush-kit.jpeg", stock: 100, rating: 5.0 },
  { name: "Keysoul Wipes", description: "Allotment pending details", price: 149, category: "Makeup", image_url: "/products/wipes.jpeg", stock: 100, rating: 5.0 },
  { name: "Lip Kit", description: "Lip Liner, Lipstick, Lip Balm, Lip Gloss, Lip Oil", price: 1999, category: "Makeup", image_url: "/products/lip-kit.jpeg", stock: 100, rating: 5.0 },
  { name: "Eyeshadow Palette", description: "Allotment pending details", price: 1899, category: "Makeup", image_url: "/products/eyeshadow-palette.jpeg", stock: 100, rating: 5.0 },
  { name: "3-in-1 Shine Palette", description: "Blush, Highlighter, Contour", price: 2199, category: "Makeup", image_url: "/products/3-in-1-shine-palette.jpeg", stock: 100, rating: 5.0 },
  { name: "3-in-1 Tint", description: "Eyes, Lip, Blush", price: 899, category: "Makeup", image_url: "/products/3-in-1-tint.jpeg", stock: 100, rating: 5.0 },
  { name: "Concealer", description: "High coverage creamy concealer", price: 599, category: "Makeup", image_url: "/products/concealer.jpeg", stock: 100, rating: 5.0 },
  { name: "Lip Balm", description: "Nourishing lip protection", price: 249, category: "Makeup", image_url: "/products/lip-balm.jpeg", stock: 100, rating: 5.0 },
  { name: "Lip Balm V2", description: "Advanced lip hydration", price: 299, category: "Makeup", image_url: "/products/lip-balm-2.jpeg", stock: 100, rating: 5.0 },
  { name: "Face Wash", description: "Allotment pending details", price: 449, category: "Skincare", image_url: "/products/face-wash.jpeg", stock: 100, rating: 5.0 },
  { name: "Toner", description: "Allotment pending details", price: 499, category: "Skincare", image_url: "/products/toner.jpeg", stock: 100, rating: 5.0 },
  { name: "Sunscreen", description: "Allotment pending details", price: 699, category: "Skincare", image_url: "/products/sunscreen.jpeg", stock: 100, rating: 5.0 },
  { name: "Moisturizer (Oily Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-oily.jpeg", stock: 100, rating: 5.0 },
  { name: "Moisturizer (Normal/Combination)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-normal.jpeg", stock: 100, rating: 5.0 },
  { name: "Moisturizer (Dry Skin)", description: "Allotment pending details", price: 549, category: "Skincare", image_url: "/products/moisturizer-dry.jpeg", stock: 100, rating: 5.0 },
  { name: "Day Serum", description: "Allotment pending details", price: 899, category: "Skincare", image_url: "/products/day-serum.jpeg", stock: 100, rating: 5.0 },
  { name: "Night Serum", description: "Allotment pending details", price: 949, category: "Skincare", image_url: "/products/night-serum.jpeg", stock: 100, rating: 5.0 },
  { name: "Hair Serum", description: "Allotment pending details", price: 799, category: "Skincare", image_url: "/products/hair-serum.jpeg", stock: 100, rating: 5.0 },
  { name: "Serum Kit", description: "Day + Night + Hair", price: 2499, category: "Skincare", image_url: "/products/serum-kit.jpeg", stock: 100, rating: 5.0 },
  { name: "Hair Revival Kit", description: "Allotment pending details", price: 2999, category: "Hair Care", image_url: "/products/hair-revival-kit.jpeg", stock: 100, rating: 5.0 },
  { name: "Anti-dandruff Shampoo", description: "Allotment pending details", price: 649, category: "Hair Care", image_url: "/products/anti-dandruff-shampoo.jpeg", stock: 100, rating: 5.0 },
  { name: "Hair Fall Control Shampoo", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: "/products/hair-fall-control-shampoo.jpeg", stock: 100, rating: 5.0 },
  { name: "Herbal Shampoo", description: "Allotment pending details", price: 549, category: "Hair Care", image_url: "/products/herbal-shampoo.jpeg", stock: 100, rating: 5.0 },
  { name: "Herbal Oil", description: "Allotment pending details", price: 449, category: "Hair Care", image_url: "/products/herbal-oil.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Shampoo", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: "/products/hair-fall-control-shampoo.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Oil", description: "Allotment pending details", price: 699, category: "Hair Care", image_url: "/products/moringa-oil.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Conditioner", description: "Allotment pending details", price: 799, category: "Hair Care", image_url: "/products/hair-conditioner.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Mini Facial Kit", description: "Allotment pending details", price: 1499, category: "Others", image_url: "/products/moringa-mini-facial-kit.jpeg", stock: 100, rating: 5.0 },
  { name: "Foot Cream", description: "Allotment pending details", price: 399, category: "Others", image_url: "/products/foot-cream.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Scrub", description: "Allotment pending details", price: 599, category: "Others", image_url: "/products/moringa-scrub.jpeg", stock: 100, rating: 5.0 },
  { name: "Moringa Soap", description: "Allotment pending details", price: 149, category: "Others", image_url: "/products/moringa-soap.jpeg", stock: 100, rating: 5.0 },
  { name: "Nysa Sensation Soap", description: "Allotment pending details", price: 199, category: "Others", image_url: "/products/nysa-soap.jpeg", stock: 100, rating: 5.0 },
  { name: "Perfume", description: "Allotment pending details", price: 1999, category: "Others", image_url: "/products/perfume.jpeg", stock: 100, rating: 5.0 }
];

async function seedDatabase() {
  console.log('Starting seed process...');
  
  // Clear existing products just in case there are a few dangling ones
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
      console.log('Delete error (might be expected if empty):', deleteError.message);
  }

  const { data, error } = await supabase.from('products').insert(MOCK_PRODUCTS).select();
  
  if (error) {
    console.error('Failed to seed database:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} products!`);
  }
}

seedDatabase();
