'use client'

import Header from "@/components/Header"
import { useRouter } from 'next/navigation'

export default function MutualFundsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#2563eb] h-[300px]">
        <Header />
        
        {/* Hero Section */}
        <div className="text-center text-white pt-16 px-4">
          <h1 className="text-4xl font-bold mb-4">Mutual Funds</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore recommended mutual funds based on your investment profile
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 -mt-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Top Recommended Mutual Funds</h2>
          
          {/* Add your mutual funds content here */}
          <div className="space-y-6">
            <p className="text-gray-600">
              Content for mutual funds will go here. You can add tables, charts, 
              or any other relevant information about mutual funds.
            </p>

            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 