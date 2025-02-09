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
import ReturnComparisonBox from "@/components/ReturnComparisonBox"

export default function Home() {
  const [activeSection, setActiveSection] = useState('distribution') // 'distribution' or 'offer'
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

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
    if (window.innerWidth >= 768) {  // Only run on desktop
      const timer = setInterval(() => {
        setActiveSection((current) => current === 'distribution' ? 'offer' : 'distribution')
      }, 10000) // Switch every 10 seconds

      return () => clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((current) => 
        current === testimonials.length - 3 ? 0 : current + 1
      )
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <main className="min-h-screen bg-white relative">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Your Financial Blueprint, Tailored Just for You
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Answer a few simple questions, and we&apos;ll recommend a fund distribution strategy that 
          aligns with your goals, risk tolerance, and financial situation.
        </p>
        <div className="flex justify-center">
          <Link
            href="/investment"
            className="inline-block rounded-md bg-black px-6 py-2.5 text-base font-semibold text-white hover:bg-gray-800"
          >
            Click Here to Get Your Personalized Fund Distribution Strategy
          </Link>
        </div>
      </div>

      {/* Add ReturnComparisonBox here */}
      <ReturnComparisonBox />

      {/* Steps Container */}
      <div className="max-w-5xl mx-auto mt-12 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">How It Works - It's Just 3 Easy Steps</h2>
        
        <div className="grid md:grid-cols-3 gap-6 px-4">
          {/* Step 1 */}
          <div className="bg-blue-50 rounded-xl p-6 text-center transition-transform hover:scale-105 duration-300">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Fill Investment Form</h3>
            <p className="text-gray-600">
              Complete the investment form to help us understand your financial health and goals
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-blue-50 rounded-xl p-6 text-center transition-transform hover:scale-105 duration-300">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Get Fund Distribution</h3>
            <p className="text-gray-600">
              Generate a pie chart showing optimal distribution of your investments across different financial instruments. 
              Additionally, you get to see the risk and expected returns of the suggested portfolio.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-blue-50 rounded-xl p-6 text-center transition-transform hover:scale-105 duration-300">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Start Your Journey</h3>
            <p className="text-gray-600">
              Get specific mutual funds and stocks recommendations to begin your wealth building journey
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Image
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <Image
            src="/HomePageDashboard.png"
            alt="Investment Dashboard Preview"
            width={900}
            height={450}
            priority
            className="rounded-lg shadow-2xl w-full h-auto blur-[1px]"
          />
        </div>
      </div> */}

      {/* Sliding Sections Container */}
      <div className="relative overflow-hidden mb-16">
        {/* Why Distribution Matters Section */}
        <div className={`transition-all duration-3000 ${
          activeSection === 'distribution' || window.innerWidth < 768
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        } absolute w-full ${activeSection === 'offer' && window.innerWidth >= 768 ? 'pointer-events-none' : ''}`}>
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">Why Distribution Matters</h2>
              <p className="text-xl text-center text-gray-600 mb-12 italic">
                &quot;The right balance between savings, investments, and risk can help you achieve your financial goals faster and with greater confidence.&quot;
              </p>
              
              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Maximize Your Resources</h3>
                  <p className="text-gray-600">
                    Allocating your funds wisely ensures every dollar works towards your goals—whether it&apos;s building wealth, securing your retirement, or achieving short-term milestones.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Mitigate Risks</h3>
                  <p className="text-gray-600">
                    Over-concentrating funds in one area can leave you vulnerable to unexpected financial shocks. Diversification helps balance growth potential and safety.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Tailored to Your Life Stage</h3>
                  <p className="text-gray-600">
                    Your financial needs evolve—someone starting their career will have different priorities than someone nearing retirement. Distribution ensures your money adapts as your life changes.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Peace of Mind</h3>
                  <p className="text-gray-600">
                    A clear, balanced financial plan reduces stress by showing you a roadmap to meet your obligations and build for the future, even during economic uncertainty.
                  </p>
                </div>
              </div>

              {/* Mobile Slider */}
              <div className="md:hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 w-max pb-4">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[280px] flex-shrink-0">
                      <h3 className="text-xl font-semibold mb-4">Maximize Your Resources</h3>
                      <p className="text-gray-600">
                        Allocating your funds wisely ensures every dollar works towards your goals—whether it&apos;s building wealth, securing your retirement, or achieving short-term milestones.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md w-[280px] flex-shrink-0">
                      <h3 className="text-xl font-semibold mb-4">Mitigate Risks</h3>
                      <p className="text-gray-600">
                        Over-concentrating funds in one area can leave you vulnerable to unexpected financial shocks. Diversification helps balance growth potential and safety.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md w-[280px] flex-shrink-0">
                      <h3 className="text-xl font-semibold mb-4">Tailored to Your Life Stage</h3>
                      <p className="text-gray-600">
                        Your financial needs evolve—someone starting their career will have different priorities than someone nearing retirement. Distribution ensures your money adapts as your life changes.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md w-[280px] flex-shrink-0">
                      <h3 className="text-xl font-semibold mb-4">Peace of Mind</h3>
                      <p className="text-gray-600">
                        A clear, balanced financial plan reduces stress by showing you a roadmap to meet your obligations and build for the future, even during economic uncertainty.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Optional: Add scroll indicator dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className={`transition-all duration-3000 hidden md:block ${
          activeSection === 'offer' 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
        } absolute w-full ${activeSection === 'distribution' ? 'pointer-events-none' : ''}`}>
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
              <p className="text-xl text-center text-gray-600 mb-12 italic">
                &quot;We analyze your inputs with advanced AI to provide an actionable and easy-to-understand fund distribution plan.&quot;
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Comprehensive Analysis Box */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Comprehensive Analysis</h3>
                  <p className="text-gray-600 mb-4">We consider various financial instruments, such as:</p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Savings: Emergency funds, short-term goals.</li>
                    <li>• Investments: Stocks, bonds, mutual funds, ETFs.</li>
                    <li>• Debt Management: Allocating funds to pay off high-interest debts efficiently.</li>
                    <li>• Insurance & Retirement Planning: Ensuring long-term financial security.</li>
                  </ul>
                </div>

                {/* Actionable Insights Box */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Actionable Insights</h3>
                  <p className="text-gray-600 mb-4">
                    We don&apos;t just give you numbers—we provide easy-to-understand AI generated recommendations. For example:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• &quot;Invest 30% of your monthly savings into a balanced mutual fund portfolio.&quot;</li>
                    <li>• &quot;Suggest the Mutual Funds, Stocks etc. based on your risk appetite.&quot;</li>
                  </ul>
                </div>

                {/* Transparent and Dynamic Box */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Transparent and Dynamic</h3>
                  <p className="text-gray-600">
                    Your plan isn&apos;t static. You can revisit and adjust it as your financial situation or goals change, 
                    ensuring you always stay on track.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators - Hide on Mobile */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-2">
          <button
            onClick={() => setActiveSection('distribution')}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSection === 'distribution' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
          <button
            onClick={() => setActiveSection('offer')}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSection === 'offer' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        </div>

        {/* Spacer div - Adjust height for mobile */}
        <div className="h-[650px] md:h-[650px]" />
      </div>

      {/* Did You Know Section */}
      <div className="bg-blue-50 py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute inset-2 bg-blue-200 rounded-full opacity-50"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">💡</span>
                Did You Know?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Closed-End Funds */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Closed-End Mutual Funds</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Fixed Number of Shares</strong> – They issue a fixed number of shares through an IPO and trade on the stock exchange like stocks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Market Price Fluctuations</strong> – Prices depend on supply and demand, often trading at a premium or discount to NAV.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>No Direct Redemption</strong> – Investors buy/sell on the secondary market instead of redeeming shares from the fund.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Active Trading</strong> – Can be actively managed with leverage, making them riskier but potentially more profitable.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Dividends & Distributions</strong> – Often provide regular income through dividends.</span>
                    </li>
                  </ul>
                </div>

                {/* Open-End Funds */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">Open-End Mutual Funds</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Unlimited Shares</strong> – Investors can buy and redeem shares directly from the fund at the NAV price.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Price Based on NAV</strong> – Shares are priced once a day based on the total value of fund assets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Liquidity</strong> – Easier to buy/sell as redemptions happen directly with the fund.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Management Style</strong> – Can be actively or passively managed (e.g., index funds).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>No Exchange Trading</strong> – Unlike closed-end funds, they don't trade on stock exchanges.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/learning-center/mutual-funds/types"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group mt-4"
              >
                Learn More About Mutual Funds
                <svg 
                  className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section - New Addition */}
      <div className="bg-white py-16 relative">
        {/* Beta Testing Overlay */}
        <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-xl max-w-2xl mx-4 text-center">
            <h3 className="text-2xl font-bold mb-2">🎉 Free During Beta Testing!</h3>
            <p className="text-lg">
              We're currently in beta and offering all premium features completely free. 
              Try it out and share your valuable feedback with us.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative opacity-50">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 w-full max-w-sm">
              <div className="text-sm font-semibold text-gray-600 mb-4">For Beginners</div>
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold">₹999</span>
                <span className="text-gray-600">/half-yearly</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Generate a personalized investment allocation dashboard
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Get recommendations on Mutual Funds based on your risk appetite
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Generate up to 3 portfolios in six months
                </li>
                
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Chat Support
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white rounded-md py-3 font-semibold hover:bg-gray-800 transition-colors">
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600 w-full max-w-sm relative">
              <div className="absolute -top-3 right-8 bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
                Recommended
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-4">For Investors</div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold">₹1199</span>
                <span className="text-gray-600">/half-yearly</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Generate a personalized investment allocation dashboard
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Get recommendations on Mutual Funds, Stocks, Bonds etc. based on your risk appetite
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Generate up to 5 portfolios in six months
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Chat Support
                </li>
                
              </ul>
              <button className="w-full bg-blue-600 text-white rounded-md py-3 font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/learning-center" className="text-gray-400 hover:text-white">Learning Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.youtube.com/@FHAI-InvCredit" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/financialhealth" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com/fhainvcredit" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@financialhealth.co.in</li>
                <li>+91 93213 14553</li>
                <li>Mumbai 400012<br />India</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Financial Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
