import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://izqxsfuyibbzwdxdcmev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cXhzZnV5aWJiendkeGRjbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Mzg5MTAsImV4cCI6MjA5MjAxNDkxMH0.74Kiivvw-1KesGCdkI42QJPjADD1K3Eihi1nna8FkLM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const priceUpdates = {
  'Coffee Machine': 12500,
  'Hair Dryer': 5000,
  'Air Conditioner': 100000,
  'Ceiling Remote fan': 15000,
  'Led Light': 400,
  'Surface Mounted Downlight': 300,
  'Modren Charger': 200,
  'Security Camera': 9000,
  'Toaster': 13000,
  'Oven': 15000,
  'White Wedding Dress female': 20000,
  'Shalwar Kameez male': 2500,
  'Female Designable Shalwar Kameez': 3000,
  'White Shalwar Kameez Male': 2000,
  'full Fashion dressign Kids': 1000,
  'Formal male dress': 2500,
  'Polo Shirt': 5000,
  'Formal dressing for men': 1500,
  'Indian female wedding dress': 15000,
  'White wedding dress': 17000,
  'Wedding dress desi': 10000,
  'small Pent Shirt': 700,
  'Girls Kid Dress': 300,
  'Modren Black kameez shalwar (winter)': 2500,
  'Ergonomic White Sofa': 5000,
  'Brown water pot': 400,
  'Lamp': 7000,
  'Modren Leather Magzine Rack': 3000,
  'Juicer machine': 3000,
  'Cordless Power Drill': 12000,
  'Complete Tool Set': 27000,
  'Circular Saw': 1000,
  'Multi-tool Kit': 15000,
  'Tape Measure': 500,
  'Screwdriver Set': 100,
  'Wrench Set': 400,
  'Professional Tennis Racket': 3000,
  'Extra Thick Yoga Mat': 400,
  'Basketball': 3000,
  'Cricket Bat': 5000,
  'Soccer Ball': 2000,
  'Cricket Ball': 500,
  'Running Shorts': 2000,
  'Sports Water Bottle': 300,
  'Orthopedic Dog Bed': 2000,
  'Multi-level Cat Tree': 4000,
  'Dog Leash': 1000,
  'Cat Litter Box': 300,
  'Dog Chew Toy': 900,
  'Cat Food Bowl': 400,
  'Bird Cage': 2000,
  'Fish Tank Kit': 5000,
  'Smart Robot Speaker': 25000,
  'Wireless Printer': 15000,
  'AI Humanoid Robot': 40000,
  'Professional Microphone': 6000,
  'Wireless Charger': 200,
  'Smart Thermostat': 1000,
  'Video Doorbell': 9000,
  'Smart Plug': 65
};

async function updatePrices() {
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name');

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  const idByName = new Map(products.map((product) => [product.name, product.id]));

  for (const [name, price] of Object.entries(priceUpdates)) {
    const productId = idByName.get(name);

    if (!productId) {
      console.warn(`Skipping ${name}: product not found or name mismatch.`);
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ price })
      .eq('id', productId);

    if (error) {
      console.error(`Error updating ${name} (id ${productId}):`, error);
    } else {
      console.log(`Updated ${name} (id ${productId}) to ${price}`);
    }
  }
}

updatePrices();