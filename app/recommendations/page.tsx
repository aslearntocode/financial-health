'use client'

import Header from "@/components/Header"
import { useRouter } from 'next/navigation'

export default function RecommendationsPage() {
  const router = useRouter()

  const investmentTypes = [
    {
      title: "Mutual Funds",
      description: "Professionally managed investment funds that pool money from multiple investors to purchase diversified portfolios of stocks, bonds, or other securities. Ideal for long-term wealth creation with moderate risk.",
      route: "/recommendations/mutual-funds"
    },
    {
      title: "Fixed Deposits",
      description: "A secure investment option with guaranteed returns. Lock in your money for a fixed period at a predetermined interest rate. Perfect for conservative investors seeking stable returns.",
      route: "/recommendations/fixed-deposits"
    },
    {
      title: "Bonds",
      description: "Debt instruments issued by governments or corporations offering fixed interest payments. Provides regular income with lower risk compared to stocks. Suitable for income-focused investors.",
      route: "/recommendations/bonds"
    },
    {
      title: "Gold ETFs",
      description: "Exchange-traded funds that track gold prices, offering a convenient way to invest in gold without physical storage. Acts as a hedge against inflation and market volatility.",
      route: "/recommendations/gold-etfs"
    },
    {
      title: "Equity",
      description: "Direct investment in company stocks for potential high returns. Suitable for investors with higher risk tolerance and longer investment horizons. Offers growth potential through capital appreciation.",
      route: "/recommendations/equity"
    },
    {
      title: "REITs",
      description: "Real Estate Investment Trusts provide exposure to real estate markets without direct property ownership. Offers regular income through rent collection and potential property appreciation.",
      route: "/recommendations/reits"
    }
  ]

  return (
    <div>
      {/* Blue section with fixed height */}
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
            
            {investmentTypes.map((investment, index) => (
              <div
                key={index}
                onClick={() => router.push(investment.route)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <h2 className="text-2xl font-bold mb-4">{investment.title}</h2>
                <p className="text-gray-600">
                  {investment.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
} 