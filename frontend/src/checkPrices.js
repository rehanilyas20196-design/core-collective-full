import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://izqxsfuyibbzwdxdcmev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cXhzZnV5aWJiendkeGRjbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Mzg5MTAsImV4cCI6MjA5MjAxNDkxMH0.74Kiivvw-1KesGCdkI42QJPjADD1K3Eihi1nna8FkLM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkPrices() {
  const { data, error } = await supabase.from('products').select('name, price');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Product prices:');
    data.forEach(p => console.log(`${p.name}: ${p.price}`));
  }
}

checkPrices();