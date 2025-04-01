'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Create a separate component for the part that uses useSearchParams
function SettleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountNumber = searchParams.get('account')
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settlementAmount, setSettlementAmount] = useState<number | null>(null)
  const [hasNegotiated, setHasNegotiated] = useState(false)

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

        // Calculate a sample settlement amount (60% of overdue)
        const calculatedSettlement = Math.round(account.overdue_amount * 0.6)
        
        setAccountDetails(account)
        setSettlementAmount(calculatedSettlement)
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

  const handleNegotiateTerms = () => {
    toast({
      title: "Request Submitted",
      description: "We have passed your request to the lender. Someone from their team will reach out to you soon.",
      variant: "default",
    });
  };

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
            <h1 className="text-2xl font-bold mb-6 text-center">Settlement Offer</h1>
            
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
                    <p className="text-sm text-gray-600">Total Outstanding</p>
                    <p className="font-medium text-red-600">₹{accountDetails.overdue_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Settlement Amount</p>
                    <p className="font-medium text-green-600">₹{settlementAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">Important Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Settlement may be reported as "Settled" on your credit report</li>
                    <li>• This offer is subject to lender approval</li>
                    <li>• Settlement terms are valid for limited time</li>
                    <li>• You'll receive a settlement letter after payment</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> A settled account may impact your credit score differently than a fully paid account. Consider consulting a financial advisor.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push(`/payments/settlement?account=${accountNumber}&amount=${settlementAmount}`)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Accept & Pay Settlement Amount
              </button>
              
              <Button
                variant="secondary"
                className={cn(
                  "w-full md:w-auto px-6",
                  hasNegotiated ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={() => {
                  if (!hasNegotiated) {
                    handleNegotiateTerms()
                    setHasNegotiated(true)
                  }
                }}
                disabled={hasNegotiated}
              >
                Negotiate Different Terms
              </Button>
              
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
export default function Settle() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <SettleContent />
    </Suspense>
  )
} 