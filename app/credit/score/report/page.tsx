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

interface ScoreImpactSimulation {
  action: string;
  currentValue: number;
  newValue: number;
  impact: number;
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

const ScoreSimulator = ({ score, reportData }: { score: number, reportData: any }) => {
  const [simulations, setSimulations] = useState<ScoreImpactSimulation[]>([]);
  const [newLoanAmount, setNewLoanAmount] = useState<number>(0);
  const [utilizationReduction, setUtilizationReduction] = useState<number>(0);
  
  const calculateScoreImpact = (action: string, amount: number): number => {
    const MAX_SCORE = 900;
    
    switch (action) {
      case 'new_loan':
        // Combined impact of new account and inquiry
        const baseImpact = Math.floor(MAX_SCORE * -0.279);
        return Math.max(baseImpact, -25 - Math.floor(amount / 100000));
        
      case 'pay_overdue':
        // 14.5% weightage for overdue accounts
        const overdueImpact = Math.floor(MAX_SCORE * 0.145);
        return Math.min(overdueImpact, Math.floor(amount / 5000));
        
      case 'pay_writeoff':
        // 15.1% weightage for write-offs
        const writeoffImpact = Math.floor(MAX_SCORE * 0.151);
        return Math.min(writeoffImpact, Math.floor(amount / 5000));
        
      case 'settle_writeoff':
        // 70% of write-off impact for settlements
        const settlementImpact = Math.floor(MAX_SCORE * 0.151 * 0.7);
        return Math.min(settlementImpact, Math.floor(amount / 7000));
        
      case 'account_age':
        // 16% weightage for credit history length
        const ageImpact = Math.floor((MAX_SCORE * 0.16) / 10);
        return Math.min(amount * ageImpact, Math.floor(MAX_SCORE * 0.16));
        
      case 'utilization':
        // 7% weightage for current balance/utilization
        const utilizationImpact = Math.floor(MAX_SCORE * 0.07);
        return Math.min(Math.floor(amount * 0.7), utilizationImpact);
        
      default:
        return 0;
    }
  };

  const simulateAction = (action: string, currentValue: number, newValue: number) => {
    const impact = calculateScoreImpact(action, newValue);
    setSimulations(prev => [...prev, { action, currentValue, newValue, impact }]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Credit Score Simulator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* New Loan Simulation */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Simulate New Loan</h3>
          <div className="flex gap-2">
            <input
              type="number"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Enter loan amount"
              value={newLoanAmount || ''}
              onChange={(e) => setNewLoanAmount(Number(e.target.value))}
            />
            <button
              onClick={() => simulateAction('new_loan', 0, newLoanAmount)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Simulate
            </button>
          </div>
        </div>

        {/* Credit Utilization Simulation */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Simulate Utilization Reduction</h3>
          <div className="flex gap-2">
            <input
              type="number"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Reduction percentage"
              max="100"
              value={utilizationReduction || ''}
              onChange={(e) => setUtilizationReduction(Number(e.target.value))}
            />
            <button
              onClick={() => simulateAction('utilization', 0, utilizationReduction)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Simulate
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => simulateAction('account_age', 0, 2)}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          +2 Years Account Age
        </button>
        <button
          onClick={() => simulateAction('pay_overdue', 0, 50000)}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          Pay ₹50,000 Overdue
        </button>
        <button
          onClick={() => simulateAction('settle_writeoff', 0, 100000)}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          Settle ₹1,00,000 Write-off
        </button>
      </div>

      {/* Results */}
      {simulations.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Simulation Results</h3>
          <div className="space-y-3">
            {simulations.map((sim, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="text-sm">
                  {sim.action.replace('_', ' ').charAt(0).toUpperCase() + sim.action.slice(1).replace('_', ' ')}
                </span>
                <span className={`font-medium ${sim.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {sim.impact > 0 ? '+' : ''}{sim.impact} points
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded font-medium">
              <span>Estimated New Score</span>
              <span className="text-blue-600">
                {score + simulations.reduce((acc, sim) => acc + sim.impact, 0)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSimulations([])}
            className="mt-4 text-red-500 text-sm hover:text-red-600"
          >
            Clear Simulations
          </button>
        </div>
      )}
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

// Add this new component before the main CreditScoreReportPage component
const FloatingActionPopup = ({ score, router, reportData }: { score: number, router: any, reportData: any }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div 
      className={`fixed bottom-20 md:bottom-4 right-4 z-[9999] bg-white rounded-lg shadow-xl transition-all duration-300 ${
        isMinimized ? 'w-auto' : 'w-64'
      }`}
    >
      {/* Header with minimize/maximize button */}
      <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-lg cursor-pointer"
           onClick={() => setIsMinimized(!isMinimized)}>
        <span className={`font-medium text-sm ${isMinimized ? 'mr-2' : ''}`}>
          Quick Actions
        </span>
        <button className="text-white hover:text-gray-100">
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className={`p-3 space-y-2 ${isMinimized ? 'hidden' : 'block'}`}>
        {/* Conditional button based on score */}
        {score < 700 ? (
          <button 
            onClick={() => router.push('/credit/improve')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg 
              transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Improve Score</span>
          </button>
        ) : (
          <button 
            onClick={() => router.push('/credit/simplify')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg 
              transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Simplify Finances</span>
          </button>
        )}

        <button 
          onClick={() => {
            if (reportData) {
              // Store report data in localStorage before navigation
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
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg 
            transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Dispute Report</span>
        </button>

        <button 
          onClick={() => router.push('/credit/simulator')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
            transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Score Simulator</span>
        </button>
      </div>
    </div>
  );
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

        // Remove localStorage check since we want real-time data
        const user = auth.currentUser
        if (!user) {
          setError('Please login to view your report')
          setIsLoading(false)
          return
        }

        const { data, error: supabaseError } = await supabase
          .from('credit_reports')
          .select('report_analysis, audio_url')
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
        setAudioUrl(data.audio_url)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching report:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [])

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
      
      {/* Remove the existing floating buttons and add the new popup component */}
      <FloatingActionPopup score={score} router={router} reportData={reportData} />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-center mb-8">
            {`${reportData?.applicant_segment?.["FIRST-NAME"]?.charAt(0).toUpperCase()}${reportData?.applicant_segment?.["FIRST-NAME"]?.slice(1).toLowerCase() || ""} ${reportData?.applicant_segment?.["LAST-NAME"]?.charAt(0).toUpperCase()}${reportData?.applicant_segment?.["LAST-NAME"]?.slice(1).toLowerCase() || ""}'s Credit Report Summary`}
          </h1>
          
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
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
              <h3 className="font-semibold text-gray-600">Credit History</h3>
              <p className="text-3xl font-bold text-orange-600">
                {(() => {
                  const years = Number(reportData?.score_details?.perform_attributes?.find(
                    (attr: any) => attr["ATTR-NAME"] === "LENGTH-OF-CREDIT-HISTORY-YEAR"
                  )?.["ATTR-VALUE"] || "0");
                  
                  const months = Number(reportData?.score_details?.perform_attributes?.find(
                    (attr: any) => attr["ATTR-NAME"] === "LENGTH-OF-CREDIT-HISTORY-MONTH"
                  )?.["ATTR-VALUE"] || "0");
                  
                  const totalYears = years + (months / 12);
                  return totalYears.toFixed(1);
                })()}
              </p>
              <p className="text-sm text-gray-500">Years</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-600">New Accounts</h3>
              <p className="text-3xl font-bold text-teal-600">
                {reportData?.score_details?.perform_attributes?.find(
                  (attr: any) => attr["ATTR-NAME"] === "NEW-ACCOUNTS-IN-LAST-SIX-MONTHS"
                )?.["ATTR-VALUE"] || "0"}
              </p>
              <p className="text-sm text-gray-500">Last 6 months</p>
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

          {/* Modified Overdue Accounts Section */}
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

          {/* Modified Written Off Accounts Section */}
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