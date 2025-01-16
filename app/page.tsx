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
    const timer = setInterval(() => {
      setActiveSection((current) => current === 'distribution' ? 'offer' : 'distribution')
    }, 10000) // Switch every 10 seconds

    return () => clearInterval(timer)
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
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
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
            Get Started
          </Link>
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Image
          src="/dashboard3.png"
          alt="Investment Dashboard Preview"
          width={900}
          height={450}
          priority
          className="rounded-lg shadow-2xl w-full h-auto"
        />
      </div>

      {/* Sliding Sections Container */}
      <div className="relative overflow-hidden mb-16">
        {/* Why Distribution Matters Section */}
        <div className={`transition-all duration-1000 ${
          activeSection === 'distribution' 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        } absolute w-full ${activeSection === 'offer' ? 'pointer-events-none' : ''}`}>
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">Why Distribution Matters</h2>
              <p className="text-xl text-center text-gray-600 mb-12 italic">
                &quot;The right balance between savings, investments, and risk can help you achieve your financial goals faster and with greater confidence.&quot;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className={`transition-all duration-1000 ${
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
                    We don&apos;t just give you numbers—we provide easy-to-understand recommendations. For example:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• &quot;Invest 30% of your monthly savings into a balanced mutual fund portfolio.&quot;</li>
                    <li>• &quot;Increase your emergency fund to cover six months of expenses.&quot;</li>
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

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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

        {/* Spacer div to maintain layout flow */}
        <div className="h-[650px]" />
      </div>

      {/* Updated Testimonials Section */}
      <div className="py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          {/* Testimonials Slider */}
          <div className="relative">
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

            {/* Slider Controls */}
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
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Investment Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white">Security</Link></li>
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
