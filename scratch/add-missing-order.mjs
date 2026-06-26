import { createClient } from '@supabase/supabase-js';

const url = 'https://dchnqqqzstrglofnuvwb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';
const supabase = createClient(url, key);

const userId = '2f95c842-347b-4410-9adb-18a5d967e68b'; // Gayathri Rose
const productId = 'e2cccc2e-55dd-4267-b336-beecd5b358f3'; // Moringa Soap

async function manuallyAddOrder() {
  console.log('Inserting order...');
  
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: userId,
    total_amount: 60,
    status: 'processing',
    payment_status: 'paid',
    payment_id: 'manual_fix_razorpay_60',
    shipping_address: {
      name: 'Gayathri Rose',
      email: 'gayathrirose1726@gmail.com',
      phone: '8248850912',
      city: 'Rajapalayam',
      address: 'Manual Entry Fix',
      pincode: '626117'
    }
  }).select().single();

  if (orderError) {
    console.error('Order Error:', orderError);
    return;
  }

  console.log('Order created:', order.id);

  const { error: itemError } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: productId,
    quantity: 1,
    price: 60
  });

  if (itemError) {
    console.error('Item Error:', itemError);
  } else {
    console.log('Order item added successfully!');
  }
}

manuallyAddOrder();
