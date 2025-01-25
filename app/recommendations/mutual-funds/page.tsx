'use client'

import Header from "@/components/Header"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function MutualFundsPage() {
  const router = useRouter()
  const [funds, setFunds] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const fetchLatestInvestmentData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching investment data:', error)
        if (error.code === 'PGRST116') { // No data found
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in fetchLatestInvestmentData:', error)
      throw error
    }
  }

  const fetchMutualFunds = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please log in to continue')
        router.push('/login')
        return
      }

      // Fetch latest investment data from Supabase
      const { data: investmentData, error: fetchError } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !investmentData) {
        setError('Please complete your investment profile first')
        router.push('/investment')
        return
      }

      // Make API call with the investment data
      const response = await fetch('http://172.210.82.112:5000/api/mutual-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: investmentData.age,
          current_savings: investmentData.current_savings,
          monthly_savings: investmentData.monthly_savings,
          investment_horizon: investmentData.investment_horizon,
          financial_goal: investmentData.financial_goal,
          has_emergency_fund: investmentData.has_emergency_fund,
          needs_money_during_horizon: investmentData.needs_money_during_horizon,
          has_investment_experience: investmentData.has_investment_experience,
          risk_score: investmentData.risk_score,
          allocation: investmentData.allocation
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setFunds(data)
      await saveMutualFundRecommendations(data.recommendations)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch mutual fund recommendations')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchMutualFunds()
  }, [])

  const saveMutualFundRecommendations = async (recommendations: any[]) => {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('mutual_fund_recommendations')
        .upsert(
          recommendations.map(fund => ({
            user_id: user.id,
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
      console.log('Recommendations saved successfully:', data)
    } catch (error) {
      console.error('Error saving recommendations:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    console.log('Funds state:', funds)
    console.log('Error state:', error)
    console.log('Loading state:', loading)
  }, [funds, error, loading])

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
            <h2 className="text-2xl font-bold">Top Recommended Mutual Funds</h2>
            {isSaving && (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Saving recommendations...</span>
              </div>
            )}
          </div>
          
          {/* Display loading, error, or mutual funds data */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-gray-600">Loading recommendations...</span>
              </div>
            ) : error ? (
              <div className="text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {funds?.recommendations?.map((fund, index) => (
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
              onClick={() => router.back()}
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
    </div>
  )
} 