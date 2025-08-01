'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';
import { useArticles } from '@/contexts/ArticlesContext';

interface CategoryListProps {
  title?: string;
  showCount?: boolean;
  className?: string;
  currentCategory?: string;
}

const CategoryList = ({ 
  title = 'Categories', 
  showCount = true, 
  className = '',
  currentCategory,
  categories: propCategories
}: CategoryListProps & { categories?: Category[] }) => {
  const context = useArticles();
  const categories = propCategories || context?.categories || [];
  const loading = context?.loading || false;

  if (loading) {
    return (
      <div className={`bg-black border border-gray-800 rounded-lg p-6 ${className}`}>
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black border border-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const isActive = currentCategory === category.slug;
          
          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`block p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-white text-black' 
                  : 'hover:bg-gray-800 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${
                    isActive ? 'text-black' : 'text-white group-hover:text-white'
                  }`}>
                    {category.name}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {category.description}
                  </p>
                </div>
                
                {showCount && (
                  <div className={`text-sm font-medium px-2 py-1 rounded ${
                    isActive 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                  }`}>
                    {category.count}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* View All Categories Link */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <Link 
          href="/categories"
          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
        >
          <span>View All Categories</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CategoryList;