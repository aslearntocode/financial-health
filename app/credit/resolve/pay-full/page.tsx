'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'

// Create a separate component for the part that uses useSearchParams
function PayFullContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountNumber = searchParams.get('account')
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const user = auth.currentUser
        if (!user) {
          setError('Please login to continue')
          setIsLoading(false)
          return
        }

        const { data, error: supabaseError } = await supabase
          .from('credit_reports')
          .select('report_analysis')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (supabaseError) throw new Error('Failed to fetch account details')

        const allAccounts = [
          ...(data?.report_analysis?.accounts?.active || []),
          ...(data?.report_analysis?.accounts?.closed || [])
        ]

        const account = allAccounts.find((acc: any) => acc.account_number === accountNumber)
        if (!account) throw new Error('Account not found')

        setAccountDetails(account)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching account details:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    if (accountNumber) {
      fetchAccountDetails()
    } else {
      setError('Invalid account reference')
      setIsLoading(false)
    }
  }, [accountNumber])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error || !accountDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Account not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Pay Full Amount</h1>
            
            <div className="mb-8">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-2">Account Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Lender</p>
                    <p className="font-medium">{accountDetails.credit_grantor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium">{accountDetails.account_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Outstanding Amount</p>
                    <p className="font-medium text-red-600">₹{accountDetails.overdue_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">XXXX-{accountDetails.account_number.slice(-4)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">Benefits of Paying in Full</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Immediate positive impact on credit score</li>
                    <li>• Complete closure of outstanding debt</li>
                    <li>• Avoid additional interest charges</li>
                    <li>• Clean credit report status</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> After payment, it may take up to 30-45 days for your credit report to be updated.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push(`/payments/initiate?account=${accountNumber}&amount=${accountDetails.overdue_amount}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Payment
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function PayFull() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <PayFullContent />
    </Suspense>
  )
} 