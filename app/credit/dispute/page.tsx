'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/components/Header"
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/firebase'

interface MatchingBlock {
  account_type?: string;
  account_number?: string;
  full_details: {
    accountstatus: string;
    creditguarantor: string;
    accounttype?: string;
  };
  overdue_amount: number;
  write_off_amount: number;
  current_balance: number;
}

interface DisputeAccount {
  lender: string;
  accountType: string;
  accountNumber?: string;
  status: string;
  currentBalance?: number;
  overdueAmount?: number;
  writeOffAmount?: number;
}

export default function DisputePage() {
  const router = useRouter()
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accounts, setAccounts] = useState<{
    active: MatchingBlock[];
    closed: MatchingBlock[];
    overdue: MatchingBlock[];
    writtenOff: MatchingBlock[];
  }>({
    active: [],
    closed: [],
    overdue: [],
    writtenOff: []
  })
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const checkExistingDisputes = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      // Get Firebase ID token and set it for Supabase
      const idToken = await user.getIdToken();
      supabase.auth.setSession({
        access_token: idToken,
        refresh_token: '',
      });

      // Check for existing disputes
      const { data: existingDisputes, error } = await supabase
        .from('disputes')
        .select('id')
        .eq('user_id', user.uid)
        .limit(1);

      if (error) {
        console.error('Error checking disputes:', error);
        return;
      }

      if (existingDisputes && existingDisputes.length > 0) {
        toast.error('You already have an active dispute. Please wait for it to be resolved.');
        router.push('/credit/disputes');
        return;
      }

      // Continue with loading report data if no existing disputes
      loadReportData();
    };

    const loadReportData = () => {
      const reportDataStr = localStorage.getItem('creditReportData');
      if (!reportDataStr) {
        router.push('/credit/score/report');
        return;
      }

      try {
        const data = JSON.parse(reportDataStr);
        setReportData(data);
        console.log('Full report data:', data);

        // Get accounts from matching_blocks
        const matchingBlocks: MatchingBlock[] = data.matching_blocks || [];
        
        // Get additional active accounts from active_loans_by_lender
        const additionalActiveAccounts = Object.entries(data.active_loans_by_lender || {})
          .filter(([lender]) => {
            // Only add lenders that aren't already in matching_blocks
            return !matchingBlocks.some(block => 
              block.full_details.creditguarantor === lender
            );
          })
          .map(([lender]) => ({
            account_type: 'Active Loan',
            full_details: {
              accountstatus: 'Active',
              creditguarantor: lender,
            },
            overdue_amount: 0,
            write_off_amount: 0,
            current_balance: 0
          }));

        // Combine both sources
        const allAccounts = [...matchingBlocks, ...additionalActiveAccounts];
        console.log('Combined accounts:', allAccounts);

        // Categorize all accounts
        const categorizedAccounts = {
          active: allAccounts.filter(block => {
            const status = block.full_details?.accountstatus?.toLowerCase() || '';
            return status.includes('active') || status === 'current' || status.includes('open');
          }),
          closed: allAccounts.filter(block => {
            const status = block.full_details?.accountstatus?.toLowerCase() || '';
            return status.includes('closed') || status.includes('settled');
          }),
          overdue: allAccounts.filter(block => 
            block.overdue_amount > 0
          ),
          writtenOff: allAccounts.filter(block => 
            block.write_off_amount > 0
          )
        };

        console.log('Categorized accounts:', categorizedAccounts);
        setAccounts(categorizedAccounts);
      } catch (error) {
        console.error('Error parsing report data:', error);
        router.push('/credit/score/report');
      }
    };

    checkExistingDisputes();
  }, [router]);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmitDispute = async () => {
    try {
      setIsSubmitting(true)

      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to submit a dispute');
        return;
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Set the Authorization header for this request
      supabase.auth.setSession({
        access_token: idToken,
        refresh_token: '',
      });

      // Get the credit report ID
      const { data: reportData, error: reportError } = await supabase
        .from('credit_reports')
        .select('id')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (reportError) {
        console.error('Error fetching report:', reportError);
        // Continue without credit_report_id since it's nullable
      }

      // Prepare dispute accounts data
      const disputeAccounts: DisputeAccount[] = selectedAccounts.map(accountId => {
        const [type, index] = accountId.split('-');
        
        // Find the account in the correct category
        let account;
        switch (type) {
          case 'active':
            account = accounts.active[parseInt(index)];
            break;
          case 'closed':
            account = accounts.closed[parseInt(index)];
            break;
          case 'overdue':
            account = accounts.overdue[parseInt(index)];
            break;
          case 'writtenoff':
            account = accounts.writtenOff[parseInt(index)];
            break;
          default:
            console.error('Invalid account type:', type);
            throw new Error(`Invalid account type: ${type}`);
        }

        if (!account) {
          console.error('Account not found:', { accountId, type, index });
          throw new Error(`Account not found for index ${index} in ${type} category`);
        }

        return {
          lender: account.full_details.creditguarantor,
          accountType: account.account_type || account.full_details.accounttype || 'Unknown',
          accountNumber: account.account_number,
          status: account.full_details.accountstatus,
          currentBalance: account.current_balance || 0,
          overdueAmount: account.overdue_amount || 0,
          writeOffAmount: account.write_off_amount || 0
        };
      });

      if (disputeAccounts.length === 0) {
        toast.error('No valid accounts selected for dispute');
        return;
      }

      // Prepare the dispute data with explicit typing
      const disputeData: {
        user_id: string;
        accounts: DisputeAccount[];
        status: 'pending';
        credit_report_id?: string;
      } = {
        user_id: user.uid,
        accounts: disputeAccounts,
        status: 'pending'
      };

      // Add credit_report_id only if it exists
      if (reportData?.id) {
        disputeData.credit_report_id = reportData.id;
      }

      console.log('Current user ID:', user.uid);
      console.log('Sending dispute data:', disputeData);

      // Save dispute to Supabase
      const { data: insertedDispute, error: disputeError } = await supabase
        .from('disputes')
        .insert([disputeData]) // Wrap in array as per Supabase requirements
        .select()
        .single();

      if (disputeError) {
        console.error('Supabase Error Details:', {
          code: disputeError.code,
          message: disputeError.message,
          details: disputeError.details,
          hint: disputeError.hint
        });
        throw new Error(`Failed to save dispute: ${disputeError.message}`);
      }

      if (!insertedDispute) {
        throw new Error('No data returned from dispute creation');
      }

      console.log('Dispute created successfully:', insertedDispute);

      // Show success message
      toast.success(
        'We will be passing the details to the Bureau. Expect a resolution within 15 days.',
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
          },
        }
      );

      // Wait for 2 seconds to let user read the message
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to disputes list page instead of credit report
      router.push('/credit/disputes');
      
    } catch (error) {
      console.error('Dispute submission error:', error);
      toast.error(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to submit dispute. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderAccountSection = (title: string, accounts: MatchingBlock[], type: string) => {
    if (accounts.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <span className="mr-2">{title}</span>
          <span className="text-sm font-normal text-gray-500">({accounts.length} accounts)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, index) => (
            <div 
              key={`${type}-${index}`}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 
                hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500 transition duration-150 ease-in-out"
                  checked={selectedAccounts.includes(`${type}-${index}`)}
                  onChange={() => handleAccountSelect(`${type}-${index}`)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {account.full_details.creditguarantor}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${account.full_details.accountstatus.toLowerCase() === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'}`}>
                      {account.full_details.accountstatus}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      {account.account_type || account.full_details.accounttype || 'N/A'}
                    </p>
                    {account.account_number && (
                      <p className="text-gray-500 font-mono text-xs">
                        {account.account_number}
                      </p>
                    )}
                    
                    <div className="pt-2 space-y-1">
                      {account.current_balance > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Balance:</span>
                          <span className="font-medium">{formatAmount(account.current_balance)}</span>
                        </div>
                      )}
                      {account.overdue_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-red-500">Overdue:</span>
                          <span className="font-medium text-red-600">{formatAmount(account.overdue_amount)}</span>
                        </div>
                      )}
                      {account.write_off_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-red-500">Written Off:</span>
                          <span className="font-medium text-red-600">{formatAmount(account.write_off_amount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Dispute Credit Report Inaccuracies</h1>
          <p className="text-gray-600 text-base">
            Select any accounts you wish to dispute. Our team will review and respond within 7-10 business days.
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

        <div className="flex items-center justify-end mb-4">
          <div className="text-sm text-gray-500">
            {selectedAccounts.length} account{selectedAccounts.length !== 1 ? 's' : ''} selected
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg 
              className="h-5 w-5 text-blue-500 mt-0.5" 
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
            <div>
              <p className="text-blue-800 font-medium">How to dispute?</p>
              <p className="text-blue-600 text-sm mt-1">
                Select any accounts you wish to dispute from your Active or Closed accounts list.
                Our team will review your dispute and get back to you within 7-10 business days.
              </p>
            </div>
          </div>
        </div>

        {renderAccountSection('Active Accounts', accounts.active, 'active')}
        {renderAccountSection('Closed Accounts', accounts.closed, 'closed')}

        {selectedAccounts.length > 0 && (
          <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[9999]">
            <button
              onClick={handleSubmitDispute}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                shadow-lg transition-all duration-200 flex items-center space-x-2 group
                hover:shadow-xl active:scale-95 text-sm md:text-base whitespace-nowrap
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {isSubmitting ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit {selectedAccounts.length} Dispute{selectedAccounts.length > 1 ? 's' : ''}</span>
                  <svg 
                    className="h-5 w-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Back to Report Button at bottom */}
        <div className="flex justify-center pt-8">
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
  );
} 