import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request);
    console.log('🔧 Starting image URL fix process...');
    
    // Find all articles with replicate.delivery URLs
    const { data: replicateArticles, error } = await supabase
      .from('news_articles')
      .select('id, title, rewritten_title, image_url')
      .like('image_url', '%replicate.delivery%');

    if (error) {
      console.error('Error fetching replicate articles:', error);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    console.log(`Found ${replicateArticles.length} articles with replicate.delivery URLs`);

    if (replicateArticles.length === 0) {
      return NextResponse.json({ 
        message: 'No articles need fixing',
        updated: 0
      });
    }

    // Different fallback images for variety
    const fallbackImages = [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format', // Bitcoin/crypto
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&auto=format', // Blockchain
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&auto=format', // Technology
    ];

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Update each article
    for (let i = 0; i < replicateArticles.length; i++) {
      const article = replicateArticles[i];
      const fallbackImage = fallbackImages[i % fallbackImages.length];
      
      const { error: updateError } = await supabase
        .from('news_articles')
        .update({ image_url: fallbackImage })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.id}:`, updateError);
        errorCount++;
        results.push({
          id: article.id,
          title: article.rewritten_title || article.title,
          status: 'error',
          error: updateError.message
        });
      } else {
        successCount++;
        const title = article.rewritten_title || article.title;
        console.log(`Updated article ${article.id}: ${title}`);
        results.push({
          id: article.id,
          title: title,
          status: 'success',
          newImageUrl: fallbackImage
        });
      }
    }

    return NextResponse.json({
      message: `Image URL fixing complete. ${successCount} updated, ${errorCount} errors.`,
      totalFound: replicateArticles.length,
      successCount,
      errorCount,
      results
    });

  } catch (error) {
    console.error('Error during image URL fixing:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to fix image URLs',
    endpoint: '/api/fix-images'
  });
}