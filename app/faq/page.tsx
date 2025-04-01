'use client'

import Header from "@/components/Header"
import { useState } from "react"

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much life insurance coverage should I have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You should have at least 5 multiples of your annual income as Life Cover. If you haven't secured this level of coverage yet, it's recommended to purchase Life Insurance that can provide the required protection for your family."
        }
      },
      {
        "@type": "Question",
        "name": "What is an AI-Powered Credit Score Video?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The video summarizes the key elements of the credit report and presents the metrics in an understandable way. The video also gives recommendations to improve the score by using various strategies."
        }
      },
      // Add more FAQ items...
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about investments, credit and financial planning.
        </p>
        
        <div className="space-y-6">
          {/* Investment Related FAQs */}
          <section>
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </span>
              Investment Considerations
            </h2> */}
            <div className="space-y-4">
              {[
                {
                  question: "How much life insurance coverage should I have?",
                  answer: "You should have at least 5 multiples of your annual income as Life Cover. If you haven't secured this level of coverage yet, it's recommended to purchase Life Insurance that can provide the required protection for your family."
                },
                {
                  question: "How often should I review my investment allocation?",
                  answer: "You should review your allocation every 3 months to check if market conditions have changed or if your risk profile has evolved. Additionally, review your allocation immediately if there's a life-altering event such as a significant change in savings, marriage, having a child, etc., regardless of the regular review schedule."
                },
                {
                  question: "What should I do about my existing debt before investing?",
                  answer: "If you have any high-interest debt, it's recommended to pay it off first before starting your investment journey. High-interest debt can offset any potential returns from your investments and create financial strain."
                },
                {
                  question: "When should I reassess my investment strategy?",
                  answer: (
                    <div>
                      You should reassess your investment strategy in the following situations:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Every 3 months for regular review</li>
                        <li>When there's a significant change in market conditions</li>
                        <li>After major life events (marriage, children, job change)</li>
                        <li>When your income or savings significantly change</li>
                        <li>If your risk tolerance changes</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "What is an AI-Powered Credit Score Video?",
                  answer: "The video summarizes the key elements of the credit report and presents the metrics in an understandable way without any jargons. The video also gives recommendations to improve the score by using various strategies."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <span className={`ml-4 flex-shrink-0 transition-transform duration-200 ${openQuestion === index ? 'rotate-180' : ''}`}>
                      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 transition-all duration-200 ease-in-out ${openQuestion === index ? 'py-4 border-t border-gray-200' : 'max-h-0 overflow-hidden'}`}>
                    <div className="text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 