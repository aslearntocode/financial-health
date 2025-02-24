'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import Script from 'next/script'

export default function EquityIntro() {
    // Define structured data for the article
    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Understand Credit Card Interest Calculation",
      "description": "Understanding how credit card interest is calculated is crucial for managing your finances effectively. Learn about APR, daily periodic rates, and how to avoid high interest charges.",
      "author": {
        "@type": "Organization",
        "name": "Financial Health"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Financial Health",
        "logo": {
          "@type": "ImageObject",
          "url": "https://financialhealth.co.in/Logo_Final3.jpeg"
        }
      },
      "datePublished": "2025-02-24", // Add actual publication date
      "dateModified": "2025-02-24", // Add actual last modified date
      "image": "https://financialhealth.co.in/InterestCalc.png",
      "articleSection": "Credit Cards",
      "url": "https://financialhealth.co.in/learning-center/credit-cards/interest-calculation",
      "timeRequired": "15 min read",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://financialhealth.co.in/learning-center/credit-cards/interest-calculation"
      }
    }

    // Define structured data for the credit card comparison table
    const creditCardComparisonData = {
      "@context": "https://schema.org",
      "@type": "Table",
      "about": "Credit Card Comparison",
      "mainEntity": [
        {
          "@type": "FinancialProduct",
          "name": "Regalia Credit Card",
          "brand": "HDFC Bank",
          "annualPercentageRate": {
            "@type": "QuantitativeValue",
            "minValue": 36,
            "maxValue": 42,
            "unitText": "PERCENT_PER_ANNUM"
          },
          "feesAndCommissionsSpecification": "₹2,500 annual fee",
          "description": "4X rewards on travel & dining, Airport lounge access, Milestone benefits up to ₹12,000"
        },
        {
          "@type": "FinancialProduct",
          "name": "Ace Credit Card",
          "brand": "Axis Bank",
          "annualPercentageRate": {
            "@type": "QuantitativeValue",
            "minValue": 37,
            "maxValue": 42,
            "unitText": "PERCENT_PER_ANNUM"
          },
          "feesAndCommissionsSpecification": "₹499 annual fee",
          "description": "5% cashback on bill payments, 2% on other spends, Welcome benefits worth ₹5,000"
        },
        // Add other cards similarly...
      ]
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Add structured data scripts */}
        <Script
          id="article-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
        <Script
          id="comparison-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creditCardComparisonData) }}
        />

        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Understand Credit Card Interest Calculation</h1>
            <div className="flex items-center text-sm">
              <span className="mr-4">15 min read</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">All</span>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Understanding how credit card interest is calculated is crucial for managing your finances effectively. Credit card interest can significantly impact your overall debt, and knowing how it works can help you make better financial decisions.
          </p>
  
          <div className="my-12">
            <img 
              src="/InterestCalc.png" 
              alt="Credit Card Interest Calculation Diagram" 
              className="w-full max-w-6xl mx-auto rounded-lg shadow-lg"
            />
          </div>
  
          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Understanding APR (Annual Percentage Rate)</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed">
              APR is the yearly interest rate you'll pay on your credit card balance. However, credit card companies typically divide this rate by 365 to calculate your daily periodic rate, which is then applied to your daily balance.
            </p>
          </div>
  
          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Understanding Credit Card Interest: The Hidden Costs of Revolving Credit

</h2>
  
          <div className="bg-white-50 p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed">
            Many credit card users assume they will be charged interest only on ₹500 for 19 days—the period before the next statement is generated. However, the larger interest component actually stems from the ₹1,000 that remained unpaid for the first 41 days. This means there is no interest-free period, a crucial detail that many customers overlook. Banks classify such users as "Revolvers", applying interest on transactions from the moment they are made.
            <br></br>
            To avoid high credit card interest rates and maximize your interest-free period, always aim to pay your total outstanding balance on time. Understanding how banks calculate interest can help you manage your finances smarter and save more.            </p>
          </div>
  
          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Comparison for a few Credit Cards</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-lg border border-blue-100 mb-8">
            {/* Mobile view - card style */}
            <div className="block md:hidden space-y-6">
              {[
                {
                  name: 'Regalia Credit Card',
                  bank: 'HDFC Bank',
                  apr: '36-42% p.a.',
                  fee: '₹2,500',
                  rewards: ['4X rewards on travel & dining', 'Airport lounge access', 'Milestone benefits up to ₹12,000']
                },
                {
                  name: 'Ace Credit Card',
                  bank: 'Axis Bank',
                  apr: '37-42% p.a.',
                  fee: '₹499',
                  rewards: ['5% cashback on bill payments', '2% on other spends', 'Welcome benefits worth ₹5,000']
                },
                {
                  name: 'Amazon Pay Card',
                  bank: 'ICICI Bank',
                  apr: '36-42% p.a.',
                  fee: '₹500',
                  rewards: ['5% rewards on Amazon', '2% on digital payments', '1% on other spends']
                },
                {
                  name: '811 Dream Different',
                  bank: 'Kotak Bank',
                  apr: '36-40% p.a.',
                  fee: '₹0',
                  rewards: ['Zero joining and annual fee', '1% cashback on all spends', 'Movie ticket discounts']
                }
              ].map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg text-blue-800">{card.name}</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-medium">Bank:</span> {card.bank}</p>
                    <p><span className="font-medium">APR:</span> {card.apr}</p>
                    <p><span className="font-medium">Annual Fee:</span> {card.fee}</p>
                    <div className="mt-3">
                      <p className="font-medium mb-1">Key Rewards:</p>
                      <ul className="list-disc pl-4">
                        {card.rewards.map((reward, i) => (
                          <li key={i}>{reward}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - table style */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-left">Card Name</th>
                    <th className="px-4 py-3 text-left">Bank</th>
                    <th className="px-4 py-3 text-left">APR</th>
                    <th className="px-4 py-3 text-left">Annual Fee</th>
                    <th className="px-4 py-3 text-left">Key Rewards</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Regalia Credit Card</td>
                    <td className="px-4 py-3">HDFC Bank</td>
                    <td className="px-4 py-3">36-42% p.a.</td>
                    <td className="px-4 py-3">₹2,500</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>4X rewards on travel & dining</li>
                        <li>Airport lounge access</li>
                        <li>Milestone benefits up to ₹12,000</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">Ace Credit Card</td>
                    <td className="px-4 py-3">Axis Bank</td>
                    <td className="px-4 py-3">37-42% p.a.</td>
                    <td className="px-4 py-3">₹499</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>5% cashback on bill payments</li>
                        <li>2% on other spends</li>
                        <li>Welcome benefits worth ₹5,000</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Amazon Pay Card</td>
                    <td className="px-4 py-3">ICICI Bank</td>
                    <td className="px-4 py-3">36-42% p.a.</td>
                    <td className="px-4 py-3">₹500</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>5% rewards on Amazon</li>
                        <li>2% on digital payments</li>
                        <li>1% on other spends</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">811 Dream Different</td>
                    <td className="px-4 py-3">Kotak Bank</td>
                    <td className="px-4 py-3">36-40% p.a.</td>
                    <td className="px-4 py-3">₹0</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>Zero joining and annual fee</li>
                        <li>1% cashback on all spends</li>
                        <li>Movie ticket discounts</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Key Comparison Points:</h4>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Lowest APR:</span> Kotak 811 Dream Different (36-40% p.a.)</span>
                  <a 
                    href="https://www.kotak.com/en/personal-banking/cards/credit-cards/811-dream-different-credit-card.html" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Best Rewards Rate:</span> Axis Ace (5% on bills)</span>
                  <a 
                    href="https://www.axisbank.com/retail/cards/credit-card/ace-credit-card" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Premium Benefits:</span> HDFC Regalia</span>
                  <a 
                    href="https://www.hdfcbank.com/personal/pay/cards/credit-cards" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Best for Online Shopping:</span> Amazon Pay Card</span>
                  <a 
                    href="https://www.icicibank.com/personal-banking/cards/credit-card?ITM=nli_cms_cards_credit_cards_header_nav" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  } 