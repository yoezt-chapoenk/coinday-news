'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArticleTable } from '@/components/admin/ArticleTable';
import TabNavigation from '@/components/admin/TabNavigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  rewritten_title?: string;
  rewritten_summary?: string;
  rewritten_content?: string;
  approved: boolean;
  categories: string[];
  created_at: string;
  source?: string;
  published_at?: string;
}

export default function ApprovedArticlesPage() {
  const [approvedArticles, setApprovedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchApprovedArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('approved', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved articles:', error);
      } else {
        setApprovedArticles(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchApprovedArticles();
  }, [fetchApprovedArticles]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Approved Articles</h1>
        <div className="text-sm text-gray-400">
          {approvedArticles?.length || 0} approved articles
        </div>
      </div>
      
      <TabNavigation currentTab="approved" />
      
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Approved Articles</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage and edit approved articles
          </p>
        </div>
        
        <ArticleTable 
          articles={approvedArticles || []} 
          type="approved"
        />
      </div>
    </div>
  )
}