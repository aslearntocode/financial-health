'use client'

import Header from "@/components/Header"
import { InvestmentForm } from "@/components/InvestmentForm"
import { useState } from "react"
import { PieChart } from 'react-minimal-pie-chart'

// Define proper types instead of any
interface ChartData {
  title: string;
  value: number;
  color: string;
}

interface FormData {
  // Add your form fields here
  [key: string]: string | number;
}

// Remove unused InvestmentProps interface since data is not used
export default function InvestmentPage() {
  const [showResults, setShowResults] = useState(false);

  // Update the type from any to FormData
  const handleFormSubmit = (formData: FormData) => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-r from-blue-600 to-blue-700" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side form */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <InvestmentForm onSubmit={handleFormSubmit} />
            </div>

            {/* Right side donut chart */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">
                {showResults ? "Your Investment Allocation" : "Investment Allocation"}
              </h2>
              <p className="text-gray-600 mb-6">January - June 2024</p>
              
              {/* Donut Chart Section */}
              <div className="relative aspect-square w-full max-w-md mx-auto bg-white">
                <div className="relative">
                  <PieChart
                    data={!showResults ? [
                      { title: 'Segment 1', value: 1, color: '#e5e7eb' },
                      { title: 'Segment 2', value: 1, color: '#d1d5db' },
                      { title: 'Segment 3', value: 1, color: '#9ca3af' },
                      { title: 'Segment 4', value: 1, color: '#6b7280' },
                      { title: 'Segment 5', value: 1, color: '#4b5563' },
                    ] : [
                      { title: 'Segment 1', value: 25, color: '#4F46E5' }, // Royal Blue
                      { title: 'Segment 2', value: 20, color: '#34D399' }, // Green
                      { title: 'Segment 3', value: 20, color: '#A855F7' }, // Purple
                      { title: 'Segment 4', value: 15, color: '#F59E0B' }, // Orange/Gold
                      { title: 'Segment 5', value: 20, color: '#EC4899' }  // Pink/Red
                    ]}
                    lineWidth={40}
                    labelStyle={{
                      fontSize: '0px',
                    }}
                    startAngle={-90}
                    background="#ffffff"
                    animate
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">
                      {showResults ? "1,125" : "0"}
                    </span>
                    <span className="text-gray-500">Visitors</span>
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              {showResults && (
                <div className="text-center mt-6">
                  <p className="text-lg font-semibold">
                    Trending up by 5.2% this month <span className="inline-block transform rotate-45">↗</span>
                  </p>
                  <p className="text-gray-500 mt-2">
                    Showing total visitors for the last 6 months
                  </p>
                </div>
              )}

              {/* Legend Section */}
              <div className="mt-6 space-y-3">
                {!showResults ? (
                  <div className="text-center text-gray-400">
                    Submit form to see your personalized allocation
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#4F46E5] mr-2"></div>
                        <span>Direct Traffic</span>
                      </div>
                      <span>25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#34D399] mr-2"></div>
                        <span>Social Media</span>
                      </div>
                      <span>20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#A855F7] mr-2"></div>
                        <span>Email</span>
                      </div>
                      <span>20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#F59E0B] mr-2"></div>
                        <span>Organic Search</span>
                      </div>
                      <span>15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#EC4899] mr-2"></div>
                        <span>Referral</span>
                      </div>
                      <span>20%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 