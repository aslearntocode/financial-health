'use client'

import Header from '@/components/Header'

function InvestmentOptionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-blue-600 text-xl md:text-2xl font-extrabold mb-4">
              Personal Finance
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 leading-tight whitespace-nowrap overflow-x-auto">
              Investment Options for <span className="text-blue-600 inline whitespace-nowrap">Retail Investors in India</span>
            </h1>
            <div className="text-gray-600 text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2 min read
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <p className="text-lg leading-relaxed">
                For a comprehensive guide on investment options in India, we recommend reading this excellent article on Groww:{' '}
                <a 
                  href="https://groww.in/blog/best-investment-options-in-india" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Best Investment Options in India
                </a>
              </p>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              As a retail investor in India, you have access to various investment options that can help you achieve your financial goals. 
              Each investment type comes with its own risk-return profile and is suitable for different investment horizons.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Key Investment Categories</h2>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Fixed Income Investments</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Fixed Deposits:</span>
                Safe investments with guaranteed returns
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Public Provident Fund (PPF):</span>
                Government-backed long-term savings scheme
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Government Bonds:</span>
                Low-risk debt instruments issued by the government
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Corporate Bonds:</span>
                Debt securities issued by companies
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Market-Linked Investments</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Stocks:</span>
                Direct equity investments in companies
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Mutual Funds:</span>
                Professionally managed investment portfolios
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">ETFs:</span>
                Exchange-traded funds that track indices
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Index Funds:</span>
                Passive funds tracking market indices
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Alternative Investments</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Real Estate:</span>
                Property investments for rental income and appreciation
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">REITs:</span>
                Real Estate Investment Trusts for property exposure
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Gold:</span>
                Physical gold, gold ETFs, and Sovereign Gold Bonds
              </li>
            </ul>

            <div className="bg-gray-50 rounded-lg p-6 mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Note</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                All investments carry some form of risk. It's important to understand these risks and consult with a 
                financial advisor before making investment decisions. The information provided here is for educational 
                purposes only and should not be considered as financial advice.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

export default InvestmentOptionsPage 