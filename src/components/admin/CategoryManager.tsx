'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface CategoryManagerProps {
  categories: string[]
  onChange: (categories: string[]) => void
  availableCategories?: string[]
  placeholder?: string
}

export default function CategoryManager({
  categories,
  onChange,
  availableCategories = [],
  placeholder = "Add category..."
}: CategoryManagerProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableCategories.filter(cat => 
        cat.toLowerCase().includes(inputValue.toLowerCase()) &&
        !categories.includes(cat)
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue, availableCategories, categories])

  const addCategory = (category: string) => {
    const trimmedCategory = category.trim()
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      onChange([...categories, trimmedCategory])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeCategory = (categoryToRemove: string) => {
    onChange(categories.filter(cat => cat !== categoryToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addCategory(inputValue)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setInputValue('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    addCategory(suggestion)
  }

  return (
    <div className="space-y-3">
      {/* Category Tags */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="ml-1 hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${category} category`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue.trim() && filteredSuggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                addCategory(inputValue)
              }
            }}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-400">
        Press Enter to add a category, or click suggestions from the dropdown
      </p>
    </div>
  )
}