'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasRecommendationAccess, setHasRecommendationAccess] = useState(false)
  const [hasStockAccess, setHasStockAccess] = useState(false)
  const [isInvestmentDropdownOpen, setIsInvestmentDropdownOpen] = useState(false)
  const [isCreditDropdownOpen, setIsCreditDropdownOpen] = useState(false)
  const [hasCreditReport, setHasCreditReport] = useState(false)
  const [hasDisputes, setHasDisputes] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user?.uid) {
        try {
          // Check for mutual fund recommendations
          const { data: mfData, error: mfError } = await supabaseClient
            .from('mutual_fund_recommendations')
            .select('id')
            .eq('user_id', user.uid)
            .order('created_at', { ascending: false })
            .limit(1)

          if (mfError) {
            console.error('Error checking MF access:', mfError)
          }
          setHasRecommendationAccess(Boolean(mfData?.length))

          // Check for stock recommendations - aligned with MF check
          const { data: stockData, error: stockError } = await supabaseClient
            .from('stock_recommendations')
            .select('id')
            .eq('user_id', user.uid)
            .order('created_at', { ascending: false })
            .limit(1)

          if (stockError) {
            console.error('Error checking stock access:', stockError)
          }
          setHasStockAccess(Boolean(stockData?.length))

          // First check for credit report
          const { data: creditData, error: creditError } = await supabaseClient
            .from('credit_reports')
            .select('id')
            .eq('user_id', user.uid)
            .order('created_at', { ascending: false })
            .limit(1)

          if (creditError) {
            console.error('Error checking credit access:', creditError)
          }
          setHasCreditReport(Boolean(creditData?.length))

          // Check if user has any disputes in the disputes table
          const { data: disputeData, error: disputeError } = await supabaseClient
            .from('disputes')
            .select('id')
            .eq('user_id', user.uid)
            .limit(1)

          if (disputeError) {
            console.error('Error checking disputes:', disputeError)
          }
          // Only show disputes link if user has submitted disputes before
          setHasDisputes(Boolean(disputeData?.length))

        } catch (err) {
          console.error('Error checking user data:', err)
        }
      } else {
        // Reset all states when user is not logged in
        setHasRecommendationAccess(false)
        setHasStockAccess(false)
        setHasCreditReport(false)
        setHasDisputes(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleMutualFundsDashboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('MF Dashboard clicked')

    if (!user) {
      console.log('No user, redirecting to login')
      router.push('/login')
      return
    }

    try {
      // Get the latest recommendation from Supabase
      const { data, error } = await supabase
        .from('mutual_fund_recommendations')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('Latest MF recommendation query result:', { data, error })

      if (error) throw error

      if (data && data.length > 0) {
        const latestRec = data[0]
        console.log('Found MF recommendation:', latestRec)
        // Remove localStorage.setItem and just redirect with the ID
        router.push(`/recommendations/mutual-funds?id=${latestRec.id}`)
      } else {
        console.log('No MF recommendations found')
        router.push('/investment')
      }
    } catch (error) {
      console.error('Error fetching MF recommendations:', error)
      router.push('/investment')
    }
  }

  const handleStocksDashboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Stocks Dashboard clicked')

    if (!user) {
      console.log('No user, redirecting to login')
      router.push('/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('Latest stock recommendation query result:', { data, error })

      if (error) throw error

      if (data && data.length > 0) {
        const latestRec = data[0]
        console.log('Found stock recommendation:', latestRec)
        router.push(`/recommendations/stocks?id=${latestRec.id}`)
      } else {
        console.log('No stock recommendations found')
        router.push('/investment')
      }
    } catch (error) {
      console.error('Error fetching stock recommendations:', error)
      router.push('/investment')
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Stocks Dashboard', href: '/stocks-dashboard' },
    { name: 'Existing Portfolio Tracker', href: '/investment/portfolio-tracker' }
  ]

  return (
    <header className="bg-white w-full overflow-x-hidden border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Logo_Final3.jpeg" 
                alt="Brand Logo" 
                height={144} 
                width={144} 
                className="h-16 w-auto" 
                priority
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 ml-8">
              <Link href="/" className="text-black hover:text-gray-700 py-2 text-lg">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-gray-700 py-2 text-lg">
                About Us
              </Link>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-lg mr-1"
                  >
                    Investments
                  </button>
                  <button 
                    onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                    className="p-1"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className={`transition-transform duration-200 ${isInvestmentDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className={`
                    fixed w-64 bg-white rounded-lg shadow-lg py-2
                    ${isInvestmentDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '28rem'
                  }}
                >
                  <Link 
                    href="/investment" 
                    className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                  >
                    <span className="text-base">Investment Allocation</span>
                  </Link>
                  {Boolean(user) && Boolean(hasRecommendationAccess) && (
                    <button
                      onClick={handleMutualFundsDashboard}
                      className="w-full flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">MF Dashboard</span>
                    </button>
                  )}
                  {Boolean(user) && Boolean(hasStockAccess) && (
                    <button
                      onClick={handleStocksDashboard}
                      className="w-full flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">Stocks Dashboard</span>
                    </button>
                  )}
                  {Boolean(user) && (
                    <Link 
                      href="/investment/portfolio-tracker" 
                      className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">Existing Portfolio Tracker</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-lg mr-1"
                  >
                    Credit
                  </button>
                  <button 
                    onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                    className="p-1"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className={`transition-transform duration-200 ${isCreditDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className={`
                    fixed w-64 bg-white rounded-lg shadow-lg py-2
                    ${isCreditDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '36rem'
                  }}
                >
                  <Link 
                    href="/credit/score" 
                    className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                  >
                    <span className="text-base">Generate Credit Score Summary</span>
                  </Link>
                  <Link
                    href="/credit/simulator"
                    className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                  >
                    <span className="text-base">Credit Score Simulator</span>
                  </Link>
                  {Boolean(user) && Boolean(hasCreditReport) && (
                    <Link
                      href="/credit/score/report"
                      className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">View Credit Report Summary</span>
                    </Link>
                  )}
                  {Boolean(user) && Boolean(hasDisputes) && (
                    <Link
                      href="/credit/disputes"
                      className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">Your Disputes</span>
                    </Link>
                  )}
                </div>
              </div>
              <Link href="/learning-center" className="text-black hover:text-gray-700 py-2 text-lg">
                Learning Center
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href="/login">
                <button className="text-black hover:text-gray-700 whitespace-nowrap">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden py-2 w-full bg-white fixed bottom-0 left-0 border-t border-gray-200 shadow-lg" style={{ position: 'fixed', bottom: 0, zIndex: 9999 }}>
          <div className="flex justify-around items-center px-1 pb-6">
            <Link href="/" className="text-black hover:text-gray-700 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link href="/about" className="text-black hover:text-gray-700 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">About</span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs mt-1">Invest</span>
              </button>
              {isInvestmentDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link 
                    href="/investment" 
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                  >
                    Investment Allocation
                  </Link>
                  {Boolean(user) && (
                    <Link 
                      href="/investment/portfolio-tracker" 
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                    >
                      Portfolio Tracker
                    </Link>
                  )}
                  {Boolean(user) && Boolean(hasRecommendationAccess) && (
                    <button
                      onClick={handleMutualFundsDashboard}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50"
                    >
                      MF Dashboard
                    </button>
                  )}
                  {Boolean(user) && Boolean(hasStockAccess) && (
                    <button
                      onClick={handleStocksDashboard}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50"
                    >
                      Stocks Dashboard
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs mt-1">Credit</span>
              </button>
              {isCreditDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link 
                    href="/credit/score" 
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                  >
                    Generate Credit Score Summary
                  </Link>
                  <Link
                    href="/credit/simulator"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                  >
                    Credit Score Simulator
                  </Link>
                  {Boolean(user) && Boolean(hasCreditReport) && (
                    <Link
                      href="/credit/score/report"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                    >
                      View Credit Report Summary
                    </Link>
                  )}
                  {Boolean(user) && Boolean(hasDisputes) && (
                    <Link
                      href="/credit/disputes"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                    >
                      Your Disputes
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link href="/learning-center" className="text-black hover:text-gray-700 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs mt-1">Learn</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 