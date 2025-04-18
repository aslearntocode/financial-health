'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import Testimonials from "@/components/Testimonials"
import Header from "@/components/Header"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PieChart } from "@/components/PieChart"
import { supabase } from '@/lib/supabase'
import LearningCenterPreview from '@/components/LearningCenterPreview'

interface AllocationItem {
  name: string;
  value: number;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('distribution') // 'distribution' or 'offer'
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [proTipPosition, setProTipPosition] = useState(100)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatForm, setChatForm] = useState({
    name: '',
    message: ''
  })
  const [user, setUser] = useState<any>(null)
  const [latestReport, setLatestReport] = useState<null | {
    date: string;
    type: string;
    score?: number;
    openAccounts?: number;
    closedAccounts?: number;
    totalCreditLimit?: string;
    report_analysis?: any;
  }>(null)
  const [latestAllocation, setLatestAllocation] = useState(null)
  const [reportData, setReportData] = useState<any>(null)
  const [activeCard, setActiveCard] = useState<'investment' | 'credit'>('investment')
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const TOUCH_DELAY = 500 // Minimum time between touches in milliseconds
  const TOUCH_THRESHOLD = 10 // Pixel threshold to determine if it's a tap or scroll
  const [activeServiceCard, setActiveServiceCard] = useState('credit') // Add this new state
  const [isMobile, setIsMobile] = useState(true)

  const testimonials = [
    {
      initial: 'R',
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      color: 'bg-blue-600',
      text: 'This platform helped me diversify my investment portfolio perfectly. The AI-driven recommendations aligned well with my risk tolerance and retirement goals.'
    },
    {
      initial: 'P',
      name: 'Priya Patel',
      role: 'Business Owner',
      color: 'bg-purple-600',
      text: 'As a busy entrepreneur, I needed guidance on balancing my investments. This tool provided clear, actionable advice that helped me achieve a 15% better return on my portfolio.'
    },
    {
      initial: 'A',
      name: 'Amit Kumar',
      role: 'Medical Professional',
      color: 'bg-green-600',
      text: 'The personalized investment strategy considered my age, goals, and risk appetite. It\'s been 6 months, and my portfolio is much more balanced than before.'
    },
    {
      initial: 'N',
      name: 'Neha Gupta',
      role: 'Financial Analyst',
      color: 'bg-red-600',
      text: 'The portfolio rebalancing suggestions are spot-on. I\'ve recommended this tool to many of my clients for its accurate and personalized approach.'
    },
    {
      initial: 'S',
      name: 'Suresh Reddy',
      role: 'Retired Professional',
      color: 'bg-yellow-600',
      text: 'The retirement planning features gave me confidence in my financial future. The recommendations were practical and easy to implement.'
    }
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((current) => 
        current === testimonials.length - 3 ? 0 : current + 1
      )
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

  useEffect(() => {
    const animateProTip = () => {
      setProTipPosition((prev) => {
        if (prev <= -100) {
          // When message exits screen, reset to start position
          return 100
        }
        // Increase speed by 20% (from -0.06 to -0.072)
        return prev - 0.072
      })
    }

    // Decrease interval by 20% (from 40 to 32) for faster animation
    const animation = setInterval(animateProTip, 32)
    return () => clearInterval(animation)
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        // Fetch latest credit report from Supabase
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from('credit_reports')
          .select('created_at, report_analysis')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data) {
          try {
            // Parse the report_analysis if it's a string
            const reportAnalysis = typeof data.report_analysis === 'string' 
              ? JSON.parse(data.report_analysis) 
              : data.report_analysis

            const score = reportAnalysis?.first_block?.score_value || reportAnalysis?.score_details?.score || 0
            
            // Fix: Properly format the date from Supabase
            const formattedDate = new Date(data.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
            
            const report = {
              date: formattedDate, // Use the formatted date
              type: 'Credit Analysis',
              score: parseInt(score)
            }
            setLatestReport(report)
          } catch (parseError) {
            console.error("Error parsing report data:", parseError)
            setLatestReport(null)
          }
        } else {
          setLatestReport(null)
        }
      } else {
        setLatestReport(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchAllocation = async () => {
      if (user) {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from('investment_records')
          .select('allocation')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data?.allocation) {
          setLatestAllocation(data.allocation);
        }
      }
    };

    fetchAllocation();
  }, [user]);

  useEffect(() => {
    const fetchReport = async () => {
      if (user) {  // Only fetch if user is logged in
        const { data: reports } = await supabase
          .from('credit_reports')
          .select('*')
          .eq('user_id', user.uid)  // Filter by user_id
          .order('created_at', { ascending: false })
          .limit(1);

        if (reports && reports[0]) {
          // Format the date from created_at
          const formattedDate = new Date(reports[0].created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          // Parse the report_analysis JSON if it's stored as a string
          const parsedReport = {
            ...reports[0],
            report_analysis: typeof reports[0].report_analysis === 'string' 
              ? JSON.parse(reports[0].report_analysis)
              : reports[0].report_analysis,
            formattedDate // Add the formatted date to the parsed report
          };
          setReportData(parsedReport);
        }
      }
    };

    fetchReport();
  }, [user]); // Add user to dependency array

  // Debug log for render
  console.log("Render state:", { user: !!user, latestReport })

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add country code (+91 for India) and remove any spaces or special characters
    const phoneNumber = "919321314553" // Added 91 prefix for India
    const whatsappMessage = encodeURIComponent(`Name: ${chatForm.name}\nMessage: ${chatForm.message}`)
    window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank')
    setIsChatOpen(false) // Close the popup after sending
    setChatForm({ name: '', message: '' }) // Reset form
  }

  // Common card styles
  const cardStyles = "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 w-[380px] min-h-[400px]";
  const headerStyles = "flex items-center gap-2 mb-4 p-2 rounded-lg";
  const iconContainerStyles = "p-2 rounded-lg";
  const titleStyles = "text-gray-900 font-semibold text-lg";
  const buttonStyles = "w-full flex items-center justify-center gap-2 text-blue-600 font-medium py-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mt-2";

  const MobileCarousel = () => {
    return (
      <div className="md:hidden px-4">
        {!user ? (
          <div className="flex flex-col gap-4">
            {/* Remove standalone buttons */}
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4 justify-center">
              <button
                onClick={() => setActiveCard('investment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeCard === 'investment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                Investment
              </button>
              <button
                onClick={() => setActiveCard('credit')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeCard === 'credit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                Credit
              </button>
            </div>

            <div className="transition-all duration-500 ease-in-out">
              {activeCard === 'investment' ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-full">
                  {latestAllocation ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-blue-600/10">
                        <div className="p-2 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-semibold text-lg">Investment Allocation</span>
                      </div>

                      <div className="space-y-2.5 my-4">
                        {[...Array(6)].map((_, index) => {
                          const item = latestAllocation?.[index] as AllocationItem | undefined;
                          return (
                            <div key={item?.name || `empty-${index}`} className="flex justify-between items-center">
                              <span className="text-gray-600">
                                {item?.name || '\u00A0'}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {item?.value ? `${item.value}%` : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2 pt-4">
                        <Link 
                          href="/investment" 
                          className={buttonStyles}
                        >
                          View Full Investment Allocation
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        
                        <Link 
                          href="/investment" 
                          className={buttonStyles}
                        >
                          Update Risk Profile
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-6 w-full">
                      <h3 className="text-xl font-bold text-blue-600 mb-4">Investment Planning</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">1</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Fill Investment Form</h4>
                            <p className="text-sm text-gray-600">Share your financial goals and risk appetite by filling our investment form</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">2</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Get Portfolio Strategy</h4>
                            <p className="text-sm text-gray-600">Receive AI-driven fund distribution recommendations to allocate your funds optimally</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">3</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Start Investing</h4>
                            <p className="text-sm text-gray-600">Get specific investment recommendations and begin your journey</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link 
                          href="/investment" 
                          className="w-full inline-block text-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                          Start Investment Planning
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-full">
                  {latestReport && (latestReport.score ?? 0) > 0 ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-green-600/10">
                        <div className="p-2 rounded-lg">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-semibold text-lg">Credit Report</span>
                      </div>

                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-gray-500">Generated on:</p>
                          <p className="font-medium text-gray-900">{reportData?.formattedDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Score:</p>
                          <p className={`font-semibold text-2xl ${
                            (reportData?.report_analysis?.score_details?.score >= 750) ? 'text-green-600' :
                            (reportData?.report_analysis?.score_details?.score >= 600) ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{reportData?.report_analysis?.score_details?.score}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Open Accounts</span>
                          <span className="font-semibold text-gray-900">
                            {reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["ACTIVE-ACCOUNTS"] || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Closed Accounts</span>
                          <span className="font-semibold text-gray-900">
                            {(parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["NUMBER-OF-ACCOUNTS"] || "0") - 
                             parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["ACTIVE-ACCOUNTS"] || "0")) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Credit Limit</span>
                          <span className="font-semibold text-gray-900">
                            ₹{(parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["TOTAL-CC-SANCTION-AMOUNT-ALL-ACCOUNT"] || "0"))?.toLocaleString('en-IN') || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Link 
                          href="/credit/score/report" 
                          className={buttonStyles}
                        >
                          View Credit Report Summary Video
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        
                        <Link 
                          href="/credit/score"
                          className={`${buttonStyles} ${
                            new Date().getTime() - new Date(reportData?.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000 
                              ? 'opacity-50 pointer-events-none'
                              : ''
                          }`}
                        >
                          Refresh Analysis
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-6 w-full">
                      <h3 className="text-xl font-bold text-green-600 mb-4">Credit Solutions</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">1</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Credit Score</h4>
                            <p className="text-sm text-gray-600">Understand Your Credit Score through our AI generated personalized video and summary</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">2</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Get Recommendations</h4>
                            <p className="text-sm text-gray-600">Receive personalized recommendations for score improvement and simplify account management</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">3</span>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">Apply for Products</h4>
                            <p className="text-sm text-gray-600">Apply for secured and unsecured loans with higher chances of approval</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link 
                          href="/credit/score" 
                          className="w-full inline-block text-center rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                        >
                          Get Started with Credit Solutions
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartTime(Date.now())
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default touch behavior
    
    const now = Date.now()
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    // Calculate touch duration and distance
    const touchDuration = now - touchStartTime
    const touchDistance = Math.sqrt(
      Math.pow(touchEndX - touchStartX, 2) + 
      Math.pow(touchEndY - touchStartY, 2)
    )
    
    // Check if enough time has passed since last touch
    if (now - lastTouchTime < TOUCH_DELAY) {
      return // Ignore touches that are too close together
    }
    
    // Only handle as tap if:
    // 1. Touch duration is less than 500ms
    // 2. Touch distance is less than threshold (to differentiate from scrolling)
    if (touchDuration < 500 && touchDistance < TOUCH_THRESHOLD) {
      const target = e.target as HTMLElement
      const clickableElement = target.closest('a, button') as HTMLElement
      
      if (clickableElement) {
        setLastTouchTime(now)
        clickableElement.click()
      }
    }
  }

  return (
    <div 
      className="min-h-screen bg-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="relative z-[100]">
        <Header />
      </div>
      
      <main>
        {/* Hero Section - no special z-index needed */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Your AI-Powered Personalized Financial Health Solution
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized recommendations for both investments and credit decisions. We help you build wealth and manage debt intelligently.
          </p>
        </div>

        {/* Mobile View - only apply z-index to the cards themselves */}
        <div className="relative mb-8">
          {user && (latestAllocation || latestReport) ? (
            <MobileCarousel />
          ) : null}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex justify-center items-start gap-8 flex-wrap mb-8">
          {user && (latestAllocation || latestReport) ? (
            // Logged in view with at least one recommendation
            <>
              {/* Credit Card - Always First */}
              {latestReport && (latestReport.score ?? 0) > 0 ? (
                <div className="hidden md:block">
                  <div className={cardStyles}>
                    <div className="p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className={`${headerStyles} bg-green-600/10`}>
                          <div className={iconContainerStyles}>
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                          </div>
                          <span className={titleStyles}>Credit Report</span>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-gray-500">Generated on:</p>
                            <p className="font-medium text-gray-900">{reportData?.formattedDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500">Score:</p>
                            <p className={`font-semibold text-2xl ${
                              (reportData?.report_analysis?.score_details?.score >= 750) ? 'text-green-600' :
                              (reportData?.report_analysis?.score_details?.score >= 600) ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{reportData?.report_analysis?.score_details?.score}</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Open Accounts</span>
                            <span className="font-semibold text-gray-900">
                              {reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["ACTIVE-ACCOUNTS"] || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Closed Accounts</span>
                            <span className="font-semibold text-gray-900">
                              {(parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["NUMBER-OF-ACCOUNTS"] || "0") - 
                               parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["ACTIVE-ACCOUNTS"] || "0")) || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Credit Limit</span>
                            <span className="font-semibold text-gray-900">
                              ₹{(parseInt(reportData?.report_analysis?.account_summary?.["PRIMARY-ACCOUNTS-SUMMARY"]?.["TOTAL-CC-SANCTION-AMOUNT-ALL-ACCOUNT"] || "0"))?.toLocaleString('en-IN') || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Link 
                          href="/credit/score/report" 
                          className={buttonStyles}
                        >
                          View Full Report
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        
                        <button 
                          className={`${buttonStyles} ${
                            new Date().getTime() - new Date(reportData?.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000 
                              ? 'opacity-50 pointer-events-none'
                              : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (new Date().getTime() - new Date(reportData?.created_at).getTime() > 30 * 24 * 60 * 60 * 1000) {
                              window.location.href = '/credit/score';
                            }
                          }}
                        >
                          Refresh Analysis
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-6 w-[380px] min-h-[400px] shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-green-600 mb-4">Credit Solutions</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Credit Score</h4>
                        <p className="text-sm text-gray-600">Understand Your Credit Score through our AI generated personalized video and summary</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Get Recommendations</h4>
                        <p className="text-sm text-gray-600">Receive personalized recommendations for score improvement and simplify account management</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Apply for Products</h4>
                        <p className="text-sm text-gray-600">Apply for secured and unsecured loans with higher chances of approval</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[72px]">
                    <Link 
                      href="/credit/score" 
                      className="w-full inline-block text-center rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                    >
                      Get Started with Credit Solutions
                    </Link>
                  </div>
                </div>
              )}

              {/* Investment Card - Always Second */}
              {latestAllocation ? (
                <div className="hidden md:block">
                  <div className={cardStyles}>
                    <div className="p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className={`${headerStyles} bg-blue-600/10`}>
                          <div className={iconContainerStyles}>
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                          <span className={titleStyles}>Investment Allocation</span>
                        </div>

                        <div className="space-y-2.5 my-4">
                          {[...Array(6)].map((_, index) => {
                            const item = latestAllocation?.[index] as AllocationItem | undefined;
                            return (
                              <div key={item?.name || `empty-${index}`} className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  {item?.name || '\u00A0'}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {item?.value ? `${item.value}%` : ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Link 
                          href="/investment" 
                          className={buttonStyles}
                        >
                          View Full Investment Allocation
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        
                        <Link 
                          href="/investment" 
                          className={buttonStyles}
                        >
                          Update Risk Profile
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-6 w-[380px] min-h-[400px] shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-blue-600 mb-4">Investment Planning</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Fill Investment Form</h4>
                        <p className="text-sm text-gray-600">Share your financial goals and risk appetite by filling our investment form</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Get Portfolio Strategy</h4>
                        <p className="text-sm text-gray-600">Receive AI-driven fund distribution recommendations to allocate your funds optimally</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold mb-1">Start Investing</h4>
                        <p className="text-sm text-gray-600">Get specific investment recommendations and begin your journey</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href="/investment" 
                      className="w-full inline-block text-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Start Investment Planning
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Steps Container - Update to show both services */}
        {(!user || (!latestAllocation && !latestReport)) && (
          <div className="max-w-6xl mx-auto mt-0 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">Our Services</h2>
            
            {/* Mobile View Controls */}
            <div className="flex justify-center gap-4 mb-4 md:hidden">
              <button
                onClick={() => setActiveServiceCard('credit')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeServiceCard === 'credit'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Credit
              </button>
              <button
                onClick={() => setActiveServiceCard('investment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeServiceCard === 'investment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Investment
              </button>
            </div>

            <div className="md:grid md:grid-cols-2 gap-4 md:gap-8 px-4">
              {/* Credit Service */}
              <div className={`bg-green-50 rounded-xl p-6 md:p-8 shadow-lg transition-all duration-300 ${
                activeServiceCard === 'credit' || !isMobile ? 'block' : 'hidden'
              }`}>
                <h3 className="text-xl md:text-2xl font-bold text-green-600 mb-4 md:mb-6">Credit Solutions</h3>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Credit Score</h4>
                      <p className="text-sm md:text-base text-gray-600">Understand Your Credit Score through our AI generated personalized video and summary</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Get Recommendations</h4>
                      <p className="text-sm md:text-base text-gray-600">Receive personalized recommendations for score improvement and simplify account management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Apply for Products</h4>
                      <p className="text-sm md:text-base text-gray-600">Apply for secured and unsecured loans with higher chances of approval</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-8">
                  <Link 
                    href="/credit/score" 
                    className="w-full inline-block text-center rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    Generate Personalized Credit Score Video
                  </Link>
                </div>
              </div>

              {/* Investment Service */}
              <div className={`bg-blue-50 rounded-xl p-6 md:p-8 shadow-lg transition-all duration-300 ${
                activeServiceCard === 'investment' || !isMobile ? 'block' : 'hidden'
              }`}>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6">Investment Planning</h3>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Fill Investment Form</h4>
                      <p className="text-sm md:text-base text-gray-600">Share your financial goals and risk appetite by filling our investment form</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Get Portfolio Strategy</h4>
                      <p className="text-sm md:text-base text-gray-600">Receive AI-driven fund distribution recommendations to allocate your funds optimally</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-lg font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-base md:font-semibold mb-1 md:mb-2">Start Investing</h4>
                      <p className="text-sm md:text-base text-gray-600">Get specific investment recommendations and begin your journey</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-8">
                  <Link 
                    href="/investment" 
                    className="w-full inline-block text-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Start Investment Planning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What We Offer Section */}
        <div className="bg-gray-50 py-16 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
            <p className="text-xl text-center text-gray-600 mb-12 italic">
              &quot;We analyze your inputs with advanced AI to provide an actionable and easy-to-understand fund distribution plan.&quot;
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Credit Solutions Box - Now First */}
              <div className="bg-white p-8 rounded-lg shadow-md col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-green-600">Credit Solutions</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Credit Card Recommendations</li>
                  <li>• Debt Consolidation Strategies</li>
                  <li>• Credit Score Improvement Tips</li>
                  <li>• Settle Overdue or Written Off Loans</li>
                  <li>• Raise Disputes in the Credit Report</li>
                </ul>
              </div>

              {/* Investment Analysis Box - Now Second */}
              <div className="bg-white p-8 rounded-lg shadow-md col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Investment Planning</h3>
                <p className="text-gray-600 mb-4">Comprehensive investment planning including:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Portfolio Optimization and Rebalancing</li>
                  <li>• Mutual Funds Recommendations</li>
                  <li>• Stock Recommendations</li>
                  <li>• Risk Assessment and Management</li>
                  <li>• Retirement Planning Strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            {/* Desktop Testimonials Slider */}
            <div className="relative hidden md:block">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonialIndex * (100/3)}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="w-1/3 flex-shrink-0 px-4"
                    >
                      <div className="bg-white p-6 rounded-lg shadow h-full">
                        <div className={`w-12 h-12 ${testimonial.color} rounded-full text-white flex items-center justify-center text-xl font-bold mb-4`}>
                          {testimonial.initial}
                        </div>
                        <h3 className="font-semibold mb-2">{testimonial.name}</h3>
                        <p className="text-gray-500 mb-4">{testimonial.role}</p>
                        <p className="text-gray-600">{testimonial.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Slider Controls */}
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: testimonials.length - 2 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentTestimonialIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Testimonials Slider */}
            <div className="md:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 w-max pb-4">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="w-[300px] flex-shrink-0 px-4"
                    >
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className={`w-12 h-12 ${testimonial.color} rounded-full text-white flex items-center justify-center text-xl font-bold mb-4`}>
                          {testimonial.initial}
                        </div>
                        <h3 className="font-semibold mb-2">{testimonial.name}</h3>
                        <p className="text-gray-500 mb-4">{testimonial.role}</p>
                        <p className="text-gray-600">{testimonial.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Slider Indicator Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {testimonials.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === Math.floor(currentTestimonialIndex) ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <LearningCenterPreview />
      </main>
    </div>
  )
}
