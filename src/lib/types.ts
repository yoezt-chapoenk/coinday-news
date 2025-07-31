// Types for Supabase data
export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url?: string | null;
  approved: boolean;
  categories: string[];
  created_at: string;
  updated_at?: string;
  rewritten_title?: string | null;
  rewritten_summary?: string | null;
  rewritten_content?: string | null;
  source?: string;
  published_at?: string;
}

// Transformed article type for frontend
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

// Transform Supabase article to frontend article
export function transformArticle(article: NewsArticle): Article {
  const title = article.rewritten_title || article.title;
  const content = article.rewritten_content || article.content;
  const excerpt = article.rewritten_summary || article.summary;
  
  // Generate slug from title (limit to first 50 characters for better URLs)
  const slug = title
    .toLowerCase()
    .substring(0, 50)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-'); // Replace multiple dashes with single dash
  
  // Estimate read time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Handle categories safely
  const categories = Array.isArray(article.categories) ? article.categories : [];
  
  // Function to build Supabase Storage URL
  const buildSupabaseImageUrl = (imagePath: string | null | undefined): string => {
    const fallbackImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format';
    
    if (!imagePath || imagePath.trim() === '') {
      return fallbackImage;
    }
    
    // Check if it's a replicate.delivery URL (these require auth headers and cannot be used directly)
    if (imagePath.includes('replicate.delivery')) {
      console.log(`Replicate.delivery URL detected for article "${title}", using fallback image: ${imagePath}`);
      return fallbackImage;
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /, return as is
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Build Supabase Storage URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      // Remove leading slash if present
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return `${supabaseUrl}/storage/v1/object/public/article-images/${cleanPath}`;
    }
    
    // Fallback if no Supabase URL
    return fallbackImage;
  };
  
  const finalImageUrl = buildSupabaseImageUrl(article.image_url);
  
  // Debug logging for image URL
  console.log(`Article "${title}" image URL:`, {
    original: article.image_url,
    final: finalImageUrl
  });

  return {
    id: article.id.toString(),
    title,
    slug,
    excerpt,
    content,
    author: article.source || 'Coinday Team',
    publishedAt: article.published_at || article.created_at,
    category: categories[0] || 'General',
    tags: categories,
    imageUrl: finalImageUrl,
    readTime,
    featured: false // We can add logic later to determine featured articles
  };
}