'use client'

import Header from "@/components/Header"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface CreditReport {
  score: number;
  openAccounts: number;
  closedAccounts: number;
  writtenOffAccounts: {
    lender: string;
    amount: number;
    type: string;
  }[];
  overdueAccounts: {
    lender: string;
    amount: number;
    type: string;
  }[];
}

interface FullDetails {
  creditguarantor: string;
  accountstatus: string;
  accounttype?: string;
}

interface MatchingBlock {
  account_type?: string;
  full_details: FullDetails;
}

interface MatchingBlockWithAmounts extends MatchingBlock {
  overdue_amount: number;
  write_off_amount: number;
}

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

interface CreditInquiry {
  "INQUIRY-DT": string;
  "LENDER-NAME": string;
  "CREDIT-INQ-PURPS-TYPE": string;
  "AMOUNT": string;
}

const CreditScore = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 600) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-sm font-medium text-gray-500 tracking-wide mb-2">
        CREDIT SCORE
      </div>
      <div className={`text-6xl font-bold ${getScoreColor(score)} transition-colors duration-500`}>
        {score}
      </div>
    </div>
  );
};

interface ProcessedReport {
  active_loans_by_lender: Record<string, number>;
  credit_card_utilization: Record<string, {
    credit_limit: number;
    current_balance: number;
    lender: string;
    utilization_impact: string;
    utilization_percentage: number;
  }>;
  first_block: {
    score_value: number;
    score_segment: string;
    primary_active_number_of_accounts: number;
    primary_number_of_accounts: number;
    primary_current_balance: number;
    primary_disbursed_amount: number;
    primary_overdue_number_of_accounts: number;
    name: string;
    // ... other fields
  };
  matching_blocks: Array<{
    account_number: string;
    account_type: string;
    credit_limit: string;
    current_balance: number;
    overdue_amount: number;
    write_off_amount: number;
    full_details: {
      accountstatus: string;
      creditguarantor: string;
      // ... other fields
    };
  }>;
}

// Helper function to check if a date is within last 6 months
const isWithinLast6Months = (dateString: string) => {
  const [day, month, year] = dateString.split('-').map(num => parseInt(num));
  const enquiryDate = new Date(year + 2000, month - 1, day); // Assuming year is in YY format
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return enquiryDate >= sixMonthsAgo;
};

export default function CreditScoreReportPage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First try to get data from localStorage (for immediate display)
        const cachedReport = localStorage.getItem('latestCreditReport')
        if (cachedReport) {
          setReportData(JSON.parse(cachedReport))
          localStorage.removeItem('latestCreditReport') // Clear after using
          setIsLoading(false)
          return
        }

        // If no cached data, fetch from Supabase
        const user = auth.currentUser
        if (!user) {
          setError('Please login to view your report')
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

  useEffect(() => {
    // Construct the URL with any necessary parameters
    const audioUrl = `/api/get_audio?${new URLSearchParams({
      // Add any required parameters here
      // For example: reportId: reportData.id
    })}`
    setAudioUrl(audioUrl)
  }, [/* dependencies */])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your credit report...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <p className="text-gray-600 mb-6">
              {error === 'No report found' 
                ? 'Please generate a new credit report to view the details.'
                : 'Please try again or generate a new report.'}
            </p>
            <button 
              onClick={() => router.push('/credit/score')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {error === 'Please login to view your report' 
                ? 'Go to Login' 
                : 'Generate New Report'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!reportData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No report data available</p>
            <button 
              onClick={() => router.push('/credit/score')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generate New Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Safely extract data from the report
  const score = parseInt(reportData?.score_details?.score ?? "0");
  const primarySummary = reportData?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"];
  const activeAccounts = parseInt(primarySummary?.["ACTIVE-ACCOUNTS"] ?? "0");
  const totalAccounts = parseInt(primarySummary?.["NUMBER-OF-ACCOUNTS"] ?? "0");
  const closedAccounts = totalAccounts - activeAccounts;
  const overdueAccounts = parseInt(primarySummary?.["OVERDUE-ACCOUNTS"] ?? "0");
  const totalOverdueAmount = parseFloat(primarySummary?.["TOTAL-AMT-OVERDUE"]?.replace(/,/g, '') ?? "0");
  const recentEnquiriesCount = parseInt(
    reportData?.score_details?.perform_attributes?.find(
      (attr: any) => attr["ATTR-NAME"] === "INQUIRIES-IN-LAST-SIX-MONTHS"
    )?.["ATTR-VALUE"] ?? "0"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Add the floating dispute button */}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[9999]">
        <button 
          onClick={() => {
            // Store report data in localStorage before navigation
            if (reportData) {
              // Create matching_blocks array from accounts
              const matching_blocks = [
                ...(reportData.accounts?.active || []).map((account: any) => ({
                  account_type: account.account_type,
                  account_number: account.account_number,
                  full_details: {
                    accountstatus: account.status || 'Active',
                    creditguarantor: account.credit_grantor || account.lender,
                    accounttype: account.account_type
                  },
                  overdue_amount: account.overdue_amount || 0,
                  write_off_amount: account.write_off_amount || 0,
                  current_balance: account.current_balance || 0
                })),
                ...(reportData.accounts?.closed || []).map((account: any) => ({
                  account_type: account.account_type,
                  account_number: account.account_number,
                  full_details: {
                    accountstatus: account.status || 'Closed',
                    creditguarantor: account.credit_grantor || account.lender,
                    accounttype: account.account_type
                  },
                  overdue_amount: account.overdue_amount || 0,
                  write_off_amount: account.write_off_amount || 0,
                  current_balance: account.current_balance || 0
                }))
              ];

              // Create active_loans_by_lender object with proper typing
              const active_loans_by_lender: Record<string, any[]> = {};
              reportData.accounts?.active?.forEach((account: any) => {
                const lender = account.credit_grantor || account.lender;
                if (!active_loans_by_lender[lender]) {
                  active_loans_by_lender[lender] = [];
                }
                active_loans_by_lender[lender].push(account);
              });

              const disputeData = {
                matching_blocks,
                active_loans_by_lender,
                inquiry_history: reportData.inquiry_history || [],
                credit_report_id: reportData.id
              };

              console.log('Storing dispute data:', disputeData); // Debug log
              localStorage.setItem('creditReportData', JSON.stringify(disputeData));
            }
            router.push('/credit/dispute');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg 
            transition-all duration-200 flex items-center space-x-2 group
            hover:shadow-xl active:scale-95 text-sm md:text-base whitespace-nowrap"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <span className="hidden md:inline">Found Inaccuracy in the Report - Dispute It Here</span>
          <span className="md:hidden">Inaccurate - Dispute It Here</span>
        </button>
      </div>

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-center mb-8">Your Credit Report Summary</h1>
          
          {/* Audio Player and Score Meter in side-by-side layout with reduced height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Audio Player Section */}
            {audioUrl && (
              <div className="bg-white rounded-xl shadow-lg p-6 h-[160px] flex flex-col justify-center">
                <h2 className="text-base font-semibold mb-2">Audio Summary</h2>
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Credit Score */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-[160px] flex items-center justify-center">
              <CreditScore score={score} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-600">Active Accounts</h3>
              <p className="text-3xl font-bold text-green-600">{activeAccounts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-600">Closed Accounts</h3>
              <p className="text-3xl font-bold text-gray-600">{closedAccounts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-600">Total Accounts</h3>
              <p className="text-3xl font-bold text-blue-600">{totalAccounts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-600">Recent Enquiries</h3>
              <p className="text-3xl font-bold text-purple-600">{recentEnquiriesCount}</p>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
          </div>

          {/* Active Accounts Detail */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData?.accounts?.active?.map((account: Account, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-semibold">{account.credit_grantor}</p>
                  <p className="text-sm text-gray-600">Type: {account.account_type}</p>
                  <p className="text-sm text-gray-600">Balance: ₹{account.current_balance.toLocaleString()}</p>
                  {account.overdue_amount > 0 && (
                    <p className="text-sm text-red-600">Overdue: ₹{account.overdue_amount.toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Accounts */}
          {reportData?.accounts?.active?.some((account: Account) => account.overdue_amount > 0) && (
            <div className="bg-red-50 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-red-800">Overdue Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.accounts.active
                  .filter((account: Account) => account.overdue_amount > 0)
                  .map((account: Account, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow">
                      <p className="font-semibold">{account.credit_grantor}</p>
                      <p className="text-sm text-gray-600">Type: {account.account_type}</p>
                      <p className="text-red-600">Overdue Amount: ₹{account.overdue_amount.toLocaleString()}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Written Off Accounts */}
          {reportData?.accounts?.closed?.some((account: Account) => account.write_off_amount > 0) && (
            <div className="bg-red-50 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-red-800">Written Off Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.accounts.closed
                  .filter((account: Account) => account.write_off_amount > 0)
                  .map((account: Account, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow">
                      <p className="font-semibold">{account.credit_grantor}</p>
                      <p className="text-sm text-gray-600">Type: {account.account_type}</p>
                      <p className="text-red-800">Written Off Amount: ₹{account.write_off_amount.toLocaleString()}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Enquiries and Credit Card Utilization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Recent Enquiries */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Enquiries</h2>
              <div className="space-y-4">
                {recentEnquiriesCount > 0 ? (
                  reportData?.inquiry_history
                    ?.filter((inquiry: CreditInquiry) => isWithinLast6Months(inquiry["INQUIRY-DT"]))
                    .map((inquiry: CreditInquiry, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <p className="font-semibold">{inquiry["LENDER-NAME"]}</p>
                          <p className="text-sm text-gray-600">{inquiry["INQUIRY-DT"]}</p>
                        </div>
                        <p className="text-sm text-gray-600">Purpose: {inquiry["CREDIT-INQ-PURPS-TYPE"]}</p>
                        {inquiry["AMOUNT"] !== "0" && (
                          <p className="text-sm text-gray-600">Amount: ₹{inquiry["AMOUNT"]}</p>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No enquiries in the last 6 months
                  </div>
                )}
              </div>
            </div>

            {/* Credit Card Utilization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Credit Card Utilization</h2>
              {reportData?.accounts?.active?.some((account: Account) => account.account_type?.toLowerCase().includes('credit card')) ? (
                <div className="space-y-4">
                  {reportData.accounts.active
                    .filter((account: Account) => account.account_type?.toLowerCase().includes('credit card'))
                    .map((card: Account, index: number) => {
                      const utilization = (card.current_balance / (card.credit_limit || 1)) * 100;
                      const utilizationColor = 
                        utilization > 80 ? 'text-red-500' :
                        utilization > 30 ? 'text-yellow-500' :
                        'text-green-500';

                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{card.credit_grantor}</p>
                            <p className={`text-sm font-medium ${utilizationColor}`}>
                              {utilization.toFixed(1)}% Used
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                utilization > 80 ? 'bg-red-500' :
                                utilization > 30 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Balance: ₹{card.current_balance.toLocaleString()}</span>
                            <span>Limit: ₹{(card.credit_limit || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No active credit cards found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 