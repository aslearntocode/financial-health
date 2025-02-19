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

          // Check for credit report
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
        } catch (err) {
          console.error('Error checking recommendations:', err)
        }
      } else {
        setHasRecommendationAccess(false)
        setHasStockAccess(false)
        setHasCreditReport(false)
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
            
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center space-x-8 ml-8">
              <Link href="/" className="text-black hover:text-gray-700 py-2 text-lg">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-gray-700 py-2 text-lg">
                About Us
              </Link>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <Link 
                    href="/investment"
                    className="text-black hover:text-gray-700 py-2 text-lg mr-1"
                  >
                    Investments
                  </Link>
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
                </div>
              </div>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <Link 
                    href="/credit"
                    className="text-black hover:text-gray-700 py-2 text-lg mr-1"
                  >
                    Credit
                  </Link>
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
                    <span className="text-base">Generate Credit Score Video</span>
                  </Link>
                  {Boolean(user) && Boolean(hasCreditReport) && (
                    <Link
                      href="/credit/score/report"
                      className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">View Credit Report Video</span>
                    </Link>
                  )}
                </div>
              </div>
              {/* <Link href="/learning-center" className="text-white hover:text-white/90 py-2 text-lg">
                Financial Planning Guide
              </Link> */}
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

        {isMenuOpen && (
          <div className="md:hidden py-2 w-full bg-white">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-black hover:text-gray-700 px-2 py-1">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-gray-700 px-2 py-1">
                About Us
              </Link>
              <div>
                <button
                  className="text-black hover:text-gray-700 px-2 py-1 w-full text-left flex items-center"
                  onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                >
                  <span>Investments</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d={isInvestmentDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                {isInvestmentDropdownOpen && (
                  <div className="pl-4">
                    <Link href="/investment" className="block px-2 py-1 text-black hover:text-gray-700">
                      Investment Allocation
                    </Link>
                    {hasRecommendationAccess && (
                      <button
                        onClick={handleMutualFundsDashboard}
                        className="w-full text-left px-2 py-1 text-black hover:text-gray-700"
                      >
                        MF Dashboard
                      </button>
                    )}
                    {hasStockAccess && (
                      <button
                        onClick={handleStocksDashboard}
                        className="w-full text-left px-2 py-1 text-black hover:text-gray-700"
                      >
                        Stocks Dashboard
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="text-black hover:text-gray-700 px-2 py-1 w-full text-left flex items-center"
                  onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                >
                  <span>Credit</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d={isCreditDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                {isCreditDropdownOpen && (
                  <div className="pl-4">
                    <Link href="/credit/score" className="block px-2 py-1 text-black hover:text-gray-700">
                      Check Credit Score
                    </Link>
                    {hasCreditReport && (
                      <Link href="/credit/score/report" className="block px-2 py-1 text-black hover:text-gray-700">
                        View Credit Report
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 