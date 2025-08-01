'use client';

import React from 'react';

interface ArticleContentProps {
  content: string;
  className?: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, className = '' }) => {
  // Function to render content with proper paragraph separation
  const renderContent = () => {
    // Always check if content is defined before running any string operations
    if (!content || typeof content !== 'string') {
      return (
        <div className={`prose prose-lg prose-invert max-w-none ${className}`}>
          <p className="text-gray-400">No content available.</p>
        </div>
      );
    }
    
    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]*>/g.test(content);
    
    if (hasHtmlTags) {
      // If content has HTML tags, render as HTML but ensure it's wrapped in prose
      return (
        <div 
          className={`prose prose-lg prose-invert max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    } else {
      // Enhanced paragraph splitting logic with fallback
      const paragraphs = content.includes('\n\n') 
        ? content.split('\n\n').map(p => p.trim()).filter(p => p.length > 0)
        : content.split('. ').map(p => p.trim()).filter(p => p.length > 0).map(p => {
            // Add period back if it doesn't end with punctuation
            return p.match(/[.!?]$/) ? p : p + '.';
          });
      
      return (
        <div className={`prose prose-lg prose-invert max-w-none ${className}`}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
  };

  return renderContent();
};

export default ArticleContent;