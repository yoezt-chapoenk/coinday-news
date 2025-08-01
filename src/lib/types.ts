// Types for Supabase data
export interface NewsArticle {
  id: string; // UUID in database
  original_title: string;
  rewritten_title: string;
  summary: string;
  content: string;
  source: string;
  published_date: string;
  image_url?: string | null;
  approved: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
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
  image_url: string;
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
  const title = article.rewritten_title || article.original_title;
  const content = article.content;
  const excerpt = article.summary;
  
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
    
    // Only use fallback if image path is empty, null, or not a valid URL
    if (!imagePath || imagePath.trim() === '') {
      return fallbackImage;
    }
    
    // If it's already a full URL (including replicate.delivery), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /, return as is
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Build Supabase Storage URL for relative paths
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
    publishedAt: article.published_date || article.created_at,
    category: categories[0] || 'General',
    tags: categories,
    image_url: finalImageUrl,
    readTime,
    featured: false // We can add logic later to determine featured articles
  };
}