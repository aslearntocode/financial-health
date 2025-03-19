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
  price_at_recommendation?: number
  '52w_low': number
  '52w_high': number
  pe_ratio: string
  dividend_yield: string
  risk_level: string
  rationale: string
}

interface StockRecommendation {
  id: string;
  created_at: string;
  recommendations: Stock[];
  historical_prices?: { ticker: string; price: number }[];
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
  const [recommendationData, setRecommendationData] = useState<StockRecommendation | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      const maxRetries = 3;
      let currentTry = 0;

      while (currentTry < maxRetries) {
        try {
          const user = auth.currentUser;
          if (!user) {
            router.push('/login');
            return;
          }

          const recommendationId = searchParams.get('id');
          if (!recommendationId) {
            router.push('/investment');
            return;
          }

          // Add timeout to the Supabase query with proper typing
          const { data: recommendation, error } = await Promise.race([
            supabase
              .from('stock_recommendations')
              .select('*')
              .eq('id', recommendationId)
              .eq('user_id', user.uid)
              .single()
              .then((response): { data: StockRecommendation | null; error: any } => response),
            new Promise<{ data: StockRecommendation | null; error: any }>((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 15000)
            )
          ]);

          if (error) throw error;

          if (!recommendation) {
            console.error('No recommendation found for ID:', recommendationId);
            router.push('/investment');
            return;
          }

          setRecommendationData(recommendation);
          setRecommendations(recommendation.recommendations);
          setLoading(false);
          return; // Success, exit the retry loop

        } catch (err) {
          currentTry++;
          console.error(`Attempt ${currentTry} failed:`, err);
          
          if (currentTry === maxRetries) {
            setError('Unable to load recommendations. Please try again later.');
            setLoading(false);
          } else {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, currentTry)));
          }
        }
      }
    };

    fetchRecommendations();
  }, [router, searchParams]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Recommended Stocks</h1>
              {recommendationData?.created_at && (
                <span className="text-sm text-gray-600">
                  Generated on: {new Date(recommendationData.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-gray-600 font-bold mt-2">Select 3 to 5 Stocks from Varied Risk Categories</p>
          </div>
          <button
            onClick={() => router.push('/investment')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Investment Allocation</span>
          </button>
        </div>

        <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Stock Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Sector & Risk</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Key Metrics</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Market Cap</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Buy Recommendation Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Sell Recommendation Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Performance Since Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recommendations.map((stock, index) => {
                const priceChange = stock.price_at_recommendation && stock.current_price
                  ? ((stock.current_price - stock.price_at_recommendation) / stock.price_at_recommendation) * 100
                  : null;

                return (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-900 mb-1">{stock.stock_name}</div>
                      <div className="text-sm text-blue-600">{stock.ticker}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 mb-2">{stock.sector}</div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        stock.risk_level.toLowerCase() === 'high' 
                          ? 'bg-red-100 text-red-800 border border-red-200' :
                        stock.risk_level.toLowerCase() === 'moderate' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {stock.risk_level} Risk
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <span className="text-gray-600">P/E:</span>
                          <span className="ml-2 font-medium text-gray-900">{stock.pe_ratio}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600">Dividend:</span>
                          <span className="ml-2 font-medium text-gray-900">{stock.dividend_yield}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        stock.market_cap.toLowerCase().includes('large') 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        stock.market_cap.toLowerCase().includes('mid') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {stock.market_cap} Cap
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {recommendationData?.created_at && (
                        <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                          {new Date(recommendationData.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                        NA
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {priceChange !== null ? (
                        <div className="space-y-1">
                          <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                            <div className="flex justify-between">
                              <span>Current:</span>
                              <span className="font-medium">₹{stock.current_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Initial:</span>
                              <span className="font-medium">₹{stock.price_at_recommendation?.toFixed(2)}</span>
                            </div>
                            {recommendationData?.historical_prices && (
                              <div className="flex justify-between mt-1">
                                <span>EOD Price:</span>
                                <span className="font-medium">
                                  ₹{recommendationData.historical_prices
                                    .find(hp => hp.ticker === stock.ticker)
                                    ?.price?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Price data unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center py-4 text-sm text-gray-600 border-t border-gray-200">
        Powered by Financial Health
      </div>
    </div>
  )
}
