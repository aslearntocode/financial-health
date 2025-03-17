'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { auth } from "@/lib/firebase"
import { supabase } from '@/lib/supabase'

interface Stock {
  stock_name: string
  ticker: string
  sector: string
  market_cap: string
  current_price: number
  '52w_low': number
  '52w_high': number
  pe_ratio: string
  dividend_yield: string
  risk_level: string
  rationale: string
}

export default function StockRecommendations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockRecommendationsContent />
    </Suspense>
  )
}

function StockRecommendationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [recommendations, setRecommendations] = useState<Stock[]>([])
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

        const { data: recommendation, error } = await supabase
          .from('stock_recommendations')
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Recommended Stocks</h1>
            <p className="text-gray-600 font-bold">Select 3 to 5 Stocks from Varied Risk Categories</p>
          </div>
          <button
            onClick={() => router.push('/investment')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Investment Allocation</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((stock, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Stock Header */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-start justify-between">
                  <div className="h-[60px] flex flex-col justify-start">
                    <h2 className="text-lg font-bold text-blue-600 leading-tight mb-2">{stock.stock_name}</h2>
                    <p className="text-sm text-gray-600">{stock.ticker}</p>
                  </div>
                  <div className={`px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    stock.risk_level.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                    stock.risk_level.toLowerCase() === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {stock.risk_level} Risk
                  </div>
                </div>
              </div>

              {/* Stock Details */}
              <div className="p-5">
                {/* Sector and Market Cap */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Sector</p>
                    <div className="h-[40px] flex items-center">
                      <p className="text-base font-bold leading-tight">{stock.sector}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Market Cap</p>
                    <div className="h-[40px] flex items-center">
                      <p className="text-base font-bold">{stock.market_cap}</p>
                    </div>
                  </div>
                </div>

                {/* Price Information */}
                <div className="mb-4">
                  <h3 className="text-gray-600 text-sm mb-2">Price Details</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-600 text-sm">Current Price</p>
                      <p className="text-lg font-bold text-blue-600">₹{stock.current_price.toLocaleString()}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      52-Week Range: 
                      <span className="font-medium ml-2">
                        ₹{stock['52w_low'].toLocaleString()} - ₹{stock['52w_high'].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mb-4">
                  <h3 className="text-gray-600 text-sm mb-2">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">P/E Ratio</p>
                      <p className="text-lg font-bold text-gray-700">{stock.pe_ratio}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Dividend Yield</p>
                      <p className="text-lg font-bold text-green-600">{stock.dividend_yield}</p>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="text-gray-600 text-sm mb-2">Why This Stock</h3>
                  <p className="text-gray-700 text-sm">{stock.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
