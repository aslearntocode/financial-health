'use client'

import Header from "@/components/Header"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useEffect } from "react"

export default function CreditReportPage() {
  const router = useRouter()

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      router.push('/login?redirect=/credit/score')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Audio Analysis Section */}
            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Understand and Improve Your Credit Score
                  </h3>
                  <audio 
                    controls 
                    className="w-full focus:outline-none"
                    controlsList="nodownload"
                  >
                    <source src="/credit_analysis.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-sm text-white/80 mt-2">
                    Listen to our expert analysis on understanding your credit score and learn how to further improve it. Timely action can help you get better loan offers.
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Report Image Section */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl p-8 shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">Your Summarized Credit Report</h2>
                <div className="relative h-[600px] w-full">
                  <Image
                    src="/sample-credit-report.jpg"
                    alt="Sample Credit Report"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This is a sample credit report to help you understand what information you'll receive.
                  Your actual report will contain your personal credit information and score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 