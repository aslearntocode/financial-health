'use client'

import { useEffect, useState } from 'react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      content: "This platform helped me diversify my investment portfolio perfectly. The AI-driven recommendations aligned well with my risk tolerance and retirement goals.",
    },
    {
      name: "Priya Patel",
      role: "Business Owner",
      content: "As a busy entrepreneur, I needed guidance on balancing my investments. This tool provided clear, actionable advice that helped me achieve a 15% better return on my portfolio.",
    },
    {
      name: "Amit Kumar",
      role: "Medical Professional",
      content: "The personalized investment strategy considered my age, goals, and risk appetite. It's been 6 months, and my portfolio is much more balanced than before.",
    },
    {
      name: "Neha Gupta",
      role: "Financial Analyst",
      content: "The portfolio rebalancing suggestions are spot-on. I've recommended this tool to many of my clients for its accurate and personalized approach.",
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover how we've helped investors achieve their financial goals
          </p>
        </div>

        <div className="mt-12 relative overflow-hidden">
          <div 
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-xl shadow-md p-8 mx-auto max-w-2xl">
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-lg">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 