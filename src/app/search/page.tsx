'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchArticles, getTrendingTags, getCategories } from '@/lib/articles';
import { Article, Category } from '@/lib/types';
import ArticleList from '@/components/ArticleList';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'readTime'>('relevance');
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load trending tags and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tags, categoriesData] = await Promise.all([
          getTrendingTags(),
          getCategories()
        ]);
        setTrendingTags(tags);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
   }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      let searchResults = await searchArticles(searchQuery);
      
      // Sort results based on selected option
      if (sortBy === 'date') {
        searchResults = searchResults.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      } else if (sortBy === 'readTime') {
        searchResults = searchResults.sort((a, b) => a.readTime - b.readTime);
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching articles:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // Load initial search results
  useEffect(() => {
    if (initialQuery.trim()) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, performSearch]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const handleCategoryFilter = (categoryName: string) => {
    setQuery(categoryName);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Search Header */}
      <header className="bg-black border-b border-gray-800 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Search Articles
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Find the latest news and stories that matter to you
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search for articles, topics, or authors..."
                showResults={false}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Search Info and Filters */}
            {query && (
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Search Results for &ldquo;{query}&rdquo;
                    </h2>
                    <p className="text-gray-400">
                      {isLoading ? 'Searching...' : `Found ${results.length} article${results.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="mt-4 md:mt-0">
                    <label className="text-gray-400 text-sm mr-3">Sort by:</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'readTime')}
                      className="input-field text-sm py-2 px-3"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Latest First</option>
                      <option value="readTime">Read Time</option>
                    </select>
                  </div>
                </div>
                
                {/* Clear Search */}
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 mb-8"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear search</span>
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-white rounded-full"></div>
                <span className="ml-3 text-gray-400">Searching articles...</span>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && query && (
              <ArticleList 
                articles={results}
                className={results.length === 0 ? 'text-center py-12' : ''}
              />
            )}

            {/* No Query State */}
            {!query && !isLoading && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-4">
                  <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Start your search
                </div>
                <p className="text-gray-500 mb-8">
                  Enter keywords, topics, or author names to find relevant articles
                </p>
                
                {/* Quick Search Suggestions */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-white font-medium mb-4">Popular searches:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {trendingTags.slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="category-tag hover:bg-gray-700 transition-colors duration-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Filters */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">By Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.name)}
                      className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 py-1"
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Read Time */}
              <div>
                <h4 className="text-white font-medium mb-3">By Read Time</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setQuery('quick read')}
                    className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 py-1"
                  >
                    Quick reads (≤ 3 min)
                  </button>
                  <button
                    onClick={() => setQuery('medium read')}
                    className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 py-1"
                  >
                    Medium reads (4-6 min)
                  </button>
                  <button
                    onClick={() => setQuery('long read')}
                    className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 py-1"
                  >
                    Long reads (7+ min)
                  </button>
                </div>
              </div>
            </div>
            
            {/* Trending Tags */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="category-tag hover:bg-gray-700 transition-colors duration-200"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Categories */}
            <CategoryList title="Browse by Category" />
            
            {/* Search Tips */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Search Tips</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start space-x-2">
                  <span className="text-white font-medium">•</span>
                  <span>Use specific keywords for better results</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-white font-medium">•</span>
                  <span>Search by author name to find their articles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-white font-medium">•</span>
                  <span>Try category names for topic-specific results</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-white font-medium">•</span>
                  <span>Use trending tags for popular topics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-white rounded-full"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}