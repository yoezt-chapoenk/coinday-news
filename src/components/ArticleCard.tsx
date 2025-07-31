'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

const ArticleCard = ({ article, featured = false, className = '' }: ArticleCardProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <article className={`article-card group ${className}`}>
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-lg">
            <Image
              src={imageError ? fallbackImage : article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="category-tag mb-2 inline-block">
                {article.category}
              </span>
              <h2 className="text-white text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-gray-200 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-gray-200 text-sm line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span>By Admin</span>
                <span>•</span>
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={`article-card group ${className}`}>
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={imageError ? fallbackImage : article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-4 left-4">
            <span className="category-tag">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-white text-lg font-bold leading-tight mb-3 group-hover:text-gray-200 transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>By Admin</span>
              <span>•</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>
            <span>{article.readTime} min read</span>
          </div>
          
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;