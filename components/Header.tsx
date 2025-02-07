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
        } catch (err) {
          console.error('Error checking recommendations:', err)
        }
      } else {
        setHasRecommendationAccess(false)
        setHasStockAccess(false)
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
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 w-full overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/BlueLogo.png" 
                alt="Brand Logo" 
                height={64} 
                width={64} 
                className="mr-4" 
              />
            </Link>
            
            <button
              className="md:hidden p-2 text-white"
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
              <Link href="/" className="text-white hover:text-white/90 py-2 text-lg">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 py-2 text-lg">
                About Us
              </Link>
              <Link href="/investment" className="text-white hover:text-white/90 py-2 text-lg">
                Investments
              </Link>
              {hasRecommendationAccess && (
                <Button
                  variant="ghost"
                  onClick={handleMutualFundsDashboard}
                  className="text-white text-2xl hover:bg-transparent hover:text-white/90 px-0 text-lg"
                >
                  MF Dashboard
                </Button>
              )}
              {hasStockAccess && (
                <Button
                  variant="ghost"
                  onClick={handleStocksDashboard}
                  className="text-white text-2xl hover:bg-transparent hover:text-white/90 px-0 text-lg"
                >
                  Stocks Dashboard
                </Button>
              )}
              <Link href="/credit" className="text-white hover:text-white/90 py-2 text-lg">
                Credit
              </Link>
              <Link href="/learning-center" className="text-white hover:text-white/90 py-2 text-lg">
                Financial Planning Guide
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href="/login">
                <button className="text-white hover:text-white/90 whitespace-nowrap">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2 w-full bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-white hover:text-white/90 px-2 py-1">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 px-2 py-1">
                About Us
              </Link>
              <Link href="/investment" className="text-white hover:text-white/90 px-2 py-1">
                Investments
              </Link>
              {hasRecommendationAccess && (
                <Button
                  variant="ghost"
                  onClick={handleMutualFundsDashboard}
                  className="text-white hover:text-white/90"
                >
                  MF Dashboard
                </Button>
              )}
              {hasStockAccess && (
                <Button
                  variant="ghost"
                  onClick={handleStocksDashboard}
                  className="text-white hover:text-white/90"
                >
                  Stocks Dashboard
                </Button>
              )}
              <Link href="/credit" className="text-white hover:text-white/90 px-2 py-1">
                Credit
              </Link>
              <Link href="/learning-center" className="text-white hover:text-white/90 px-2 py-1">
                Financial Planning Guide
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 