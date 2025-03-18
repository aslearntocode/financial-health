'use client'

import Header from "@/components/Header"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"

const CreditScoreMeter = ({ score }: { score: number }) => {
  // Calculate needle rotation (0 to 180 degrees)
  const rotation = Math.min(Math.max((score / 900) * 180, 0), 180);

  return (
    <div className="relative w-full max-w-[400px] mx-auto mt-8">
      {/* Semi-circular meter background */}
      <div className="relative h-[200px] overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bottom-0 rounded-[50%] bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"></div>
        
        {/* Score ranges */}
        <div className="absolute bottom-0 w-full h-[200px]">
          <div className="relative w-full h-full">
            <span className="absolute left-[5%] bottom-8 text-sm font-semibold">Very Low</span>
            <span className="absolute left-[25%] bottom-8 text-sm font-semibold">Low</span>
            <span className="absolute left-[45%] bottom-8 text-sm font-semibold">Average</span>
            <span className="absolute left-[65%] bottom-8 text-sm font-semibold">Above Avg</span>
            <span className="absolute right-[5%] bottom-8 text-sm font-semibold">Excellent</span>
          </div>
        </div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-[160px] bg-black origin-bottom transform -translate-x-1/2"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute -top-2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2"></div>
        </div>

        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-4 border-black rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Score display */}
      <div className="text-center mt-8">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xl text-gray-600">/900</span>
      </div>
    </div>
  );
};

export default function CreditScorePage() {
  const router = useRouter()
  // Add state for structured data
  const [structuredData, setStructuredData] = useState<{
    score: number;
    openAccounts: number;
    closedAccounts: number;
    writtenOffAccounts: any[];
    overdueAccounts: any[];
  } | null>(null);

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
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
    
    const user = auth.currentUser
    if (!user) {
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }

    try {
      submitButton.disabled = true
      submitButton.textContent = 'Processing...'

      // Format the date for API
      const formattedDate = new Date(formData.dob).toISOString().split('T')[0]

      // Create query parameters
      const params = new URLSearchParams({
        pan: formData.pan.toUpperCase(),
        name: formData.name,
        dob: formattedDate,
        mobile: formData.mobile
      })

      // Use the API route instead of direct server call
      const analysisResponse = await fetch(`/api/credit-report?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!analysisResponse.ok) {
        throw new Error(`API request failed: ${analysisResponse.statusText}`)
      }

      const analysisData = await analysisResponse.json()

      // Save to Supabase with better error handling
      const saveReportToSupabase = async (reportData: any) => {
        const audioUrl = "https://rruaznytrgasfzkvahyr.supabase.co/storage/v1/object/public/credit_audio_files//synthesis%20(1).wav";
        
        console.log('Saving report with audio URL:', {
          user_id: auth.currentUser?.uid,
          audio_url: audioUrl,
          report_analysis: reportData,
          mobile: formData.mobile,
          name: formData.name,
          dob: formData.dob,
          pan: formData.pan,
          created_at: new Date().toISOString()
        });
        
        try {
          const { data, error } = await supabase
            .from('credit_reports')
            .insert({
              user_id: auth.currentUser?.uid,
              report_analysis: reportData,
              audio_url: audioUrl,
              mobile: formData.mobile,
              name: formData.name,
              dob: formData.dob,
              pan: formData.pan.toUpperCase(),  // Store PAN in uppercase
              created_at: new Date().toISOString()
            })

          if (error) {
            console.error('Supabase error details:', error);
            throw error;
          }
          return data;
        } catch (error: any) {
          console.error('Error saving report:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
      };

      const reportData = await saveReportToSupabase(analysisData);
      console.log('Successfully saved report:', reportData);

      // Store the analysis data in localStorage for immediate access
      localStorage.setItem('latestCreditReport', JSON.stringify(analysisData))

      // Redirect to report page
      router.push('/credit/score/report')

    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        details: err.details,
        code: err.code
      });
      alert('An error occurred while processing your request. Please try again.')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Send OTP'
    }
  }

  const generateReport = async () => {
    // TODO: Implement report generation
    return {};
  };

  const generateAudio = async (reportData: any) => {
    // TODO: Implement audio generation
    return '';
  };

  const handleOTPVerification = async () => {
    try {
      // 1. Verify OTP
      // 2. Generate report
      // 3. Wait for audio generation
      // 4. Save everything to Supabase
      // 5. Only then redirect to report page
      
      const reportData = await generateReport();
      const audioUrl = await generateAudio(reportData);
      
      await supabase.from('credit_reports').insert({
        user_id: auth.currentUser?.uid,
        report_analysis: reportData,
        audio_url: audioUrl
      });

      router.push('/credit/score/report');
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('An error occurred during OTP verification. Please try again.');
    }
  };

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
            <br/>
            </h3>
            <br/>
            <span style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>We are currently working with Bureaus to get this live. For Now, you can see our sample report.</span>
         
          
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
                        you allow FHAI Services Pvt Ltd as your authorized represnetative to fetch and provide you access to your credit information from RBI-approved bureau(s)
                        for the next six months and offer credit related products/services. If applicable, previously provided consent shall continue to apply until expiry or revocation.{' '}
                        <a 
                          href="/terms-and-conditions" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          T&C apply
                        </a>
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