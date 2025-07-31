'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CategoryManager from './CategoryManager'

interface NewsArticle {
  id: number
  title: string
  summary: string
  content: string
  image_url?: string | null
  approved: boolean
  categories: string[]
  created_at: string
  updated_at?: string
  rewritten_title?: string | null
  rewritten_summary?: string | null
  rewritten_content?: string | null
  source?: string
  published_at?: string
}

// EditModal Component
interface EditModalProps {
  article: NewsArticle
  onClose: () => void
  onSave: (updatedArticle: NewsArticle) => void
}

const EditModal: React.FC<EditModalProps> = ({ article, onClose, onSave }) => {
  const [rewrittenTitle, setRewrittenTitle] = useState(article.rewritten_title || article.title)
  const [rewrittenSummary, setRewrittenSummary] = useState(article.rewritten_summary || article.summary)
  const [rewrittenContent, setRewrittenContent] = useState(article.rewritten_content || article.content)
  const [categories, setCategories] = useState<string[]>(article.categories || [])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  React.useEffect(() => {
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

  React.useEffect(() => {
    fetchAvailableCategories()
  }, [fetchAvailableCategories])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .update({
          rewritten_title: rewrittenTitle,
          rewritten_summary: rewrittenSummary,
          rewritten_content: rewrittenContent,
          categories: categories,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)
        .select()
        .single()

      if (error) throw error

      const updatedArticle = {
        ...article,
        rewritten_title: rewrittenTitle,
        rewritten_summary: rewrittenSummary,
        rewritten_content: rewrittenContent,
        categories: categories
      }
      
      onSave(updatedArticle)
      onClose()
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Failed to save article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAndApprove = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
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
        .select()
        .single()

      if (error) throw error

      const updatedArticle = {
        ...article,
        rewritten_title: rewrittenTitle,
        rewritten_summary: rewrittenSummary,
        rewritten_content: rewrittenContent,
        categories: categories,
        approved: true
      }
      
      onSave(updatedArticle)
      onClose()
    } catch (error) {
      console.error('Error saving and approving article:', error)
      alert('Failed to save and approve article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Article</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Original Title (Read-only)</label>
            <input
              type="text"
              value={article.title}
              readOnly
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Rewritten Title</label>
            <input
              type="text"
              value={rewrittenTitle}
              onChange={(e) => setRewrittenTitle(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Summary</label>
            <textarea
              value={rewrittenSummary}
              onChange={(e) => setRewrittenSummary(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Content</label>
            <textarea
              value={rewrittenContent}
              onChange={(e) => setRewrittenContent(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Categories</label>
            <CategoryManager
              categories={categories}
              onChange={setCategories}
              availableCategories={availableCategories}
              placeholder="Add category..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleSaveAndApprove}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArticleTable

interface ArticleTableProps {
  articles: NewsArticle[]
  type: 'pending' | 'approved'
}

export function ArticleTable({ articles, type }: ArticleTableProps) {
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [articleList, setArticleList] = useState<NewsArticle[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    setArticleList(articles)
  }, [articles])

  const handleApprove = async (articleId: number) => {
    setLoading(articleId.toString())
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ approved: true, updated_at: new Date().toISOString() })
        .eq('id', articleId)

      if (error) {
        console.error('Error approving article:', error)
        alert('Failed to approve article')
        return
      }

      // Update the article in the local state
      setArticleList(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, approved: true }
          : article
      ))
      alert('Article approved successfully!')
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to approve article')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (articleId: number) => {
    if (!confirm('Are you sure you want to reject this article? This action cannot be undone.')) {
      return
    }

    setLoading(articleId.toString())
    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        console.error('Error rejecting article:', error)
        alert('Failed to reject article')
        return
      }

      // Remove the article from the local state
      setArticleList(prev => prev.filter(article => article.id !== articleId))
      alert('Article rejected successfully!')
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to reject article')
    } finally {
      setLoading(null)
    }
  }

  const handleRevert = async (articleId: number) => {
    if (!confirm('Are you sure you want to revert this article to pending status?')) {
      return
    }

    setLoading(articleId.toString())
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ approved: false, updated_at: new Date().toISOString() })
        .eq('id', articleId)

      if (error) {
        console.error('Error reverting article:', error)
        alert('Failed to revert article')
        return
      }

      // Update the article in the local state
      setArticleList(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, approved: false }
          : article
      ))
      alert('Article reverted to pending status!')
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to revert article')
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (articleList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>No {type} articles found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {articleList.map((article) => (
              <tr key={article.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
                    >
                      Edit
                    </button>
                    
                    {type === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(article.id)}
                          disabled={loading === article.id.toString()}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors w-full"
                        >
                          {loading === article.id.toString() ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(article.id)}
                          disabled={loading === article.id.toString()}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors w-full"
                        >
                          {loading === article.id.toString() ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRevert(article.id)}
                        disabled={loading === article.id.toString()}
                        className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors w-full"
                      >
                        {loading === article.id.toString() ? 'Reverting...' : 'Revert'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-4">
                    {article.image_url && (
                      <Image 
                        src={article.image_url} 
                        alt={article.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {article.rewritten_title || article.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {article.rewritten_summary || article.summary}
                      </p>
                      {/* Categories */}
                      {article.categories && article.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>ID: {article.id}</span>
                        <span>{formatDate(article.created_at)}</span>
                        {article.source && (
                          <span className="text-blue-400">
                            {article.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300">
                    {article.source || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300">
                    {formatDate(article.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingArticle && (
        <EditModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSave={(updatedArticle: NewsArticle) => {
            setArticleList(prev => prev.map(article => 
              article.id === updatedArticle.id ? updatedArticle : article
            ))
            setEditingArticle(null)
          }}
        />
      )}
    </>
  )
}