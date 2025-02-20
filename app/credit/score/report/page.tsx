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

const CreditScoreMeter = ({ score }: { score: number }) => {
  // Calculate needle rotation for a 180-degree arc (-90 to 90 degrees)
  // For score 300 out of 900, it should be in the "Poor" range
  const rotation = -90 + ((score / 900) * 180);

  // Determine score segment
  const getScoreSegment = (score: number) => {
    if (score < 400) return 'Low';
    if (score < 600) return 'Fair';
    if (score < 750) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Semi-circular meter */}
      <div className="relative h-[250px] mt-8">
        {/* Background arc */}
        <div className="absolute w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FF4B4B' }} />
                <stop offset="33%" style={{ stopColor: '#FFA500' }} />
                <stop offset="66%" style={{ stopColor: '#90EE90' }} />
                <stop offset="100%" style={{ stopColor: '#48BB78' }} />
              </linearGradient>
            </defs>
            <path 
              d="M40 200 A160 160 0 0 1 360 200" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Score labels */}
        <div className="absolute w-full bottom-0 flex justify-between px-8">
          <span className="text-sm font-medium text-gray-600 -ml-2">Poor</span>
          <span className="text-sm font-medium text-gray-600 ml-12">Fair</span>
          <span className="text-sm font-medium text-gray-600">Good</span>
          <span className="text-sm font-medium text-gray-600 -mr-4">Excellent</span>
        </div>

        {/* Needle */}
        <div 
          className="absolute left-1/2 bottom-0 origin-bottom -translate-x-1/2 transition-transform duration-1000"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-[2px] h-[140px] bg-gray-800">
            <div className="absolute -bottom-[6px] left-1/2 w-3 h-3 bg-gray-800 rounded-full -translate-x-1/2"></div>
            <div className="absolute -top-1 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2"></div>
          </div>
        </div>
      </div>

      {/* Score display */}
      <div className="text-center mt-8">
        <p className="text-sm font-medium text-gray-600 mb-2">CREDIT SCORE</p>
        <p className="text-4xl font-bold text-gray-800 mb-2">{score}</p>
        <p className="text-sm font-medium text-gray-600">Score Segment: {getScoreSegment(score)}</p>
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

export default function CreditScoreReportPage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const fetchReport = async () => {
      const lastReportId = localStorage.getItem('lastReportId')
      if (!lastReportId) return

      const { data, error } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('id', lastReportId)
        .single()

      if (data && !error) {
        console.log('Fetched data:', data); // Debug log
        setReportData(data.report_analysis.processed_report)
      } else {
        console.error('Error fetching data:', error); // Debug log
      }
    }

    fetchReport()
  }, [])

  if (!reportData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const activeAccounts = reportData.first_block.primary_active_number_of_accounts || 0
  const totalAccounts = reportData.first_block.primary_number_of_accounts || 0
  const closedAccounts = totalAccounts - activeAccounts
  const score = reportData.first_block["score value"] || 0 // Updated to match the actual data structure

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-center mb-12">Your Credit Report Summary</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left side - Audio Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" 
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Audio Summary</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Listen to your personalized credit report summary narrated in clear, simple terms:
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <audio 
                      controls 
                      className="w-full focus:outline-none"
                      src="/credit_summary.mp3"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div className="flex items-start space-x-3 mt-4 bg-blue-100 rounded-lg p-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-blue-600 mt-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <p className="text-sm text-blue-700">
                      This audio summary provides a comprehensive overview of your credit report, 
                      including your score, active loans, and important account details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Credit Score Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {reportData?.first_block?.["score value"] ? (
                <CreditScoreMeter score={reportData.first_block["score value"]} />
              ) : (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Report Sections */}
          {reportData && (
            <div className="space-y-8">
              {/* Active Accounts Section */}
              <div className="bg-green-50 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-800">Active Accounts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(reportData.active_loans_by_lender || {}).map(([lender, count]) => {
                    // Find the matching block for this lender to get account type
                    const lenderAccounts = reportData.matching_blocks
                      .filter((block: MatchingBlock) => 
                        block.full_details.creditguarantor === lender && 
                        block.full_details.accountstatus === 'Active'
                      )
                      .map((block: MatchingBlock) => {
                        // Map common account types to more readable formats
                        const accountType = (block.account_type || '').toLowerCase();
                        const fullDetails = block.full_details;
                        
                        // Log the data for debugging
                        console.log('Account data:', {
                          lender,
                          accountType,
                          fullDetails
                        });

                        // Enhanced account type detection
                        if (accountType.includes('housing') || accountType.includes('home')) return 'Home Loan';
                        if (accountType.includes('auto') || accountType.includes('car')) return 'Auto Loan';
                        if (accountType.includes('personal')) return 'Personal Loan';
                        if (accountType.includes('consumer')) return 'Consumer Loan';
                        if (accountType.includes('credit card') || accountType.includes('secured credit card')) {
                          return accountType.includes('secured') ? 'Secured Credit Card' : 'Credit Card';
                        }
                        if (accountType.includes('business')) return 'Business Loan';
                        if (accountType.includes('education')) return 'Education Loan';
                        
                        // Additional checks for specific banks
                        if (lender === 'IDFC FIRST BANK LIMITED' || lender === 'SBM BANK INDIA LIMITED') {
                          if (fullDetails.accounttype?.toLowerCase().includes('credit card')) {
                            return 'Credit Card';
                          }
                          if (fullDetails.accounttype?.toLowerCase().includes('secured')) {
                            return 'Secured Credit Card';
                          }
                          if (fullDetails.accounttype?.toLowerCase().includes('auto')) {
                            return 'Auto Loan';
                          }
                        }

                        return block.account_type || fullDetails.accounttype || 'Unknown Account Type';
                      });

                    return (
                      <div key={lender} className="bg-white rounded-lg p-4 shadow">
                        <p className="font-semibold text-green-700">{lender}</p>
                        <div className="space-y-1">
                          {lenderAccounts.map((accountType, index) => (
                            <p key={index} className="text-green-600">
                              {accountType}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overdue and Written Off Accounts Section */}
              {(reportData.matching_blocks || []).some(block => 
                block.overdue_amount > 0 || block.write_off_amount > 0
              ) && (
                <div className="bg-red-50 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-800">Overdue & Written Off Accounts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.matching_blocks
                      .filter(block => block.overdue_amount > 0 || block.write_off_amount > 0)
                      .map((block, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow">
                          <p className="font-semibold text-gray-800">{block.full_details.creditguarantor}</p>
                          <p className="text-sm text-gray-600">Account: {block.account_type}</p>
                          {block.overdue_amount > 0 && (
                            <p className="text-red-600">Overdue: ₹{block.overdue_amount.toLocaleString()}</p>
                          )}
                          {block.write_off_amount > 0 && (
                            <p className="text-red-600">Written Off: ₹{block.write_off_amount.toLocaleString()}</p>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credit Card Utilization Section */}
              {Object.keys(reportData.credit_card_utilization || {}).length > 0 && (
                <div className="bg-blue-50 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">Credit Card Utilization</h2>
                  <div className="space-y-4">
                    {Object.entries(reportData.credit_card_utilization).map(([cardNumber, details]: [string, any]) => (
                      <div key={cardNumber} className="bg-white rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{details.lender}</p>
                            <p className="text-sm text-gray-600">Card: {cardNumber}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            details.utilization_impact === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {details.utilization_impact} Impact
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                details.utilization_impact === 'Negative' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${details.utilization_percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-sm text-gray-600">
                            <span>Utilization: {details.utilization_percentage.toFixed(1)}%</span>
                            <span>Limit: ₹{details.credit_limit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 