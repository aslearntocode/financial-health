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
// import ReturnComparisonBox from "@/components/ReturnComparisonBox"

export default function Home() {
  const [activeSection, setActiveSection] = useState('distribution') // 'distribution' or 'offer'
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [proTipPosition, setProTipPosition] = useState(100)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatForm, setChatForm] = useState({
    name: '',
    message: ''
  })

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add country code (+91 for India) and remove any spaces or special characters
    const phoneNumber = "919321314553" // Added 91 prefix for India
    const whatsappMessage = encodeURIComponent(`Name: ${chatForm.name}\nMessage: ${chatForm.message}`)
    window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank')
    setIsChatOpen(false) // Close the popup after sending
    setChatForm({ name: '', message: '' }) // Reset form
  }

  return (
    <main className="min-h-screen bg-white relative">
      <Header />
      
      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-white rounded-lg shadow-xl w-[350px] overflow-hidden">
            {/* Chat Header */}
            <div className="bg-[#25D366] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  className="w-6 h-6 fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span className="text-white font-semibold">Chat with us</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Form */}
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-600">
                <p className="mb-2">👋 Hi there! We typically respond within 30 minutes.</p>
                <p>Fill out the form below to start a WhatsApp chat with our team.</p>
              </div>
              
              <form onSubmit={handleChatSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={chatForm.name}
                    onChange={(e) => setChatForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={chatForm.message}
                    onChange={(e) => setChatForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366]"
                    required
                  />
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  By clicking "Start Chat", WhatsApp will open in a new tab with your message.
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] text-white py-2 px-4 rounded-md hover:bg-[#128C7E] transition-colors duration-300"
                >
                  Start Chat
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp floating button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
        aria-label="Open chat"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          className="w-6 h-6 md:w-8 md:h-8 fill-white"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </button>

      {/* Pro Tip Notification Banner */}
      <div className="bg-green-50 border-y border-green-100 overflow-hidden relative h-10">
        <div 
          className="absolute py-2 px-4 whitespace-nowrap transition-all duration-1000 ease-linear"
          style={{ transform: `translateX(${proTipPosition}%)` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl flex-shrink-0">💡</span>
            <span className="text-green-700 text-sm md:text-base font-bold">
              If you are planning to take a loan then do check loan options against your Mutual Funds (LAMF) or Fixed Deposits (LAFD) as they are offered at much lower interest rates
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Your AI-Powered Personalized Financial Health Solution
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Get personalized recommendations for both investments and credit decisions. 
          We help you build wealth and manage debt intelligently.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/investment"
            className="inline-block rounded-md bg-blue-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-blue-700"
          >
            Get Funds Allocation Strategy <br />
            with Recommendations
          </Link>
          <Link
            href="/credit/score"
            className="inline-block rounded-md bg-green-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-green-700"
          >
            Understand Your Credit Score <br />
            and Apply for Loans
          </Link>
        </div>
      </div>

      {/* Steps Container - Update to show both services */}
      <div className="max-w-6xl mx-auto mt-12 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">Our Services</h2>
        
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {/* Investment Service */}
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">Investment Planning</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fill Investment Form</h4>
                  <p className="text-gray-600">Share your financial goals and risk appetite by filling our investment form</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Get Portfolio Strategy</h4>
                  <p className="text-gray-600">Receive AI-driven fund distribution recommendations to allocate your funds optimally</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Start Investing</h4>
                  <p className="text-gray-600">Get specific investment recommendations and begin your journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Service */}
          <div className="bg-green-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-600 mb-6">Credit Solutions</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Credit Score</h4>
                  <p className="text-gray-600">Understand Your Credit Score through our AI generated personalized video</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Get Recommendations</h4>
                  <p className="text-gray-600">Receive personalized recommendations for score improvement</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Apply for Loans</h4>
                  <p className="text-gray-600">Apply for secured and unsecured loans with higher chances of approval</p>
                </div>
              </div>
            </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Investment Analysis Box */}
                <div className="bg-white p-8 rounded-lg shadow-md col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Investment Analysis</h3>
                  <p className="text-gray-600 mb-4">Comprehensive investment planning including:</p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Portfolio optimization and rebalancing</li>
                    <li>• Mutual funds and stock recommendations</li>
                    <li>• Risk assessment and management</li>
                    <li>• Retirement planning strategies</li>
                  </ul>
                </div>

                {/* Credit Solutions Box */}
                <div className="bg-white p-8 rounded-lg shadow-md col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Credit Solutions</h3>
                  <p className="text-gray-600 mb-4">Smart credit management including:</p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Personal and business loan options</li>
                    <li>• Credit card recommendations</li>
                    <li>• Debt consolidation strategies</li>
                    <li>• Credit score improvement tips</li>
                  </ul>
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
    </main>
  )
}
