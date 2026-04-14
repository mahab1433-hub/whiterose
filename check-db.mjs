import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabase() {
  console.log('Checking connection...');
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Database Error:', error.message);
  } else {
    console.log(`Found ${data.length} products in the database!`);
    if (data.length > 0) {
      console.log('First product:', data[0].name);
    }
  }
}

checkDatabase();
