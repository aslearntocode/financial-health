'use client'

import Header from "@/components/Header"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CreditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'credit-cards') {
      router.push('/products/credit-card')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-r from-blue-600 to-blue-700" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6 font-serif tracking-wide">
              Meet All Your Credit Needs Here
              <span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/10 font-sans">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-sans">
              Our features will include comprehensive tools to help you understand and improve your credit score and apply for loans
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
              <div 
                className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => router.push('/credit/score')}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  Understand Credit Score through AI Generated Video
                </h3>
                <p className="text-gray-600 font-sans">
                  Watch our detailed video guide explaining how credit scores work, what factors affect them, and proven strategies to improve your score over time.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  Unsecured Loan Application Portal
                </h3>
                <p className="text-gray-600 font-sans">
                  Apply for loans through our trusted lending partners with competitive rates and terms tailored to your credit profile and financial needs.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  Secured Loan Application Portal
                </h3>
                <p className="text-gray-600 font-sans">
                  Access curated secured credit card offers designed to help you build or rebuild your credit score with responsible use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 