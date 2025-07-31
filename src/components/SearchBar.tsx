'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchArticles } from '@/lib/articles';
import { Article } from '@/lib/types';
import Link from 'next/link';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showResults?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ 
  placeholder = 'Search articles...', 
  className = '',
  showResults = true,
  onSearch
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const searchResults = await searchArticles(query);
          setResults(searchResults.slice(0, 5)); // Limit to 5 results for dropdown
          setIsOpen(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input-field w-full pl-12 pr-4"
            onFocus={() => query.trim() && setIsOpen(true)}
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-white rounded-full"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-800">
                <p className="text-gray-400 text-sm">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={handleResultClick}
                  className="block p-4 hover:bg-gray-800 transition-colors duration-200 border-b border-gray-800 last:border-b-0"
                >
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1 line-clamp-1">
                        {highlightText(article.title, query)}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                        {highlightText(article.excerpt, query)}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="category-tag text-xs">
                          {article.category}
                        </span>
                        <span>•</span>
                        <span>Admin</span>
                        <span>•</span>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {results.length >= 5 && (
                <div className="p-3 border-t border-gray-800">
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                    }}
                    className="text-white hover:text-gray-300 text-sm font-medium flex items-center space-x-2"
                  >
                    <span>View all results</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : query.trim() && !isLoading ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">No articles found for &ldquo;{query}&rdquo;</p>
              </div>
              <p className="text-gray-500 text-xs">
                Try different keywords or browse our categories
              </p>
            </div>
          ) : null}
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;