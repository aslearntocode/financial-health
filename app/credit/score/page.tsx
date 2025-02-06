'use client'

import Header from "@/components/Header"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export default function CreditScorePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    pan: '',
    incomeRange: '',
    acceptTerms: false
  })

  const handlePageClick = () => {
    const user = auth.currentUser
    if (!user) {
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${currentPath}`)
      return
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      onClick={handlePageClick}
    >
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 font-serif">
            Understand Your Credit Score
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Section */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
                <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input 
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date of Birth</label>
                    <input 
                      type="date"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Income Range</label>
                    <select
                      required
                      className="w-full p-2 border rounded-md bg-white"
                      value={formData.incomeRange}
                      onChange={(e) => setFormData({...formData, incomeRange: e.target.value})}
                    >
                      <option value="">Select Income Range</option>
                      <option value="0-5">₹0 - ₹5 Lakhs</option>
                      <option value="5-10">₹5 - ₹10 Lakhs</option>
                      <option value="10-25">₹10 - ₹25 Lakhs</option>
                      <option value="25-50">₹25 - ₹50 Lakhs</option>
                      <option value="50+">₹50 Lakhs+</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.pan}
                      onChange={(e) => setFormData({...formData, pan: e.target.value})}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="Please enter a valid PAN number"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input 
                        type="checkbox"
                        required
                        className="mr-2"
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                      />
                      <span className="text-sm text-gray-700">
                        I accept the terms and conditions
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* Credit Report Image Section */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl p-8 shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">Sample Credit Report</h2>
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