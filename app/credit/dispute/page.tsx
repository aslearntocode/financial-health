'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/components/Header"

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

export default function DisputePage() {
  const router = useRouter()
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
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

  useEffect(() => {
    const reportDataStr = localStorage.getItem('creditReportData');
    if (!reportDataStr) {
      router.push('/credit/score/report');
      return;
    }

    try {
      const reportData = JSON.parse(reportDataStr);
      console.log('Full report data:', reportData);

      // Get accounts from matching_blocks
      const matchingBlocks: MatchingBlock[] = reportData.matching_blocks || [];
      
      // Get additional active accounts from active_loans_by_lender
      const additionalActiveAccounts = Object.entries(reportData.active_loans_by_lender || {})
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
  }, [router]);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmitDispute = async () => {
    // Implement your dispute submission logic here
    console.log('Selected accounts for dispute:', selectedAccounts);
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
              key={`${type}-${account.account_number || index}`}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 
                hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500 transition duration-150 ease-in-out"
                  checked={selectedAccounts.includes(`${type}-${account.account_number || index}`)}
                  onChange={() => handleAccountSelect(`${type}-${account.account_number || index}`)}
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dispute Credit Report Inaccuracies</h1>
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
                Select the accounts you want to dispute. You can select multiple accounts at once.
                Our team will review your dispute and get back to you within 7-10 business days.
              </p>
            </div>
          </div>
        </div>

        {renderAccountSection('Active Accounts', accounts.active, 'active')}
        {renderAccountSection('Closed Accounts', accounts.closed, 'closed')}
        {renderAccountSection('Overdue Accounts', accounts.overdue, 'overdue')}
        {renderAccountSection('Written Off Accounts', accounts.writtenOff, 'writtenoff')}

        {selectedAccounts.length > 0 && (
          <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[9999]">
            <button
              onClick={handleSubmitDispute}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                shadow-lg transition-all duration-200 flex items-center space-x-2 group
                hover:shadow-xl active:scale-95 text-sm md:text-base whitespace-nowrap"
            >
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 