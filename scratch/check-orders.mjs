import { createClient } from '@supabase/supabase-js';

const url = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';
const supabase = createClient(url, key);

async function checkOrders() {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(`Found ${data.length} orders`);
  data.forEach(o => {
    console.log(`ID: ${o.id}, Total: ${o.total_amount}, Status: ${o.status}, Created: ${o.created_at}`);
  });
}

checkOrders();
