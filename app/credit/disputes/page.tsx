'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from "@/components/Header"
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Dispute {
  id: string
  created_at: string
  status: string
  accounts: {
    lender: string
    accountType: string
    accountNumber?: string
    status: string
  }[]
}

function DisputesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState<boolean>(() => {
    // Initialize based on URL parameter
    return searchParams.get('notification') === 'active_dispute'
  })

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchDisputes = async () => {
      try {
        const { data, error } = await supabase
          .from('disputes')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDisputes(data || []);
      } catch (error) {
        console.error('Error fetching disputes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [router]); // Remove searchParams from dependencies

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    // Update the URL without causing a page reload
    const url = new URL(window.location.href);
    url.searchParams.delete('notification');
    window.history.replaceState({}, '', url.pathname);
  };

  const Notification = () => {
    if (!showNotification) return null;
    
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have an active dispute in progress. Please wait for it to be resolved before submitting a new one.
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseNotification}
            className="ml-4 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full p-1"
          >
            <svg className="h-5 w-5 text-yellow-400 hover:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Notification />

      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Disputes</h1>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : disputes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No disputes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Submitted on {format(new Date(dispute.created_at), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Dispute ID: {dispute.id}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
                    {dispute.status}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Disputed Accounts</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dispute.accounts.map((account, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <p className="font-medium text-gray-900">{account.lender}</p>
                        <p className="text-gray-500 mt-1">{account.accountType}</p>
                        {account.accountNumber && (
                          <p className="text-gray-500 mt-1 font-mono text-xs">
                            {account.accountNumber}
                          </p>
                        )}
                        <p className="text-gray-500 mt-1">Status: {account.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Report Button */}
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
    </>
  )
}

export default function DisputesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <DisputesContent />
      </Suspense>
    </div>
  )
} 