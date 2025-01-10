'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import Testimonials from "@/components/Testimonials"

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev === 2 ? 0 : prev + 1))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handlePrevious = () => {
    setActiveSection((prev) => (prev === 0 ? 2 : prev - 1))
  }

  const handleNext = () => {
    setActiveSection((prev) => (prev === 2 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8">
              <Link href="/" className="text-white hover:text-white/90">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-white/90">
                About Us
              </Link>
              <Link href="/investment" className="text-white hover:text-white/90">
                Investment
              </Link>
              <Link href="/credit" className="text-white hover:text-white/90">
                Credit
              </Link>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <ProfileDropdown user={user} />
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-white/90 hover:bg-blue-500">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Your Financial Blueprint, Tailored Just for You
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Answer a few simple questions, and we'll recommend a fund distribution strategy that aligns with your goals, risk tolerance, and financial situation.
            </p>
            <div className="flex justify-center">
              <Link href="/investment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Image */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <div className="relative">
              <Image 
                src="/dashboard3.png"
                alt="Investment Dashboard"
                width={600}
                height={338}
                className="w-full"
              />
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </div>
          </div>
        </div>

        {/* Info Section - With animation and container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-xl p-10 relative">
            
            {/* Navigation Buttons */}
            <button 
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white/90 rounded-full p-3 transition-all duration-200"
              aria-label="Previous section"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white/90 rounded-full p-3 transition-all duration-200"
              aria-label="Next section"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row gap-12 min-h-[500px] relative">
              <div 
                className={`w-full space-y-6 transition-all duration-1000 ease-in-out overflow-y-auto ${
                  activeSection === 0 
                    ? "opacity-100 translate-x-0 relative" 
                    : "opacity-0 -translate-x-full absolute"
                }`}
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-white">Why Distribution Matters</h2>
                  <p className="text-base text-white/90 italic">
                    "The right balance between savings, investments, and risk can help you achieve your financial goals faster and with greater confidence."
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Maximize Your Resources</h3>
                    <p className="text-white/90">
                      Allocating your funds wisely ensures every dollar works towards your goals—whether it's building wealth, securing your retirement, or achieving short-term milestones.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Mitigate Risks</h3>
                    <p className="text-white/90">
                      Over-concentrating funds in one area (e.g., high-risk investments or savings accounts with low returns) can leave you vulnerable to unexpected financial shocks. Diversification helps balance growth potential and safety.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Tailored to Your Life Stage</h3>
                    <p className="text-white/90">
                      Your financial needs evolve—someone starting their career will have different priorities than someone nearing retirement. Distribution ensures your money adapts as your life changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Peace of Mind</h3>
                    <p className="text-white/90">
                      A clear, balanced financial plan reduces stress by showing you a roadmap to meet your obligations and build for the future, even during economic uncertainty.
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`w-full space-y-5 transition-all duration-1000 ease-in-out overflow-y-auto ${
                  activeSection === 1 
                    ? "opacity-100 translate-x-0 relative" 
                    : "opacity-0 translate-x-full absolute"
                }`}
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-white">What We Offer</h2>
                  <p className="text-base text-white/90 italic">
                    "We analyze your inputs with advanced AI to provide an actionable and easy-to-understand fund distribution plan."
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Comprehensive Analysis</h3>
                    <p className="text-base text-white/90">We consider various financial instruments, such as:</p>
                    <ul className="list-disc list-inside text-base text-white/90 space-y-1 ml-4">
                      <li>Savings: Emergency funds, short-term goals.</li>
                      <li>Investments: Stocks, bonds, mutual funds, ETFs.</li>
                      <li>Debt Management: Allocating funds to pay off high-interest debts efficiently.</li>
                      <li>Insurance & Retirement Planning: Ensuring long-term financial security.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Actionable Insights</h3>
                    <p className="text-base text-white/90">We don't just give you numbers—we provide easy-to-understand recommendations. For example:</p>
                    <ul className="list-disc list-inside text-base text-white/90 space-y-1 ml-4">
                      <li>"Invest 30% of your monthly savings into a balanced mutual fund portfolio."</li>
                      <li>"Increase your emergency fund to cover six months of expenses."</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Transparent and Dynamic</h3>
                    <p className="text-base text-white/90">
                      Your plan isn't static. You can revisit and adjust it as your financial situation or goals change, ensuring you always stay on track.
                    </p>
                  </div>
                </div>
              </div>

              {/* New Third Section */}
              <div 
                className={`w-full space-y-6 transition-all duration-1000 ease-in-out overflow-y-auto ${
                  activeSection === 2 
                    ? "opacity-100 translate-x-0 relative" 
                    : "opacity-0 translate-x-full absolute"
                }`}
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-white">Suggested Review Frequency</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">Semi-Annual Review (Minimum)</h3>
                      <p className="text-white/90">
                        Why: This allows users to ensure their portfolio remains aligned with their goals and accounts for market changes. 
                        Over time, investments can drift from their original allocation due to varying performance of assets (known as "portfolio drift").
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">Quarterly Review (Recommended for Active Investors)</h3>
                      <p className="text-white/90">
                        Why: If the user actively invests or is working towards shorter-term financial goals, 
                        quarterly reviews help to stay more agile in responding to market trends or life changes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">Additional Reviews Based on Key Life Events or Market Conditions</h3>
                      <ul className="list-disc list-inside text-white/90 space-y-1 ml-4">
                        <li>Major life changes: Marriage, new job, buying a house, retirement planning, etc.</li>
                        <li>Significant market volatility: Economic downturns or major market rallies might require adjustments.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => setActiveSection(0)}
                className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                  activeSection === 0 ? 'bg-white/70' : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label="Show first section"
              />
              <button
                onClick={() => setActiveSection(1)}
                className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                  activeSection === 1 ? 'bg-white/70' : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label="Show second section"
              />
              <button
                onClick={() => setActiveSection(2)}
                className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                  activeSection === 2 ? 'bg-white/70' : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label="Show third section"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Add Testimonials before the closing div */}
      <Testimonials />
    </div>
  )
}
