'use client'

import Header from '@/components/Header'

// import { Metadata } from "next";
// import { Article } from "@/components/Article";

// export const metadata: Metadata = {
//   title: "Types of Mutual Funds: Which One is Right for You?",
//   description: "Learn about different types of mutual funds and how to choose the right one for your investment goals. Understand equity funds, debt funds, hybrid funds, and more.",
// };

function MutualFundTypes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-blue-600 text-xl md:text-2xl font-extrabold mb-4">
              Mutual Funds
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 leading-tight whitespace-nowrap overflow-x-auto">
              Types of Mutual Funds: <span className="text-blue-600 inline whitespace-nowrap">Which One is Right for You?</span>
            </h1>
            <div className="text-gray-600 text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7 min read
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Investing in mutual funds is a great way to grow wealth, but with so many options available, choosing the right one can be overwhelming. Understanding the different types of mutual funds and how they align with your financial goals is crucial. In this article, we break down the major types of mutual funds to help you make an informed decision.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Equity Mutual Funds</h2>
            <p className="text-lg leading-relaxed mb-4">
              Equity mutual funds primarily invest in stocks. They offer high growth potential but come with higher risk. They are best suited for long-term investors who can tolerate market fluctuations.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Large-Cap Funds:</span>
                Invest in well-established companies with stable returns
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Mid-Cap & Small-Cap Funds:</span>
                Higher risk but greater growth potential
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Sectoral/Thematic Funds:</span>
                Focus on specific industries like technology, healthcare, or finance
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Debt Mutual Funds</h2>
            <p className="text-lg leading-relaxed mb-4">
              Debt funds invest in fixed-income securities like bonds and treasury bills. They are ideal for conservative investors looking for stability and regular income.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Liquid Funds:</span>
                Short-term investments with high liquidity, ideal for parking surplus cash
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Corporate Bond Funds:</span>
                Invest in high-rated corporate bonds, offering better returns than savings accounts
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Gilt Funds:</span>
                Invest in government securities, ensuring high safety but moderate returns
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Hybrid Mutual Funds</h2>
            <p className="text-lg leading-relaxed mb-4">
              Hybrid funds offer a mix of equity and debt, balancing risk and reward. They are suitable for moderate-risk investors.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Aggressive Hybrid Funds:</span>
                Higher equity allocation for better growth
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Conservative Hybrid Funds:</span>
                Focus more on debt instruments for stability
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Balanced Advantage Funds:</span>
                Adjust asset allocation dynamically based on market conditions
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Index Funds & ETFs</h2>
            <p className="text-lg leading-relaxed mb-4">
              These funds passively track a market index like the NIFTY 50 or S&P 500. They have lower costs and are suitable for investors who prefer a hands-off approach.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Index Funds:</span>
                Mimic the performance of a benchmark index
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Exchange-Traded Funds (ETFs):</span>
                Trade like stocks on an exchange and offer better liquidity
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Tax-Saving Mutual Funds (ELSS)</h2>
            <p className="text-lg leading-relaxed mb-8">
              Equity-Linked Savings Schemes (ELSS) are the best option for tax-saving under Section 80C of the Income Tax Act. They have a lock-in period of three years and offer the potential for high returns.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Choosing the Right Mutual Fund</h2>
            <p className="text-lg leading-relaxed mb-4">
              Consider these factors before investing:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Investment Goal: Are you saving for retirement, a house, or short-term expenses?
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Risk Tolerance: Can you handle market fluctuations?
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Time Horizon: How long can you stay invested?
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                Liquidity Needs: Do you need quick access to your money?
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
            <p className="text-lg leading-relaxed mb-8">
              Mutual funds cater to different investor needs, from aggressive wealth building to stable income generation. By understanding your financial goals and risk appetite, you can choose the right type of mutual fund to maximize your investment potential.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">Looking for personalized investment advice? Start exploring today!</p>
          </div>
        </article>
      </main>
    </div>
  )
} 

export default MutualFundTypes