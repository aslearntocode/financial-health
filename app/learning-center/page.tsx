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
  },
  {
    id: '10',
    title: 'Credit Cards: Understand Interest Calculation',
    description: 'Learn how the banks calculate the interest on your credit card.',
    category: 'Credit Cards',
    readTime: '15 min read',
    link: '/learning-center/credit-cards/interest-calculation'
  },
  {
    id: '11',
    title: 'Credit Card Rewards Explained',
    description: 'Understanding credit card rewards programs, points, cashback, and how to maximize your benefits.',
    category: 'Credit Cards',
    readTime: '7 min read',
    link: '/learning-center/credit-cards/rewards'
  },
  {
    id: '12',
    title: 'Personal Loan: The Interest You Pay',
    description: 'Learn how interest rate, tenure and loan amount impact the interest paid and principal repayment.',
    category: 'Personal Loans',
    readTime: '10 min read',
    link: '/learning-center/personal-loans/payment'
  },
  {
    id: '13',
    title: 'Auto Loans: Tips for First-Time Borrowers',
    description: 'Understanding auto loans, comparing offers, and getting the best deal on your car financing.',
    category: 'Auto Loans',
    readTime: '6 min read',
    link: '/learning-center/auto-loans/first-time'
  },
  {
    id: '14',
    title: 'Home Loan Basics: A Complete Guide',
    description: 'Everything you need to know about home loans, mortgage types, and the application process.',
    category: 'Home Loans',
    readTime: '12 min read',
    link: '/learning-center/home-loans/basics'
  },
  {
    id: '15',
    title: 'Why Having Too Many Credit Cards Is Not Recommended',
    description: 'Learn about the hidden financial impacts of having multiple credit cards and best practices for managing credit wisely.',
    category: 'Credit Cards',
    readTime: '10 min read',
    link: '/learning-center/credit-cards/number-of-cards'
  },
  {
    id: '16',
    title: 'Understanding Your Risk Profile',
    description: 'Learn about lenders build risk scores for lending products such as Credit Cards, Peronal Loans, Home Loans etc. and how they affect your applications.',
    category: 'Credit Cards',
    readTime: '20 min read',
    link: '/learning-center/credit-cards/risk-profile'
  },{
    id: '17',
    title: 'Comparing Fixed Deposits and Personal Loans',
    description: 'Decide Between Breaking a FD and using the Proceeds or taking a Personal Loan?',
    category: 'Personal Finance',
    readTime: '10 min read',
    link: '/learning-center/personal-finance/comparison'
  },{
    id: '18',
    title: 'Taxable Income: How to Calculate Your Taxable Income',
    description: 'Learn how to calculate your taxable income and understand the different components of your income.',
    category: 'Personal Finance',
    readTime: '10 min read',
    link: '/learning-center/personal-finance/taxable-income'
  }

]

function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const categories = ['all', ...new Set(articles.map(article => article.category))]
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setIsMobileMenuOpen(false) // Close mobile menu after selection
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive guides and articles to enhance your investment knowledge
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Category Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Category Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute z-50 mt-2 w-[calc(100%-2rem)] bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`
                        w-full px-4 py-3 text-left transition-colors duration-200
                        ${selectedCategory === category
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Category Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md transform translate-x-2'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }
                        ${selectedCategory === category ? 'font-medium' : 'font-normal'}
                      `}
                    >
                      {category === 'all' ? 'All Categories' : category}
                      {selectedCategory === category && (
                        <span className="float-right">→</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredArticles.map(article => (
                  <Link href={article.link} key={article.id}>
                    <div className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                      <div className="inline-block px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-50 mb-4 self-start">
                        {article.category}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-base text-gray-600 mb-4 flex-grow line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {article.readTime}
                        </span>
                        <span className="text-blue-600 text-sm font-medium">Read more →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LearningCenter 