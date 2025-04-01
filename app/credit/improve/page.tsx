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
  overdue_amount: number;
  write_off_amount: number;
}

export default function CreditScoreImprovePage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const user = auth.currentUser
        if (!user) {
          setError('Please login to view improvement options')
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading improvement options...</p>
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
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const hasOverdueAccounts = reportData?.accounts?.active?.some((account: Account) => account.overdue_amount > 0)
  const hasWrittenOffAccounts = reportData?.accounts?.closed?.some((account: Account) => account.write_off_amount > 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Boost Your Credit Score
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              We've analyzed your credit report and created a personalized improvement plan just for you.
            </p>
            <button
              onClick={() => router.push('/credit/score/report')}
              className="mt-4 inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 
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
            {/* Priority Issues - Only show if there are issues */}
            {(hasOverdueAccounts || hasWrittenOffAccounts) && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-red-800">Priority Actions</h2>
                </div>
                
                {/* Overdue Accounts */}
                {hasOverdueAccounts && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-3 flex items-center">
                      <span className="bg-red-100 w-5 h-5 rounded-full flex items-center justify-center mr-2">
                        <span className="text-red-600 font-bold text-xs">1</span>
                      </span>
                      Overdue Accounts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.accounts.active
                        .filter((account: Account) => account.overdue_amount > 0)
                        .map((account: Account, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-sm">{account.credit_grantor}</p>
                                <p className="text-xs text-gray-600">{account.account_type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-red-600">₹{account.overdue_amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">overdue</p>
                              </div>
                            </div>
                            <select 
                              className="w-full p-2 text-xs border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const route = {
                                    'pay_full': '/credit/resolve/pay-full',
                                    'settle': '/credit/resolve/settle'
                                  }[e.target.value];
                                  router.push(`${route}?account=${account.account_number}`);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Choose Resolution Option</option>
                              <option value="pay_full">Pay In Full</option>
                              <option value="settle">Settle The Account</option>
                            </select>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Written Off Accounts */}
                {hasWrittenOffAccounts && (
                  <div>
                    <h3 className="text-base font-semibold mb-3 flex items-center">
                      <span className="bg-red-100 w-5 h-5 rounded-full flex items-center justify-center mr-2">
                        <span className="text-red-600 font-bold text-xs">2</span>
                      </span>
                      Written Off Accounts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.accounts.closed
                        .filter((account: Account) => account.write_off_amount > 0)
                        .map((account: Account, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-sm">{account.credit_grantor}</p>
                                <p className="text-xs text-gray-600">{account.account_type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-red-600">₹{account.write_off_amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">written off</p>
                              </div>
                            </div>
                            <select 
                              className="w-full p-2 text-xs border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const route = {
                                    'pay_full': '/credit/resolve/pay-full',
                                    'settle': '/credit/resolve/settle'
                                  }[e.target.value];
                                  router.push(`${route}?account=${account.account_number}`);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Choose Resolution Option</option>
                              <option value="pay_full">Pay In Full</option>
                              <option value="settle">Settle The Account</option>
                            </select>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Secured Credit Card Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-blue-800">Build Your Credit Score</h2>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Secured Credit Card</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Start your credit-building journey with a secured credit card. Open a fixed deposit and get instant 
                      credit limit approval with premium benefits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {[
                        { icon: "check", text: "No credit check required" },
                        { icon: "shield", text: "100% approval guaranteed" },
                        { icon: "chart", text: "Reports to all major credit bureaus" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: "star", text: "Convert to an unsecured card over time" },
                        { icon: "cash", text: "Continue to Earn Interest on Fixed Deposit" },
                        { icon: "gift", text: "Earn Reward Points on every purchase" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => router.push('/credit/secured-card')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg
                        transition-all duration-200 font-medium text-center"
                    >
                      <span className="text-base">Apply Now</span>
                      <span className="block text-xs opacity-90 mt-0.5">with Our Trusted Partners</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Credit Habits */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </span>
                Smart Credit Habits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Pay Bills on Time",
                    description: "Set up automatic payments or reminders to ensure you never miss a due date.",
                    icon: "⏰"
                  },
                  {
                    title: "Keep Credit Utilization Low",
                    description: "Try to keep your credit card balances below 30% of your credit limits.",
                    icon: "📊"
                  },
                  {
                    title: "Maintain Long-Term Accounts",
                    description: "Keep your oldest credit accounts open to maintain a longer credit history.",
                    icon: "📈"
                  },
                  {
                    title: "Limit New Credit Applications",
                    description: "Only apply for new credit when necessary to minimize hard inquiries.",
                    icon: "🎯"
                  }
                ].map((tip, index) => (
                  <div key={index} 
                    className="p-4 border border-gray-100 rounded-lg bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{tip.icon}</span>
                      <h3 className="font-medium text-base">{tip.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Report Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => router.push('/credit/score/report')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 
                  bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all duration-200"
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
          </div>
        </div>
      </div>
    </div>
  )
} 