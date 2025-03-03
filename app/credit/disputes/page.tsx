'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function DisputesPage() {
  const router = useRouter()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [router]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
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
      </div>
    </div>
  );
} 