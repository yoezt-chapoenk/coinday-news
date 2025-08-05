// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Supabase configuration with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables');
  console.log('Available env vars:', {
    supabaseUrl: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey,
    anonKey: !!supabaseAnonKey
  });
  process.exit(1);
}

// Use service role key if available, otherwise use anon key
const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Fallback images for different categories
const fallbackImages = {
  default: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format',
  bitcoin: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&auto=format',
  ethereum: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop&auto=format',
  defi: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&auto=format',
  nft: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&h=400&fit=crop&auto=format',
  crypto: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop&auto=format',
  blockchain: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop&auto=format'
};

// Function to check if URL is accessible
function checkImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      resolve(false);
      return;
    }

    const client = url.startsWith('https') ? https : http;
    const request = client.request(url, { method: 'HEAD', timeout: 5000 }, (response) => {
      resolve(response.statusCode >= 200 && response.statusCode < 400);
    });

    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
    
    request.setTimeout(5000);
    request.end();
  });
}

// Function to get appropriate fallback image based on categories
function getFallbackImage(categories) {
  if (!categories || categories.length === 0) {
    return fallbackImages.default;
  }

  const categoryLower = categories[0].toLowerCase();
  
  if (categoryLower.includes('bitcoin') || categoryLower.includes('btc')) {
    return fallbackImages.bitcoin;
  }
  if (categoryLower.includes('ethereum') || categoryLower.includes('eth')) {
    return fallbackImages.ethereum;
  }
  if (categoryLower.includes('defi') || categoryLower.includes('decentralized')) {
    return fallbackImages.defi;
  }
  if (categoryLower.includes('nft') || categoryLower.includes('token')) {
    return fallbackImages.nft;
  }
  if (categoryLower.includes('crypto') || categoryLower.includes('currency')) {
    return fallbackImages.crypto;
  }
  if (categoryLower.includes('blockchain') || categoryLower.includes('chain')) {
    return fallbackImages.blockchain;
  }
  
  return fallbackImages.default;
}

// Alternative approach: Update using SQL query to bypass RLS
async function fixBrokenImagesWithSQL() {
  try {
    console.log('🔍 Fetching articles with broken replicate.delivery images...');
    
    // First, let's see what we're dealing with
    const { data: brokenArticles, error: fetchError } = await supabase
      .from('news_articles')
      .select('id, image_url, categories, rewritten_title')
      .like('image_url', '%replicate.delivery%')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching articles:', fetchError);
      return;
    }

    console.log(`📊 Found ${brokenArticles.length} articles with replicate.delivery images`);
    
    if (brokenArticles.length === 0) {
      console.log('✅ No broken replicate.delivery images found!');
      return;
    }

    // Show some examples
    console.log('\n📋 Examples of broken images:');
    brokenArticles.slice(0, 5).forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.rewritten_title?.substring(0, 50)}...`);
      console.log(`     Image: ${article.image_url}`);
    });

    console.log('\n🔧 Starting bulk update...');
    
    // Use SQL to update all replicate.delivery images at once
    const { data: updateResult, error: updateError } = await supabase.rpc('update_broken_images');
    
    if (updateError) {
      console.log('❌ RPC function not available, trying direct updates...');
      
      // Fallback: Update each article individually
      let fixedCount = 0;
      for (const article of brokenArticles) {
        const fallbackUrl = getFallbackImage(article.categories);
        
        const { error: individualUpdateError } = await supabase
          .from('news_articles')
          .update({ image_url: fallbackUrl })
          .eq('id', article.id);
        
        if (!individualUpdateError) {
          fixedCount++;
          console.log(`✅ Fixed: ${article.rewritten_title?.substring(0, 30)}...`);
        } else {
          console.log(`❌ Failed: ${article.rewritten_title?.substring(0, 30)}... - ${individualUpdateError.message}`);
        }
      }
      
      console.log(`\n📊 Fixed ${fixedCount}/${brokenArticles.length} articles`);
    } else {
      console.log('✅ Bulk update completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error in fixBrokenImagesWithSQL:', error);
  }
}

// Create SQL function for bulk update (if we have admin access)
async function createUpdateFunction() {
  try {
    const sqlFunction = `
      CREATE OR REPLACE FUNCTION update_broken_images()
      RETURNS INTEGER AS $$
      DECLARE
        updated_count INTEGER;
      BEGIN
        UPDATE news_articles 
        SET image_url = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format'
        WHERE image_url LIKE '%replicate.delivery%';
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RETURN updated_count;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    const { error } = await supabase.rpc('exec_sql', { sql: sqlFunction });
    
    if (error) {
      console.log('⚠️  Could not create SQL function (need admin access)');
      return false;
    }
    
    console.log('✅ SQL function created successfully');
    return true;
  } catch (error) {
    console.log('⚠️  Could not create SQL function:', error.message);
    return false;
  }
}

// Main function
async function fixBrokenImages() {
  console.log('🚀 Starting broken image fix process...');
  console.log(`🔑 Using ${supabaseServiceKey ? 'service role' : 'anon'} key`);
  
  await fixBrokenImagesWithSQL();
}

// Run the script
if (require.main === module) {
  fixBrokenImages().then(() => {
    console.log('🎉 Process finished!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
}

module.exports = { fixBrokenImages, checkImageUrl, getFallbackImage };