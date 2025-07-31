import { Metadata } from 'next';
import { getArticles } from '@/lib/articles';
import ArticleList from '@/components/ArticleList';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'Latest Articles - Coinday',
  description: 'Browse all the latest cryptocurrency and blockchain news articles.',
};

export default async function LatestPage() {
  const articles = await getArticles();

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
            All Articles ({articles.length})
          </h2>
          <p className="text-gray-400">
            Browse through all our published articles
          </p>
        </div>
        
        {articles.length > 0 ? (
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