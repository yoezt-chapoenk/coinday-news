'use client';

import { useArticles } from '@/contexts/ArticlesContext';
import ArticleList from '@/components/ArticleList';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { useMemo } from 'react';

export default function HomePage() {
  const { articles, categories, loading, error } = useArticles();

  // Memoize computed values
  const { latestArticles, trendingTags } = useMemo(() => {
    const latest = articles.slice(0, 9); // Get first 9 articles
    
    // Extract trending tags from categories
    const tags = categories.slice(0, 10).map(cat => cat.name);
    
    return {
      latestArticles: latest,
      trendingTags: tags
    };
  }, [articles, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-black py-12 border-b border-gray-800">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 gradient-text">
              Stay Informed
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Your trusted source for breaking news, in-depth analysis, and trending stories from around the world.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <SearchBar placeholder="Search breaking news..." />
            </div>
          </div>


        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles */}
            <div className="lg:col-span-3">
              <ArticleList 
                articles={latestArticles} 
                title="Latest News" 
                className="mb-8"
              />
              
              {articles.length > 9 && (
                <div className="text-center mt-8">
                  <Link 
                    href="/latest" 
                    className="btn-primary"
                  >
                    View All Articles
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="mb-8">
                <CategoryList categories={categories} />
              </div>

              {/* Trending Tags */}
              {trendingTags.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Trending Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/category/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}