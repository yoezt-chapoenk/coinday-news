import { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  title?: string;
  showFeatured?: boolean;
  className?: string;
}

const ArticleList = ({ 
  articles, 
  title, 
  showFeatured = false, 
  className = '' 
}: ArticleListProps) => {
  if (articles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-lg mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          No articles found
        </div>
        <p className="text-gray-500">
          There are no articles to display at the moment.
        </p>
      </div>
    );
  }

  const featuredArticles = showFeatured ? articles.filter(article => article.featured) : [];
  const regularArticles = showFeatured ? articles.filter(article => !article.featured) : articles;

  return (
    <div className={className}>
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <div className="w-20 h-1 bg-white rounded"></div>
        </div>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Featured Stories</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                featured={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      {regularArticles.length > 0 && (
        <div>
          {showFeatured && featuredArticles.length > 0 && (
            <h3 className="text-xl font-bold text-white mb-6">Latest Articles</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button (placeholder for future pagination) */}
      {articles.length >= 9 && (
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;