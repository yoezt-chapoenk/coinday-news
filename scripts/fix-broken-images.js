// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Main function to fix broken images
async function fixBrokenImages() {
  try {
    console.log('🔍 Fetching all articles from database...');
    
    // Get all articles
    const { data: articles, error } = await supabase
      .from('news_articles')
      .select('id, image_url, categories, rewritten_title')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching articles:', error);
      return;
    }

    console.log(`📊 Found ${articles.length} articles to check`);
    
    let brokenCount = 0;
    let fixedCount = 0;
    const batchSize = 10;
    
    // Process articles in batches to avoid overwhelming the servers
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(articles.length/batchSize)}...`);
      
      const promises = batch.map(async (article) => {
        const title = article.rewritten_title || 'Untitled Article';
        console.log(`  📝 Checking: ${title.substring(0, 50)}...`);
        
        // Check if image URL is accessible
        const isAccessible = await checkImageUrl(article.image_url);
        
        if (!isAccessible) {
          brokenCount++;
          console.log(`    ❌ Broken image: ${article.image_url}`);
          
          // Get appropriate fallback image
          const fallbackUrl = getFallbackImage(article.categories);
          console.log(`    🔧 Replacing with: ${fallbackUrl}`);
          
          // Update the article with new image URL
          const { error: updateError } = await supabase
            .from('news_articles')
            .update({ image_url: fallbackUrl })
            .eq('id', article.id);
          
          if (updateError) {
            console.error(`    ❌ Failed to update article ${article.id}:`, updateError);
          } else {
            fixedCount++;
            console.log(`    ✅ Fixed image for article ${article.id}`);
          }
        } else {
          console.log(`    ✅ Image OK`);
        }
      });
      
      await Promise.all(promises);
      
      // Add a small delay between batches
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total articles checked: ${articles.length}`);
    console.log(`   Broken images found: ${brokenCount}`);
    console.log(`   Images fixed: ${fixedCount}`);
    console.log('\n✅ Image fixing process completed!');
    
  } catch (error) {
    console.error('❌ Error in fixBrokenImages:', error);
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Starting broken image fix process...');
  fixBrokenImages().then(() => {
    console.log('🎉 Process finished!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
}

module.exports = { fixBrokenImages, checkImageUrl, getFallbackImage };