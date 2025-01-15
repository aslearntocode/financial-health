'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'

type Article = {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  link: string
}

const articles: Article[] = [
  {
    id: '1',
    title: "Understanding Mutual Funds: A Beginner's Guide",
    description: "Learn the basics of mutual funds, how they work, and why they're a popular investment choice.",
    category: 'Mutual Funds',
    readTime: '5 min read',
    link: '/learning-center/mutual-funds/beginners-guide'
  },
  {
    id: '2',
    title: 'Types of Mutual Funds: Which One is Right for You?',
    description: 'Explore different types of mutual funds and how to choose the best one for your investment goals.',
    category: 'Mutual Funds',
    readTime: '7 min read',
    link: '/learning-center/mutual-funds/types'
  },
  {
    id: '3',
    title: 'Introduction to Stock Market Investing',
    description: 'Get started with stock market basics, understanding indices, and fundamental analysis.',
    category: 'Equity',
    readTime: '6 min read',
    link: '/learning-center/equity/intro'
  },
  {
    id: '4',
    title: 'Fixed Deposits vs. Debt Funds',
    description: 'Compare traditional FDs with debt mutual funds to make informed investment decisions.',
    category: 'Fixed Deposits',
    readTime: '4 min read',
    link: '/learning-center/fixed-deposits/comparison'
  }
]

function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const categories = ['all', ...new Set(articles.map(article => article.category))]
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Center</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map(article => (
              <Link href={article.link} key={article.id}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    {article.category}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {article.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {article.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LearningCenter 