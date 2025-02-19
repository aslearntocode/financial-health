'use client'

import Header from "@/components/Header"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"

export default function CreditScorePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    dob: '',
    pan: '',
    mobile: '',
    acceptTerms: false
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.displayName) {
        setFormData(prev => ({...prev, name: user.displayName || ''}))
      }
    })

    return () => unsubscribe()
  }, [])

  const handlePageClick = () => {
    const user = auth.currentUser
    if (!user) {
      const currentPath = '/credit/score'
      router.push(`/login?redirect=${currentPath}`)
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = auth.currentUser
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // Get the Firebase ID token
      const token = await user.getIdToken()
      
      // Set the auth token for Supabase
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      })

      // Format the date to ISO string for Supabase
      const formattedDate = new Date(formData.dob).toISOString().split('T')[0]

      // Insert the credit report data into Supabase
      const { data, error } = await supabase
        .from('credit_reports')
        .insert({
          user_id: user.uid,
          name: formData.name,
          dob: formattedDate,
          pan: formData.pan.toUpperCase(),
          mobile: formData.mobile,
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error saving credit report:', error.message)
        alert('Failed to save credit report. Please try again.')
        return
      }

      // If successful, redirect to the report page
      if (data) {
        router.push('/credit/score/report')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div 
        className="flex-1 bg-gray-50"
        onClick={handlePageClick}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-bold text-blue-700 mb-8 font-serif text-center">
            We fetch your latest Credit Report from Licensed Credit Bureaus which are governed by RBI.
            <br/>
            We then give you a Personalized AI-powered Audio Summary of your credit report.
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Steps Section */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl p-8 shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">Enter Details</h3>
                      <p className="text-gray-600">Fill in your personal details including name, date of birth, PAN, and mobile number</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">Get OTP</h3>
                      <p className="text-gray-600">Receive an OTP on your registered mobile number</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">Verify Mobile Number</h3>
                      <p className="text-gray-600">Enter the OTP received on your mobile to verify your identity</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">Make Payment</h3>
                      <p className="text-gray-600">Pay ₹99 to access your detailed credit report</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      5
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">Get Your Report</h3>
                      <p className="text-gray-600">Watch our explainer video for easy understanding and receive an AI-powered summary of your credit report</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    <label className="block text-gray-700 mb-2">Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      placeholder="Enter 10-digit mobile number"
                    />
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
                      By clicking submit below, 
                      you consent FHAI Services Pvt Ltd to store and process the Personal Data submitted by you and the Bureau.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send OTP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 