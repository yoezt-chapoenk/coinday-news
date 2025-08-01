'use client';

import { useArticles } from '@/contexts/ArticlesContext';
import ArticleList from '@/components/ArticleList';
import SearchBar from '@/components/SearchBar';

export default function LatestPage() {
  const { articles, loading } = useArticles();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Latest Articles
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Stay updated with the latest cryptocurrency and blockchain news
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search articles..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Articles */}
      <main className="container-custom py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            All Articles ({loading ? '...' : articles.length})
          </h2>
          <p className="text-gray-400">
            Browse through all our published articles
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              No articles found
            </div>
            <p className="text-gray-500 mb-8">
              Check back soon for new content!
            </p>
            <a href="/" className="btn-primary">
              Back to Home
            </a>
          </div>
        )}
      </main>
    </div>
  );
}