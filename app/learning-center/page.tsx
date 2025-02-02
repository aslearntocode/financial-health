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
    description: "Learn the basics of mutual funds, how they work, and why they're a popular investment choice for both new and experienced investors.",
    category: 'Mutual Funds',
    readTime: '5 min read',
    link: '/learning-center/mutual-funds/beginners-guide'
  },
  {
    id: '2',
    title: 'Types of Mutual Funds: Which One is Right for You?',
    description: 'Explore different types of mutual funds and how to choose the best one for your investment goals. Compare options to make informed decisions.',
    category: 'Mutual Funds',
    readTime: '7 min read',
    link: '/learning-center/mutual-funds/types'
  },
  {
    id: '3',
    title: 'Introduction to Stock Market Investing',
    description: 'Get started with stock market basics, understanding indices, and fundamental analysis. Learn how to build a strong investment foundation.',
    category: 'Equity',
    readTime: '6 min read',
    link: '/learning-center/equity/intro'
  },
  {
    id: '4',
    title: 'Fixed Deposits vs. Debt Funds',
    description: 'Compare traditional FDs with debt mutual funds to make informed investment decisions. Understand the pros and cons of each option.',
    category: 'Fixed Deposits',
    readTime: '4 min read',
    link: '/learning-center/fixed-deposits/comparison'
  },
  {
    id: '5',
    title: 'REITs: A Guide to Real Estate Investment Trusts',
    description: 'Understand how REITs work, their benefits, and how to invest in them. Learn about this accessible way to invest in real estate markets.',
    category: 'Real Estate',
    readTime: '10 min read',
    link: '/learning-center/real-estate/reits'
  },
  {
    id: '6',
    title: 'A Comprehensive Guide to REIT Investments in India',
    description: 'Discover how to invest in Indian REITs, understand their structure, benefits, and risks. Learn about professional real estate investment options.',
    category: 'Real Estate',
    readTime: '8 min read',
    link: '/learning-center/real-estate/reit-guide'
  },
  {
    id: '7',
    title: 'Investment Options for Retail Investors in India',
    description: 'Understand what financial instruments you can invest in India for long term wealth creation. For a comprehensive guide, we recommend reading this excellent article on Groww: https://groww.in/blog/best-investment-options-in-india',
    category: 'Personal Finance',
    readTime: '8 min read',
    link: '/learning-center/personal-finance/investment-options'
  },
  {
    id: '8',
    title: 'Understanding Risk and Return',
    description: 'Learn about the relationship between risk and return, and how to balance them in your investment portfolio.',
    category: 'Personal Finance',
    readTime: '6 min read',
    link: '/learning-center/personal-finance/risk-return'
  },
  {
    id: '9',
    title: 'How to Invest in SIP?',
    description: 'Learn how to start investing in SIPs and make your money work for you.',
    category: 'Personal Finance',
    readTime: '15 min read',
    link: '/learning-center/personal-finance/sip'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map(article => (
              <Link href={article.link} key={article.id}>
                <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="text-sm font-medium text-blue-600 mb-2">
                    {article.category}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-base text-gray-600 mb-4 flex-grow">
                    {article.description}
                  </p>
                  <div className="text-sm text-gray-500">
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