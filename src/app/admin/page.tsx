'use client'

import { useState, useEffect, useCallback } from 'react'
import ArticleTable from '@/components/admin/ArticleTable'
import TabNavigation from '@/components/admin/TabNavigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  published_date?: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching articles:', error)
        return
      }
      
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }, [supabase])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Article Moderation</h1>
        <div className="text-sm text-gray-400">
          {articles.length} pending articles
        </div>
      </div>
      
      <TabNavigation currentTab="pending" />
      
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Pending Articles</h2>
          <p className="text-sm text-gray-400 mt-1">
            Review and moderate articles awaiting approval
          </p>
        </div>
        
        <ArticleTable 
          articles={articles} 
          type="pending"
        />
      </div>
    </div>
  )
}