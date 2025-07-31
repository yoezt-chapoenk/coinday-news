import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticlesByCategory, getCategories } from '@/lib/articles';
import ArticleList from '@/components/ArticleList';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - Coinday',
      description: 'The requested category could not be found.',
    };
  }

  const categoryArticles = await getArticlesByCategory(params.slug);

  return {
    title: `${category.name} News - Coinday`,
    description: `${category.description}. Browse ${categoryArticles.length} articles in ${category.name}.`,
    keywords: `${category.name}, news, articles, ${category.name.toLowerCase()} news`,
    openGraph: {
      title: `${category.name} News - Coinday`,
      description: `${category.description}. Browse ${categoryArticles.length} articles in ${category.name}.`,
      url: `https://coinday.com/category/${category.slug}`,
      siteName: 'Coinday',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${category.name} News - Coinday`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} News - Coinday`,
      description: `${category.description}. Browse ${categoryArticles.length} articles in ${category.name}.`,
      images: ['/og-image.png'],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  const categoryArticles = await getArticlesByCategory(params.slug);
  const featuredArticles = categoryArticles.filter(article => article.featured);
  const regularArticles = categoryArticles.filter(article => !article.featured);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} News`,
    description: category.description,
    url: `https://coinday.com/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categoryArticles.length,
      itemListElement: categoryArticles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.excerpt,
          url: `https://coinday.com/article/${article.slug}`,
          datePublished: article.publishedAt,
          author: {
            '@type': 'Person',
            name: 'Admin',
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-black">
        {/* Breadcrumb */}
        <div className="container-custom py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors duration-200">
              Home
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{category.name}</span>
          </nav>
        </div>

        {/* Category Header */}
        <header className="container-custom pb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
              <span className="text-black font-bold text-2xl">
                {category.name.charAt(0)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name} News
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{categoryArticles.length} Articles</span>
              </div>
              
              {featuredArticles.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>{featuredArticles.length} Featured</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <SearchBar placeholder={`Search ${category.name.toLowerCase()} articles...`} />
          </div>
        </header>

        {/* Main Content */}
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Articles */}
            <div className="lg:col-span-3">
              {categoryArticles.length > 0 ? (
                <>
                  {/* Featured Articles */}
                  {featuredArticles.length > 0 && (
                    <section className="mb-16">
                      <h2 className="text-2xl font-bold text-white mb-8">Featured {category.name} Stories</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {featuredArticles.map((article) => (
                          <ArticleList 
                            key={article.id}
                            articles={[article]} 
                            showFeatured={true}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Regular Articles */}
                  {regularArticles.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-white mb-8">
                        {featuredArticles.length > 0 ? `Latest ${category.name} News` : `All ${category.name} Articles`}
                      </h2>
                      <ArticleList articles={regularArticles} />
                    </section>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg mb-4">
                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    No {category.name.toLowerCase()} articles found
                  </div>
                  <p className="text-gray-500 mb-8">
                    We don&apos;t have any articles in this category yet. Check back soon for updates!
                  </p>
                  <a href="/" className="btn-primary">
                    Browse All Articles
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Other Categories */}
              <CategoryList 
                title="Other Categories" 
                currentCategory={params.slug}
              />
              
              {/* Category Stats */}
              <div className="bg-black border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Category Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Articles</span>
                    <span className="text-white font-bold">{categoryArticles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Featured Stories</span>
                    <span className="text-white font-bold">{featuredArticles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Authors</span>
                    <span className="text-white font-bold">
                      {new Set(categoryArticles.map(a => a.author)).size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Read Time</span>
                    <span className="text-white font-bold">
                      {categoryArticles.length > 0 
                        ? Math.round(categoryArticles.reduce((acc, article) => acc + article.readTime, 0) / categoryArticles.length)
                        : 0
                      } min
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Related Tags */}
              {categoryArticles.length > 0 && (
                <div className="bg-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(categoryArticles.flatMap(article => article.tags)))
                      .slice(0, 8)
                      .map((tag: string) => (
                        <a
                          key={tag}
                          href={`/search?q=${encodeURIComponent(tag)}`}
                          className="category-tag hover:bg-gray-700 transition-colors duration-200"
                        >
                          #{tag}
                        </a>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}