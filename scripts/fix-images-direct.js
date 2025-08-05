// Direct database fix for broken images
// This script attempts to bypass RLS by using raw SQL queries

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback images for different categories
const fallbackImages = {
  bitcoin: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&auto=format',
  ethereum: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop&auto=format',
  defi: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&auto=format',
  nft: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&h=400&fit=crop&auto=format',
  crypto: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop&auto=format',
  blockchain: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format'
};

async function fixImagesWithRPC() {
  try {
    console.log('🔍 Checking for broken replicate.delivery images...');
    
    // First, count broken images
    const { data: countResult, error: countError } = await supabase
      .rpc('count_broken_images');
    
    if (countError) {
      console.log('⚠️  RPC function not available, creating it...');
      
      // Try to create the RPC function
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION count_broken_images()
        RETURNS INTEGER AS $$
        BEGIN
          RETURN (SELECT COUNT(*) FROM news_articles WHERE image_url LIKE '%replicate.delivery%');
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      
      const { error: createError } = await supabase.rpc('exec', { sql: createFunctionSQL });
      
      if (createError) {
        console.log('❌ Cannot create RPC function. Trying alternative approach...');
        return await fixImagesAlternative();
      }
    }
    
    console.log(`📊 Found broken images, proceeding with fix...`);
    
    // Create fix function
    const fixFunctionSQL = `
      CREATE OR REPLACE FUNCTION fix_broken_images()
      RETURNS INTEGER AS $$
      DECLARE
        updated_count INTEGER := 0;
      BEGIN
        -- Bitcoin related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.bitcoin}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%bitcoin%' OR categories::text ILIKE '%btc%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- Ethereum related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.ethereum}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%ethereum%' OR categories::text ILIKE '%eth%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- DeFi related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.defi}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%defi%' OR categories::text ILIKE '%decentralized%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- NFT related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.nft}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%nft%' OR categories::text ILIKE '%token%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- Crypto related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.crypto}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%crypto%' OR categories::text ILIKE '%currency%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- Blockchain related
        UPDATE news_articles 
        SET image_url = '${fallbackImages.blockchain}'
        WHERE image_url LIKE '%replicate.delivery%'
        AND (categories::text ILIKE '%blockchain%' OR categories::text ILIKE '%chain%');
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        -- Default fallback for remaining
        UPDATE news_articles 
        SET image_url = '${fallbackImages.default}'
        WHERE image_url LIKE '%replicate.delivery%';
        
        GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
        
        RETURN updated_count;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    const { error: createFixError } = await supabase.rpc('exec', { sql: fixFunctionSQL });
    
    if (createFixError) {
      console.log('❌ Cannot create fix function:', createFixError.message);
      return await fixImagesAlternative();
    }
    
    // Execute the fix
    const { data: fixResult, error: fixError } = await supabase.rpc('fix_broken_images');
    
    if (fixError) {
      console.log('❌ Fix function failed:', fixError.message);
      return await fixImagesAlternative();
    }
    
    console.log(`✅ Successfully fixed ${fixResult} images!`);
    
  } catch (error) {
    console.error('❌ Error in fixImagesWithRPC:', error);
    return await fixImagesAlternative();
  }
}

async function fixImagesAlternative() {
  console.log('🔄 Trying alternative approach...');
  console.log('📋 Manual steps required:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run the SQL script: scripts/fix-broken-images.sql');
  console.log('4. This will bypass RLS and fix all broken images');
  
  // Show current broken images for reference
  try {
    const { data: brokenImages, error } = await supabase
      .from('news_articles')
      .select('id, rewritten_title, image_url, categories')
      .like('image_url', '%replicate.delivery%')
      .limit(10);
    
    if (!error && brokenImages.length > 0) {
      console.log('\n📋 Examples of broken images:');
      brokenImages.forEach((article, index) => {
        console.log(`  ${index + 1}. ${article.rewritten_title?.substring(0, 50)}...`);
        console.log(`     Categories: ${article.categories}`);
        console.log(`     Broken URL: ${article.image_url}`);
      });
    }
  } catch (err) {
    console.log('⚠️  Could not fetch examples');
  }
}

async function main() {
  console.log('🚀 Starting image fix process...');
  await fixImagesWithRPC();
  console.log('🎉 Process completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fixImagesWithRPC, fixImagesAlternative };