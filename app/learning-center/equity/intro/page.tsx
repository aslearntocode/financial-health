'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'

export default function EquityIntro() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Introduction to Stock Market Investing in India</h1>
          <div className="flex items-center text-sm">
            <span className="mr-4">5 min read</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">Beginner</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The stock market is a platform where buyers and sellers trade stocks, or shares, of companies. In India, investing in the stock market has become an increasingly popular way to build wealth, driven by the country's growing economy, emerging industries, and the ease of access through digital platforms.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">1. Understanding the Basics of the Stock Market</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <p className="text-gray-700 leading-relaxed">
            The Indian stock market consists of two major exchanges: the Bombay Stock Exchange (BSE) and the National Stock Exchange (NSE). These exchanges provide a regulated marketplace for investors to buy and sell stocks.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">2. Types of Stocks and Investment Strategies</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Primary Types of Stocks:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Blue-chip stocks: Shares of large, well-established companies</li>
              <li>Growth stocks: Companies expected to grow at above-average rates</li>
            </ul>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">Investment Strategies:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Long-term investing</li>
              <li>Short-term trading</li>
              <li>Dividend investing</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">3. Getting Started</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-100 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Key Steps:</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</span>
              <div>
                <span className="font-semibold text-gray-800">Open a Demat and Trading Account</span>
                <p className="text-gray-600 mt-1">Essential for holding and trading stocks electronically</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</span>
              <div>
                <span className="font-semibold text-gray-800">Select a Broker</span>
                <p className="text-gray-600 mt-1">Choose from traditional or discount brokers based on your needs</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</span>
              <div>
                <span className="font-semibold text-gray-800">Understand the Costs</span>
                <p className="text-gray-600 mt-1">Be aware of brokerage fees, taxes, and other charges</p>
              </div>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">4. Risk and Reward</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Stock market investing involves both risk and reward. The value of stocks can rise or fall based on various factors, including company performance, industry trends, economic conditions, and market sentiment.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">5. Diversification</h2>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-8">
          <p className="text-gray-700 leading-relaxed">
            One way to manage risk in the stock market is through diversification. By spreading your investments across different sectors, asset classes, or even geographic regions, you reduce the impact of any single underperforming stock.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">6. Research and Analysis</h2>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">Key Metrics to Consider:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800">P/E Ratio</h4>
              <p className="text-gray-600 text-sm">Price-to-Earnings ratio</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800">EPS</h4>
              <p className="text-gray-600 text-sm">Earnings Per Share</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800">ROE</h4>
              <p className="text-gray-600 text-sm">Return on Equity</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">7. Regulations and Protection</h2>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 mb-8">
          <p className="text-gray-700 leading-relaxed">
            The Securities and Exchange Board of India (SEBI) oversees the functioning of stock exchanges in India, ensuring fair and transparent markets.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">8. Conclusion</h2>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100">
          <p className="text-gray-700 leading-relaxed">
            Stock market investing in India offers great potential for wealth creation but requires patience, knowledge, and a sound strategy. Always remember, the stock market rewards discipline and long-term thinking.
          </p>
        </div>
      </div>
    </div>
  )
} 