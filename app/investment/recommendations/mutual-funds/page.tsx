'use client'

import Header from "@/components/Header"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Add interface definitions at the top of the file
interface MutualFund {
  fund_name: string;
  fund_house: string;
  category: string;
  fund_manager: string;
  min_investment: number;
  expense_ratio: number;
  returns_3yr: number;
  returns_5yr: number;
  risk_level: 'High' | 'Moderate' | 'Low';
  rationale: string;
}

interface FundsData {
  recommendations: MutualFund[];
}

export default function MutualFundsPage() {
  const router = useRouter()
  const [funds, setFunds] = useState<FundsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleMutualFundsClick = async () => {
    try {
      setLoading(true)
      setError(null)

      // Directly fetch the most recent investment data without auth check
      const { data: investmentData, error: fetchError } = await supabase
        .from('investment_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // if (fetchError) {
      //   console.error('Error fetching investment data:', fetchError)
      //   setError('Unable to fetch investment data. Please try again.')
      //   return
      // }

      // if (!investmentData) {
      //   setError('Please complete your investment profile first')
      //   router.push('/investment')
      //   return
      // }

      // Make direct API call
      const response = await fetch('http://172.210.82.112:5000/api/mutual-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setFunds(data)
      
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch mutual fund recommendations')
    } finally {
      setLoading(false)
    }
  }

  const saveMutualFundRecommendations = async (recommendations: MutualFund[]) => {
    try {
      setIsSaving(true)
      
      const { error } = await supabase
        .from('mutual_fund_recommendations')
        .upsert(
          recommendations.map(fund => ({
            fund_name: fund.fund_name,
            fund_house: fund.fund_house,
            category: fund.category,
            fund_manager: fund.fund_manager,
            min_investment: fund.min_investment,
            expense_ratio: parseFloat(fund.expense_ratio),
            returns_3yr: parseFloat(fund.returns_3yr),
            returns_5yr: parseFloat(fund.returns_5yr),
            risk_level: fund.risk_level,
            rationale: fund.rationale
          }))
        )

      if (error) throw error
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    console.log('Funds state:', funds)
    console.log('Error state:', error)
    console.log('Loading state:', loading)
  }, [funds, error, loading])

  const handleBackClick = () => {
    if (isSaving) return;
    router.push('/investment/recommendations');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#2563eb] h-[300px]">
        <Header />
        
        {/* Hero Section */}
        <div className="text-center text-white pt-16 px-4">
          <h1 className="text-4xl font-bold mb-4">Mutual Funds</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore recommended mutual funds based on your investment profile
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 -mt-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mutual Fund Recommendations</h2>
          </div>
          
          {/* Add button to trigger recommendations */}
          <button
            onClick={handleMutualFundsClick}
            disabled={loading}
            className={`w-full mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Fetching Recommendations...' : 'Get Recommendations'}
          </button>

          {/* Display error if any */}
          {error && (
            <div className="text-red-600 mb-4">
              {error}
            </div>
          )}

          {/* Display funds if available */}
          {funds?.recommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {funds.recommendations.map((fund: MutualFund, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600">{fund.fund_name}</h3>
                      <p className="text-gray-600 mt-1">{fund.fund_house}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      fund.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                      fund.risk_level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fund.risk_level}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{fund.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fund Manager</p>
                      <p className="font-medium">{fund.fund_manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Min Investment</p>
                      <p className="font-medium">₹{fund.min_investment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expense Ratio</p>
                      <p className="font-medium">{fund.expense_ratio}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="text-sm text-gray-500">3Y Returns</p>
                      <p className="font-semibold text-green-600">{fund.returns_3yr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">5Y Returns</p>
                      <p className="font-semibold text-green-600">{fund.returns_5yr}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">{fund.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {/* Back button */}
          <button
            onClick={handleBackClick}
            disabled={isSaving}
            className={`mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    </div>
  )
} 