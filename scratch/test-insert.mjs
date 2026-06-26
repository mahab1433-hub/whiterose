import { createClient } from '@supabase/supabase-js';

const url = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';
const supabase = createClient(url, key);

async function testInsert() {
  const { data, error } = await supabase.from('products').insert({
    name: 'Test Product',
    sku: 'TEST-SKU',
    category: 'Skincare',
    brand: 'Test Brand',
    description: 'Test Description',
    price: 99.99,
    offerPrice: 79.99,
    stock: 10,
    ingredients: 'Test Ingredients',
    benefits: 'Test Benefits',
    usage: 'Test Usage',
    skinType: 'All',
    weight: '100g',
    featured: true,
    status: 'Active',
    images: ['/test.jpg']
  }).select();

  if (error) {
    console.error('Insert Failed:', error);
  } else {
    console.log('Insert Succeeded! Columns exist:', data);
  }
}

testInsert();
