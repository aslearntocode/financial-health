'use client'

import Header from "@/components/Header"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useEffect, useState, useRef } from "react"
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

interface HighlightState {
  name: boolean;
  score: boolean;
  activeAccounts: boolean;
  closedAccounts: boolean;
  totalAccounts: boolean;
  creditHistory: boolean;
  newAccounts: boolean;
  recentEnquiries: boolean;
  overdueAccounts: boolean;
  writtenOffAccounts: boolean;
  creditCards: boolean;
  improvementTips: boolean;
}

const CreditScore = ({ score, isHighlighted }: { score: number, isHighlighted?: boolean }) => {
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 600) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full transition-all duration-500 rounded-lg p-4 ${
      isHighlighted ? 'bg-blue-50 shadow-lg scale-105' : ''
    }`}>
      <div className="text-sm font-medium text-gray-500 tracking-wide mb-2">
        CREDIT SCORE
      </div>
      <div className={`text-6xl font-bold ${getScoreColor(score)} transition-all duration-500 ${
        isHighlighted ? 'animate-pulse transform scale-110' : ''
      }`}>
        {score}
      </div>
    </div>
  );
};

const SyncedAudioPlayer = ({ audioUrl, onTimeUpdate, onEnded }: { 
  audioUrl: string, 
  onTimeUpdate: (time: number) => void,
  onEnded: () => void
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <audio 
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          onEnded();
        }}
        className="hidden"
      />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
               onClick={(e) => {
                 if (audioRef.current) {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const percentage = x / rect.width;
                   audioRef.current.currentTime = percentage * duration;
                 }
               }}>
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
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
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div 
      className={`fixed bottom-20 md:bottom-4 right-4 z-[9999] bg-white rounded-lg shadow-xl transition-all duration-300 ${
        isMinimized ? 'w-auto' : 'w-64'
      }`}
    >
      {/* Header with minimize/maximize button */}
      <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-lg cursor-pointer"
           onClick={() => setIsMinimized(!isMinimized)}>
        <span className="font-medium text-sm mr-2">
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

// Add this at the top of your file with other styles
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

// First, rename MobileDropdown to ExpandableSection and update its implementation
const ExpandableSection = ({ title, children, isHighlighted }: { 
  title: string, 
  children: React.ReactNode,
  isHighlighted?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${isHighlighted ? 'bg-blue-50' : 'bg-white'} rounded-xl shadow-lg transition-all duration-500`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center"
      >
        <span className="font-semibold">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        {children}
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
  const [highlightedElements, setHighlightedElements] = useState<HighlightState>({
    name: false,
    score: false,
    activeAccounts: false,
    closedAccounts: false,
    totalAccounts: false,
    creditHistory: false,
    newAccounts: false,
    recentEnquiries: false,
    overdueAccounts: false,
    writtenOffAccounts: false,
    creditCards: false,
    improvementTips: false
  });
  const [currentTime, setCurrentTime] = useState(0);

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

  const handleAudioTimeUpdate = (time: number) => {
    // Reset all highlights
    const baseState = Object.keys(highlightedElements).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {} as HighlightState);

    // Update highlights based on audio timestamp
    if (time < 10) {
      setHighlightedElements({ ...baseState, name: true });
    } else if (time < 22) {
      setHighlightedElements({ ...baseState, score: true });
    } else if (time < 27) {
      setHighlightedElements({ ...baseState, recentEnquiries: true });
    } else if (time < 30) {
      setHighlightedElements({ ...baseState, totalAccounts: true });
    } else if (time < 35) {
      setHighlightedElements({ ...baseState, activeAccounts: true });
    } else if (time < 38) {
      setHighlightedElements({ ...baseState, closedAccounts: true });
    } else if (time < 85) {
      setHighlightedElements({ ...baseState, writtenOffAccounts: true });
    } else if (time < 130) {
      setHighlightedElements({ ...baseState, overdueAccounts: true });
    } else if (time < 160) {
      setHighlightedElements({ ...baseState, creditCards: true });
    } else {
      // Show improvement tips after all other sections
      setHighlightedElements({ ...baseState, improvementTips: true });
      setCurrentTime(time); // Add this to track time for tips rotation
    }
  };

  const handleAudioEnded = () => {
    setHighlightedElements({
      name: false,
      score: false,
      activeAccounts: false,
      closedAccounts: false,
      totalAccounts: false,
      creditHistory: false,
      newAccounts: false,
      recentEnquiries: false,
      overdueAccounts: false,
      writtenOffAccounts: false,
      creditCards: false,
      improvementTips: false
    });
  };

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

  const DynamicInfoCard = ({ highlightedElements, reportData, score, activeAccounts, totalAccounts, recentEnquiriesCount }: {
    highlightedElements: HighlightState;
    reportData: any;
    score: number;
    activeAccounts: number;
    totalAccounts: number;
    recentEnquiriesCount: number;
  }) => {
    if (highlightedElements.name) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Customer Name</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {`${reportData?.applicant_segment?.["FIRST-NAME"]?.charAt(0).toUpperCase()}${reportData?.applicant_segment?.["FIRST-NAME"]?.slice(1).toLowerCase() || ""} ${reportData?.applicant_segment?.["LAST-NAME"]?.charAt(0).toUpperCase()}${reportData?.applicant_segment?.["LAST-NAME"]?.slice(1).toLowerCase() || ""}`}
          </p>
        </div>
      );
    }

    if (highlightedElements.score) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Credit Score</h3>
          <div className="flex flex-col items-center gap-3">
            <p className={`text-6xl font-bold ${
              score >= 750 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 
              score >= 600 ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 
              'bg-gradient-to-r from-red-600 to-rose-600'
            } bg-clip-text text-transparent`}>
              {score}
            </p>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
              score >= 750 ? 'bg-green-100 text-green-800' : 
              score >= 600 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {score >= 750 ? 'Excellent' : score >= 600 ? 'Good' : 'Low'}
            </span>
          </div>
        </div>
      );
    }

    if (highlightedElements.recentEnquiries) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Recent Enquiries</h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {recentEnquiriesCount}
          </p>
          <p className="text-sm text-gray-500">In the last 6 months</p>
        </div>
      );
    }

    if (highlightedElements.totalAccounts || highlightedElements.activeAccounts) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            {highlightedElements.totalAccounts ? 'Total Accounts' : 'Active Accounts'}
          </h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {highlightedElements.totalAccounts ? totalAccounts : activeAccounts}
          </p>
          <p className="text-sm text-gray-500">
            {highlightedElements.totalAccounts ? `Including ${activeAccounts} active accounts` : `Out of ${totalAccounts} total accounts`}
          </p>
        </div>
      );
    }

    if (highlightedElements.creditCards) {
      const creditCards = reportData?.accounts?.active?.filter((account: Account) => 
        account.account_type?.toLowerCase().includes('credit card')
      ) || [];
      const totalUtilization = creditCards.reduce((acc: number, card: Account) => {
        return acc + (card.current_balance / (card.credit_limit || 1)) * 100;
      }, 0) / (creditCards.length || 1);

      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Credit Card Usage</h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-2">
            {Math.round(totalUtilization)}%
          </p>
          <p className="text-sm text-gray-500">Average utilization across {creditCards.length} cards</p>
        </div>
      );
    }

    if (highlightedElements.overdueAccounts) {
      const overdueAccounts = reportData?.accounts?.active?.filter((account: Account) => 
        account.overdue_amount > 0
      ) || [];
      const totalOverdue = overdueAccounts.reduce((acc: number, account: Account) => 
        acc + account.overdue_amount, 0
      );

      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Overdue Amount</h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            ₹{totalOverdue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Across {overdueAccounts.length} accounts</p>
        </div>
      );
    }

    if (highlightedElements.writtenOffAccounts) {
      const writtenOffAccounts = reportData?.accounts?.closed?.filter((account: Account) => 
        account.write_off_amount > 0
      ) || [];
      const totalWrittenOff = writtenOffAccounts.reduce((acc: number, account: Account) => 
        acc + account.write_off_amount, 0
      );

      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Written Off Amount</h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
            ₹{totalWrittenOff.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Across {writtenOffAccounts.length} accounts</p>
        </div>
      );
    }

    if (highlightedElements.improvementTips) {
      // Determine which tip to show based on audio timestamp
      const tipIndex = Math.floor((currentTime - 160) / 10); // Show each tip for 10 seconds

      return (
        <div className="text-center animate-fade-in">
          {tipIndex === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-2xl font-semibold text-blue-700">Pay Bills on Time</h3>
              </div>
              <p className="text-blue-600 text-lg">Set up automatic payments to never miss a due date</p>
            </div>
          )}

          {tipIndex === 1 && (
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-2xl font-semibold text-purple-700">Keep Credit Utilization Low</h3>
              </div>
              <p className="text-purple-600 text-lg">Try to keep it below 30% of your limit</p>
            </div>
          )}

          {tipIndex === 2 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-semibold text-green-700">Maintain Long-Term Accounts</h3>
              </div>
              <p className="text-green-600 text-lg">Keep your oldest accounts active</p>
            </div>
          )}

          {tipIndex > 2 && (
            <div className="text-center animate-fade-in">
              <p className="text-xl font-medium text-gray-600">
                Follow these tips to improve your score
              </p>
            </div>
          )}
        </div>
      );
    }

    // Default/empty state
    return (
      <div className="text-center animate-fade-in">
        <p className="text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Video Summary Provided by Financial Health
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <FloatingActionPopup score={score} router={router} reportData={reportData} />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-center mb-8">
            Credit Report Summary
          </h1>
          
          {/* Desktop Layout Container */}
          <div className="block md:flex md:gap-8 mb-12">
            {/* Left Column - Audio Player */}
            <div className="w-full md:w-[400px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-lg overflow-hidden mb-8 md:mb-0">
              {/* Content Area with fixed height */}
              <div className="px-8 pt-8 pb-6 h-[240px] flex items-center justify-center bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="w-full">
                  <DynamicInfoCard 
                    highlightedElements={highlightedElements}
                    reportData={reportData}
                    score={score}
                    activeAccounts={activeAccounts}
                    totalAccounts={totalAccounts}
                    recentEnquiriesCount={recentEnquiriesCount}
                  />
                </div>
              </div>
              
              {/* Audio Controls */}
              {audioUrl && (
                <div className="px-8 pb-6 bg-white">
                  <div className="pt-6 border-t border-gray-100">
                    <SyncedAudioPlayer 
                      audioUrl={audioUrl}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onEnded={handleAudioEnded}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Score and Metrics */}
            <div className="flex-1">
              <div className="space-y-4">
                {/* Credit Score Card */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <CreditScore score={score} />
                </div>

                {/* Key Metrics Grid */}
                <div className="hidden md:grid grid-cols-3 gap-3">
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.activeAccounts ? 'bg-green-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Active Accounts</h3>
                    <p className={`text-2xl font-bold text-green-600 ${
                      highlightedElements.activeAccounts ? 'animate-pulse' : ''
                    }`}>{activeAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.closedAccounts ? 'bg-gray-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Closed Accounts</h3>
                    <p className={`text-2xl font-bold text-gray-600 ${
                      highlightedElements.closedAccounts ? 'animate-pulse' : ''
                    }`}>{closedAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.totalAccounts ? 'bg-blue-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Total Accounts</h3>
                    <p className={`text-2xl font-bold text-blue-600 ${
                      highlightedElements.totalAccounts ? 'animate-pulse' : ''
                    }`}>{totalAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.creditHistory ? 'bg-orange-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Credit History</h3>
                    <p className={`text-2xl font-bold text-orange-600 ${
                      highlightedElements.creditHistory ? 'animate-pulse' : ''
                    }`}>
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
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.newAccounts ? 'bg-teal-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">New Accounts</h3>
                    <p className={`text-2xl font-bold text-teal-600 ${
                      highlightedElements.newAccounts ? 'animate-pulse' : ''
                    }`}>
                      {reportData?.score_details?.perform_attributes?.find(
                        (attr: any) => attr["ATTR-NAME"] === "NEW-ACCOUNTS-IN-LAST-SIX-MONTHS"
                      )?.["ATTR-VALUE"] || "0"}
                    </p>
                    <p className="text-sm text-gray-500">Last 6 months</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.recentEnquiries ? 'bg-purple-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Recent Enquiries</h3>
                    <p className={`text-2xl font-bold text-purple-600 ${
                      highlightedElements.recentEnquiries ? 'animate-pulse' : ''
                    }`}>{recentEnquiriesCount}</p>
                    <p className="text-sm text-gray-500">Last 6 months</p>
                  </div>
                </div>

                {/* Mobile Grid */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.activeAccounts ? 'bg-green-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Active Accounts</h3>
                    <p className={`text-2xl font-bold text-green-600 ${
                      highlightedElements.activeAccounts ? 'animate-pulse' : ''
                    }`}>{activeAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.closedAccounts ? 'bg-gray-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Closed Accounts</h3>
                    <p className={`text-2xl font-bold text-gray-600 ${
                      highlightedElements.closedAccounts ? 'animate-pulse' : ''
                    }`}>{closedAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.totalAccounts ? 'bg-blue-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Total Accounts</h3>
                    <p className={`text-2xl font-bold text-blue-600 ${
                      highlightedElements.totalAccounts ? 'animate-pulse' : ''
                    }`}>{totalAccounts}</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.creditHistory ? 'bg-orange-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Credit History</h3>
                    <p className={`text-2xl font-bold text-orange-600 ${
                      highlightedElements.creditHistory ? 'animate-pulse' : ''
                    }`}>
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
                    <p className="text-xs text-gray-500">Years</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.newAccounts ? 'bg-teal-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">New Accounts</h3>
                    <p className={`text-2xl font-bold text-teal-600 ${
                      highlightedElements.newAccounts ? 'animate-pulse' : ''
                    }`}>
                      {reportData?.score_details?.perform_attributes?.find(
                        (attr: any) => attr["ATTR-NAME"] === "NEW-ACCOUNTS-IN-LAST-SIX-MONTHS"
                      )?.["ATTR-VALUE"] || "0"}
                    </p>
                    <p className="text-xs text-gray-500">Last 6 months</p>
                  </div>
                  <div className={`bg-white rounded-lg shadow p-3 transition-all duration-500 ${
                    highlightedElements.recentEnquiries ? 'bg-purple-50 shadow-lg scale-105' : ''
                  }`}>
                    <h3 className="font-semibold text-gray-600 text-sm">Recent Enquiries</h3>
                    <p className={`text-2xl font-bold text-purple-600 ${
                      highlightedElements.recentEnquiries ? 'animate-pulse' : ''
                    }`}>{recentEnquiriesCount}</p>
                    <p className="text-xs text-gray-500">Last 6 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdowns Section */}
          <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Active Accounts Dropdown */}
              <ExpandableSection 
                title="Active Accounts" 
                isHighlighted={highlightedElements.activeAccounts}
              >
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-4 hidden md:block">Active Accounts</h2>
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
              </ExpandableSection>

              {/* Overdue Accounts Dropdown */}
              {reportData?.accounts?.active?.some((account: Account) => account.overdue_amount > 0) && (
                <ExpandableSection 
                  title="Overdue Accounts" 
                  isHighlighted={highlightedElements.overdueAccounts}
                >
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-800 hidden md:block">Overdue Accounts</h2>
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
                </ExpandableSection>
              )}

              {/* Written Off Accounts Dropdown */}
              {reportData?.accounts?.closed?.some((account: Account) => account.write_off_amount > 0) && (
                <ExpandableSection 
                  title="Written Off Accounts" 
                  isHighlighted={highlightedElements.writtenOffAccounts}
                >
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-800 hidden md:block">Written Off Accounts</h2>
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
                </ExpandableSection>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ExpandableSection 
                title="Credit Card Utilization" 
                isHighlighted={highlightedElements.creditCards}
              >
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-4 hidden md:block">Credit Card Utilization</h2>
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
              </ExpandableSection>

              <ExpandableSection 
                title="Recent Enquiries" 
                isHighlighted={highlightedElements.recentEnquiries}
              >
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-4 hidden md:block">Recent Enquiries</h2>
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
              </ExpandableSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}