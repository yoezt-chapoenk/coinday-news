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

// Dummy data removed - using database data instead
export const categories: Category[] = [];

// Dummy data removed - using database data instead
export const articles: Article[] = [];

// Helper functions removed - use functions from @/lib/articles instead
// These functions now connect to the Supabase database