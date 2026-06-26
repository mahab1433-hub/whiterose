import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dchnqqqzstrglofnuvwb.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';

export const supabaseServer = createClient(url, key);

export const getProductsServer = async (includeInactive = false) => {
  let query = supabaseServer
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!includeInactive) {
    query = query.eq('status', 'Active');
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products server-side:', error.message || error);
    return [];
  }
  return data;
};

export const getFeaturedProductsServer = async () => {
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('status', 'Active')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching featured products server-side:', error.message || error);
    return [];
  }
  return data;
};
