'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface MutualFund {
  fund_name: string
  category: string
  risk_level: string
  one_year_return: number
  three_year_return: number
  five_year_return: number
  min_investment: number
  expense_ratio: number
  recommendation_reason: string
  asset_allocation?: {
    equity: number
    debt: number
    others: number
  }
}

export default function MutualFundRecommendations() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<MutualFund[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const storedRecommendations = localStorage.getItem('mf_recommendations')
      if (!storedRecommendations) {
        router.push('/investment')
        return
      }

      const parsedRecommendations = JSON.parse(storedRecommendations)
      setRecommendations(parsedRecommendations)
      setLoading(false)
    } catch (err) {
      setError('Failed to load recommendations')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading recommendations...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => router.push('/investment')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Return to Investment Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Recommended Mutual Funds</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((fund, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-600">{fund.fund_name}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{fund.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Risk Level</span>
                  <span className={`font-medium ${
                    fund.risk_level.toLowerCase() === 'high' ? 'text-red-600' :
                    fund.risk_level.toLowerCase() === 'moderate' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{fund.risk_level}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h3 className="font-semibold mb-2">Historical Returns</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">1 Year</p>
                      <p className="font-bold text-green-600">{fund.one_year_return}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">3 Years</p>
                      <p className="font-bold text-green-600">{fund.three_year_return}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">5 Years</p>
                      <p className="font-bold text-green-600">{fund.five_year_return}%</p>
                    </div>
                  </div>
                </div>

                {fund.asset_allocation && (
                  <div className="border-t border-gray-200 pt-3">
                    <h3 className="font-semibold mb-2">Asset Allocation</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Equity</span>
                        <span className="font-medium">{fund.asset_allocation.equity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Debt</span>
                        <span className="font-medium">{fund.asset_allocation.debt}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Others</span>
                        <span className="font-medium">{fund.asset_allocation.others}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 