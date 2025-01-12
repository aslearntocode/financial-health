'use client'

import Header from "@/components/Header"

export default function RecommendationsPage() {
  return (
    <div>
      {/* Blue section with fixed height - updated color to match header */}
      <div className="bg-[#2563eb] h-[400px]">
        <Header />
        
        {/* Hero Section */}
        <div className="text-center text-white pt-20 px-4">
          <h1 className="text-5xl font-bold mb-6">Detailed Investment Plan</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find the right fund, stock etc. based on the portfolio distribution recommended
          </p>
        </div>
      </div>

      {/* White background section with cards */}
      <div className="bg-white">
        {/* Investment Options Grid */}
        <div className="max-w-7xl mx-auto px-4 py-20 -mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Mutual Funds Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Mutual Funds</h2>
              <p className="text-gray-600">
                Professionally managed investment funds that pool money from multiple investors 
                to purchase diversified portfolios of stocks, bonds, or other securities. 
                Ideal for long-term wealth creation with moderate risk.
              </p>
            </div>

            {/* Fixed Deposit Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Fixed Deposits</h2>
              <p className="text-gray-600">
                A secure investment option with guaranteed returns. Lock in your money for a 
                fixed period at a predetermined interest rate. Perfect for conservative 
                investors seeking stable returns.
              </p>
            </div>

            {/* Bonds Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Bonds</h2>
              <p className="text-gray-600">
                Debt instruments issued by governments or corporations offering fixed interest 
                payments. Provides regular income with lower risk compared to stocks. 
                Suitable for income-focused investors.
              </p>
            </div>

            {/* Gold ETFs Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Gold ETFs</h2>
              <p className="text-gray-600">
                Exchange-traded funds that track gold prices, offering a convenient way to 
                invest in gold without physical storage. Acts as a hedge against inflation 
                and market volatility.
              </p>
            </div>

            {/* Equity Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Equity</h2>
              <p className="text-gray-600">
                Direct investment in company stocks for potential high returns. Suitable for 
                investors with higher risk tolerance and longer investment horizons. 
                Offers growth potential through capital appreciation.
              </p>
            </div>

            {/* REITs Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">REITs</h2>
              <p className="text-gray-600">
                Real Estate Investment Trusts provide exposure to real estate markets without 
                direct property ownership. Offers regular income through rent collection and 
                potential property appreciation.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 