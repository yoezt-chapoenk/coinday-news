import { Metadata } from 'next';
import { getArticles, getFeaturedArticles, getTrendingTags } from '@/lib/articles';
import ArticleList from '@/components/ArticleList';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coinday - Latest News & Updates',
  description: 'Stay updated with the latest news and trending stories from around the world. Your trusted source for breaking news, analysis, and insights.',
  openGraph: {
    title: 'Coinday - Latest News & Updates',
    description: 'Stay updated with the latest news and trending stories from around the world.',
    url: 'https://coinday.com',
    siteName: 'Coinday',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Coinday News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles();
  const allArticles = await getArticles();
  const latestArticles = allArticles.slice(0, 9); // Get first 9 articles
  const trendingTags = await getTrendingTags();

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
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3">


            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Latest News</h2>
                <Link 
                  href="/latest" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                >
                  <span>View All</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <ArticleList articles={latestArticles} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <CategoryList title="Browse Categories" />
            
            {/* Trending Tags */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="category-tag hover:bg-gray-700 transition-colors duration-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest news delivered straight to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field w-full"
                  required
                />
                <button 
                  type="submit"
                  className="btn-primary w-full"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Articles</span>
                  <span className="text-white font-bold">{allArticles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Featured Stories</span>
                  <span className="text-white font-bold">{featuredArticles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Authors</span>
                  <span className="text-white font-bold">
                    {new Set(allArticles.map(a => a.author)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}