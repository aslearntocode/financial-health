'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { auth } from "@/lib/firebase"
import { supabase } from '@/lib/supabase'

interface MutualFund {
  fund_name: string
  category: string
  risk_level: string
  returns_3yr: string
  returns_5yr: string
  min_investment: number
  expense_ratio: string
  rationale: string
  fund_house: string
  asset_allocation?: {
    equity: number
    debt: number
    others: number
  }
}

export default function MutualFundRecommendations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MutualFundRecommendationsContent />
    </Suspense>
  )
}

function MutualFundRecommendationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [recommendations, setRecommendations] = useState<MutualFund[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          router.push('/login')
          return
        }

        const recommendationId = searchParams.get('id')
        if (!recommendationId) {
          router.push('/investment')
          return
        }

        console.log('Fetching recommendation with ID:', recommendationId)

        const { data: recommendation, error } = await supabase
          .from('mutual_fund_recommendations')
          .select('recommendations')
          .eq('id', recommendationId)
          .eq('user_id', user.uid)
          .single()

        if (error) {
          console.error('Error fetching recommendation:', error)
          setError('Failed to load recommendations')
          setLoading(false)
          return
        }

        if (!recommendation) {
          console.log('No recommendation found')
          router.push('/investment')
          return
        }

        console.log('Fetched recommendation:', recommendation)
        setRecommendations(recommendation.recommendations)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load recommendations')
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [router, searchParams])

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Recommended Mutual Funds</h1>
        <p className="text-gray-600 font-bold mb-8">Select 2 to 3 Mutual Funds from Varied Risk Categories</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((fund, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Fund Header */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-start justify-between">
                  <div className="h-[60px] flex flex-col justify-start">
                    <h2 className="text-lg font-bold text-blue-600 leading-tight mb-2">{fund.fund_name}</h2>
                    <p className="text-sm text-gray-600">{fund.fund_house}</p>
                  </div>
                  <div className={`px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    fund.risk_level.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                    fund.risk_level.toLowerCase() === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {fund.risk_level} Risk
                  </div>
                </div>
              </div>

              {/* Fund Details */}
              <div className="p-5">
                {/* Category and Expense Ratio */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Category</p>
                    <div className="h-[40px] flex items-center">
                      <p className="text-base font-bold leading-tight">{fund.category}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Expense Ratio</p>
                    <div className="h-[40px] flex items-center">
                      <p className="text-base font-bold">{fund.expense_ratio}</p>
                    </div>
                  </div>
                </div>

                {/* Historical Returns */}
                <div className="mb-4">
                  <h3 className="text-gray-600 text-sm mb-2">Historical Returns</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">3 Years</p>
                      <p className="text-lg font-bold text-green-600">{fund.returns_3yr}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">5 Years</p>
                      <p className="text-lg font-bold text-green-600">{fund.returns_5yr}</p>
                    </div>
                  </div>
                </div>

                {/* Minimum Investment */}
                <div className="flex justify-between items-center py-3 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">Minimum Investment</p>
                  <p className="text-base font-bold">₹{fund.min_investment.toLocaleString()}</p>
                </div>

                {/* Rationale */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600 italic text-sm">"{fund.rationale}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 