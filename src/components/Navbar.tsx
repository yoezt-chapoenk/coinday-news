'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/articles';
import type { Category } from '@/lib/types';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="https://ik.imagekit.io/coinday/coinday.io-logo-2.png?updatedAt=1753990031399" 
              alt="Coinday Logo" 
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold text-white">Coinday</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-white hover:text-gray-300 transition-colors duration-200 font-medium flex items-center space-x-1">
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {isLoading ? (
                  <div className="px-4 py-3 text-gray-400 text-sm">
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-gray-400 text-sm">({category.count})</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-sm">
                    No categories found
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              href="/search" 
              className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
            >
              Search
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-gray-300 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="py-4 space-y-4">
              <Link 
                href="/" 
                className="block text-white hover:text-gray-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <span className="block text-gray-400 font-medium text-sm uppercase tracking-wider">Categories</span>
                {isLoading ? (
                  <div className="pl-4 text-gray-400 text-sm">
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block pl-4 text-white hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-gray-400 text-sm">({category.count})</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="pl-4 text-gray-400 text-sm">
                    No categories found
                  </div>
                )}
              </div>
              
              <Link 
                href="/search" 
                className="block text-white hover:text-gray-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;