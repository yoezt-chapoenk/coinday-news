'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CategoryManager from './CategoryManager'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  original_url: string
  image_url: string | null
  approved: boolean
  categories: string[]
  created_at: string
  updated_at: string
  rewritten_title: string | null
  rewritten_summary: string | null
  rewritten_content: string | null
  source?: string
  published_date?: string
}

interface EditModalProps {
  article: NewsArticle | null
  onClose: () => void
  onSave: (updatedArticle: NewsArticle) => void
}

export default function EditModal({ article, onClose, onSave }: EditModalProps) {
  const [rewrittenTitle, setRewrittenTitle] = useState('')
  const [rewrittenSummary, setRewrittenSummary] = useState('')
  const [rewrittenContent, setRewrittenContent] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (article) {
      setRewrittenTitle(article.rewritten_title || article.title)
      setRewrittenSummary(article.rewritten_summary || article.summary)
      setRewrittenContent(article.rewritten_content || article.content)
      setCategories(article.categories || [])
    }
  }, [article])

  const fetchAvailableCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('categories')
        .not('categories', 'is', null)
      
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }

      // Extract unique categories from all articles
      const allCategories = new Set<string>()
      data?.forEach(article => {
        if (article.categories && Array.isArray(article.categories)) {
          article.categories.forEach(cat => allCategories.add(cat))
        }
      })
      
      setAvailableCategories(Array.from(allCategories).sort())
    } catch (error) {
      console.error('Error fetching available categories:', error)
    }
  }, [supabase])

  useEffect(() => {
    fetchAvailableCategories()
  }, [fetchAvailableCategories])

  if (!article) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({
          rewritten_title: rewrittenTitle,
          rewritten_summary: rewrittenSummary,
          rewritten_content: rewrittenContent,
          categories: categories,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)

      if (error) {
        console.error('Error saving article:', error)
        alert('Error saving article')
        return
      }

      const updatedArticle = {
        ...article,
        rewritten_title: rewrittenTitle,
        rewritten_summary: rewrittenSummary,
        rewritten_content: rewrittenContent,
        categories: categories,
        updated_at: new Date().toISOString()
      }
      onSave(updatedArticle)
      onClose()
    } catch (err) {
      console.error('Error:', err)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAndApprove = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({
          rewritten_title: rewrittenTitle,
          rewritten_summary: rewrittenSummary,
          rewritten_content: rewrittenContent,
          categories: categories,
          approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)

      if (error) {
        console.error('Error saving and approving article:', error)
        alert('Error saving and approving article')
        return
      }

      const updatedArticle = {
        ...article,
        rewritten_title: rewrittenTitle,
        rewritten_summary: rewrittenSummary,
        rewritten_content: rewrittenContent,
        categories: categories,
        approved: true,
        updated_at: new Date().toISOString()
      }
      onSave(updatedArticle)
      onClose()
    } catch (err) {
      console.error('Error:', err)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Article</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Original Title (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Original Title (Read-only)
              </label>
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-400">
                {article.title}
              </div>
            </div>
            
            {/* Rewritten Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rewritten Title
              </label>
              <input
                type="text"
                value={rewrittenTitle}
                onChange={(e) => setRewrittenTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter rewritten title..."
              />
            </div>
            
            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rewritten Summary
              </label>
              <textarea
                value={rewrittenSummary}
                onChange={(e) => setRewrittenSummary(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-vertical"
                placeholder="Enter rewritten summary..."
              />
            </div>
            
            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rewritten Content
              </label>
              <textarea
                value={rewrittenContent}
                onChange={(e) => setRewrittenContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-vertical"
                placeholder="Enter rewritten content..."
              />
            </div>
            
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categories
              </label>
              <CategoryManager
                categories={categories}
                onChange={setCategories}
                availableCategories={availableCategories}
                placeholder="Add category..."
              />
            </div>
            
            {/* Article Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Source
                </label>
                <p className="text-sm text-gray-400">{article.source || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Published Date
                </label>
                <p className="text-sm text-gray-400">
                  {article.published_date ? new Date(article.published_date).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {!article.approved && (
            <button
              onClick={handleSaveAndApprove}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save & Approve'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}