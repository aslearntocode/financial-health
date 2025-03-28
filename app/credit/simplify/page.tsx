'use client'

import Header from "@/components/Header"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"

interface Account {
  account_type: string;
  account_number: string;
  credit_grantor: string;
  lender: string;
  status: string;
  current_balance: number;
  credit_limit?: number;
  interest_rate?: number;
}

export default function SimplifyFinancesPage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<'consolidation' | 'refinance' | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const user = auth.currentUser
        if (!user) {
          setError('Please login to view your options')
          setIsLoading(false)
          return
        }

        const { data, error: supabaseError } = await supabase
          .from('credit_reports')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (supabaseError) {
          throw new Error('Failed to fetch report data')
        }

        if (!data) {
          setError('No report found')
          setIsLoading(false)
          return
        }

        setReportData(data.report_analysis)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching report:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your financial options...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button 
              onClick={() => router.push('/credit/score')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeAccounts = reportData?.accounts?.active || []
  const totalDebt = activeAccounts.reduce((sum: number, account: Account) => 
    sum + (account.current_balance || 0), 0
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Simplify Your Finances
          </h1>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => router.push('/credit/score/report')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 
                bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              <span>Back to Report</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Option Selection */}
            {!selectedOption && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => setSelectedOption('consolidation')}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">Debt Consolidation</h3>
                  <p className="text-gray-600">Combine multiple loans into a single payment with potentially lower interest rates.</p>
                </button>
                
                <button
                  onClick={() => setSelectedOption('refinance')}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">Refinance</h3>
                  <p className="text-gray-600">Get better interest rates on your existing loans.</p>
                </button>
              </div>
            )}

            {/* Account Summary */}
            {selectedOption && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedOption === 'consolidation' ? 'Debt Consolidation Overview' : 'Refinance Options'}
                  </h2>
                  
                  <div className="mb-6">
                    <p className="text-lg mb-2">Total Outstanding Debt: ₹{totalDebt.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4">
                    {activeAccounts.map((account: Account, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{account.credit_grantor}</p>
                            <p className="text-sm text-gray-600">Type: {account.account_type}</p>
                            <p className="text-sm text-gray-600">Balance: ₹{account.current_balance?.toLocaleString()}</p>
                            {account.interest_rate && (
                              <p className="text-sm text-gray-600">Interest Rate: {account.interest_rate}%</p>
                            )}
                          </div>
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 text-purple-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedOption(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => router.push(`/credit/${selectedOption}`)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                        transition-colors shadow-md hover:shadow-lg"
                    >
                      Get {selectedOption === 'consolidation' ? 'Consolidation' : 'Refinance'} Options
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 