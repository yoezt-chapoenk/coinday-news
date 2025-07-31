import { createClient } from '@supabase/supabase-js';
import { NewsArticle, Article, Category, transformArticle } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all approved articles
export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    // Filter out articles with missing required fields and transform
    return (data || [])
      .filter(article => {
        const title = article.rewritten_title || article.title;
        const summary = article.rewritten_summary || article.summary;
        const content = article.rewritten_content || article.content;
        return article && title && summary && content && title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
      })
      .map(transformArticle);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get featured articles (latest 3 approved articles)
export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }

    return (data || [])
      .filter(article => {
        const title = article.rewritten_title || article.title;
        const summary = article.rewritten_summary || article.summary;
        const content = article.rewritten_content || article.content;
        return article && title && summary && content && title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
      })
      .map(article => ({
        ...transformArticle(article),
        featured: true
      }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get articles by category
export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true)
      .contains('categories', [categorySlug])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }

    return (data || [])
      .filter(article => {
        const title = article.rewritten_title || article.title;
        const summary = article.rewritten_summary || article.summary;
        const content = article.rewritten_content || article.content;
        return article && title && summary && content && title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
      })
      .map(transformArticle);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true);

    if (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }

    const articles = (data || []).map(transformArticle);
    return articles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Search articles
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%,rewritten_title.ilike.%${query}%,rewritten_summary.ilike.%${query}%,rewritten_content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return (data || [])
      .filter(article => {
        const title = article.rewritten_title || article.title;
        const summary = article.rewritten_summary || article.summary;
        const content = article.rewritten_content || article.content;
        return article && title && summary && content && title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
      })
      .map(transformArticle);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get related articles
export async function getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('approved', true)
      .neq('id', parseInt(currentArticle.id))
      .overlaps('categories', currentArticle.tags)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }

    return (data || [])
      .filter(article => {
        const title = article.rewritten_title || article.title;
        const summary = article.rewritten_summary || article.summary;
        const content = article.rewritten_content || article.content;
        return article && title && summary && content && title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
      })
      .map(transformArticle);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get categories with article counts
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('categories')
      .eq('approved', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Count articles per category
    const categoryCount: { [key: string]: number } = {};
    
    (data || []).forEach(article => {
      if (article.categories && Array.isArray(article.categories)) {
        article.categories.forEach((category: string) => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      }
    });

    // Convert to Category objects
    return Object.entries(categoryCount).map(([name, count], index) => ({
      id: (index + 1).toString(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: `${name} news and updates`,
      count
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Get trending tags
export async function getTrendingTags(): Promise<string[]> {
  try {
    const categories = await getCategories();
    return categories.slice(0, 10).map(cat => cat.name);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}