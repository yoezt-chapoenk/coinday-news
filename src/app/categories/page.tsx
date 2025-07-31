import { Metadata } from 'next';
import { getCategories } from '@/lib/articles';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'Categories - Coinday',
  description: 'Browse articles by category. Find cryptocurrency and blockchain news organized by topics.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Explore articles organized by topics and categories
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

      {/* Categories */}
      <main className="container-custom py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            All Categories ({categories.length})
          </h2>
          <p className="text-gray-400">
            Choose a category to explore related articles
          </p>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    {category.count} articles
                  </span>
                </div>
                
                {category.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                  <span>View articles</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              No categories found
            </div>
            <p className="text-gray-500 mb-8">
              Categories will appear here once articles are added to the database.
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