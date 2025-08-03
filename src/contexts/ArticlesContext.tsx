'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Article, Category, transformArticle } from '@/lib/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ArticlesContextType {
  articles: Article[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hasNewUpdates: boolean;
  refreshArticles: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  markUpdatesAsRead: () => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
}

interface ArticlesProviderProps {
  children: ReactNode;
}

export function ArticlesProvider({ children }: ArticlesProviderProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const supabase = createClientComponentClient();

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    try {
      // Add cache busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(1000); // Add reasonable limit

      if (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles');
        return;
      }

      // Filter out articles with missing required fields and transform
      const validArticles = (data || [])
        .filter(article => {
          const title = article.rewritten_title || article.original_title;
          const summary = article.summary;
          const content = article.content;
          return article && title && summary && content && 
                 title.trim() !== '' && summary.trim() !== '' && content.trim() !== '';
        })
        .map(transformArticle);

      console.log(`Fetched ${validArticles.length} articles at ${new Date().toISOString()}`);
      setArticles(validArticles);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch articles');
    }
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('categories')
        .eq('approved', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      // Extract and count categories
      const categoryCount: { [key: string]: number } = {};
      
      data?.forEach(article => {
        if (article.categories && Array.isArray(article.categories)) {
          article.categories.forEach((category: string) => {
            if (category && category.trim()) {
              const trimmedCategory = category.trim();
              categoryCount[trimmedCategory] = (categoryCount[trimmedCategory] || 0) + 1;
            }
          });
        }
      });

      // Convert to Category objects and sort by count
      const categoriesArray: Category[] = Object.entries(categoryCount)
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description: `${name} news and updates`,
          count
        }))
        .sort((a, b) => b.count - a.count);

      setCategories(categoriesArray);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Refresh functions
  const refreshArticles = async () => {
    setLoading(true);
    await fetchArticles();
    setHasNewUpdates(false);
    setLoading(false);
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const markUpdatesAsRead = () => {
    setHasNewUpdates(false);
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchArticles(), fetchCategories()]);
      setLoading(false);
    };

    initializeData();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel('news_articles_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'news_articles'
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            
            // Mark that there are new updates available
            setHasNewUpdates(true);
            
            // Add a small delay to ensure database consistency
            setTimeout(() => {
              fetchArticles();
              fetchCategories();
            }, 500);
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to real-time updates');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Real-time subscription error, attempting to reconnect...');
            // Attempt to reconnect after a delay
            setTimeout(() => {
              setupRealtimeSubscription();
            }, 5000);
          }
        });
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Add periodic refresh as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data every 5 minutes as fallback
      fetchArticles();
      fetchCategories();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const value: ArticlesContextType = {
    articles,
    categories,
    loading,
    error,
    lastUpdated,
    hasNewUpdates,
    refreshArticles,
    refreshCategories,
    markUpdatesAsRead
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
}