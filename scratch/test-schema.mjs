import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabase() {
  console.log('Testing connection to Supabase...');
  
  // Try to select the new columns
  const { data, error } = await supabase
    .from('products')
    .select('id, name, benefits, sku, status, featured')
    .limit(1);

  if (error) {
    console.error('❌ Database query failed with error:');
    console.error(error);
  } else {
    console.log('✅ Success! The new columns exist in the database.');
    console.log('Sample data:', data);
  }
}

testDatabase();
