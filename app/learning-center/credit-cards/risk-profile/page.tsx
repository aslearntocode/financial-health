'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import Script from 'next/script'
import { JSX } from 'react'
import Head from 'next/head'

export default function CreditCardRiskProfile(): JSX.Element {
    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Understanding Credit Card Risk Profiles",
      "description": "Learn about credit card risk profiles, how they affect your applications, and what factors determine your risk level as a credit card applicant.",
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
      "datePublished": "2025-02-24",
      "dateModified": "2025-02-24",
      "image": "https://financialhealth.co.in/CreditCards.png",
      "articleSection": "Credit Cards",
      "url": "https://financialhealth.co.in/learning-center/credit-cards/risk-profile",
      "timeRequired": "8 min read",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://financialhealth.co.in/learning-center/credit-cards/risk-profile"
      },
      "keywords": "credit cards, risk profile, credit score, financial health, credit assessment, personal finance, credit limit, loan approval",
      "articleBody": "Learn about credit card risk profiles and how they affect your credit card applications and approvals. Understand the key factors that determine your risk level as a credit card applicant."
    }

    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "What is a credit card risk profile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A credit card risk profile is an assessment used by credit card issuers to evaluate potential cardholders. It helps determine the likelihood that an applicant will repay their credit card debt and influences approval decisions, credit limits, and interest rates."
        }
      }, {
        "@type": "Question",
        "name": "What factors affect my credit card risk profile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Key factors include your credit score, credit history, income, employment status, existing debt obligations, and payment history on other accounts."
        }
      }, {
        "@type": "Question",
        "name": "How can I improve my credit card risk profile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can improve your risk profile by making all payments on time, keeping credit utilization low (under 30%), maintaining stable employment and income, building a longer credit history, and limiting new credit applications."
        }
      }]
    }

    return (
      <>
        <Head>
          <title>Understanding Your Risk Profile | Financial Health</title>
          <meta name="description" content="Learn about credit card risk profiles, how they affect your applications, and what factors determine your risk level as a credit card applicant." />
          <meta name="keywords" content="credit cards, risk profile, credit score, financial health, credit assessment, personal finance, credit limit, loan approval" />
          <meta property="og:title" content="Understanding Credit Card Risk Profiles" />
          <meta property="og:description" content="Learn about credit card risk profiles and how they affect your credit card applications and approvals." />
          <meta property="og:image" content="https://financialhealth.co.in/CreditCards.png" />
          <meta property="og:url" content="https://financialhealth.co.in/learning-center/credit-cards/risk-profile" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href="https://financialhealth.co.in/learning-center/credit-cards/risk-profile" />
        </Head>

        <Script
          id="article-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <Header />
          
          <main>
            {/* Hero Section */}
            <section aria-label="Article Header" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
              <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4">Understanding Your Risk Profile</h1>
                <div className="flex items-center text-sm">
                  <time dateTime="2025-02-24" className="mr-4">20 min read</time>
                  <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">All</span>
                </div>
              </div>
            </section>
    
            {/* Main Content */}
            <article className="max-w-6xl mx-auto px-4 py-8">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                How Do Banks and NBFCs Evaluate Loan Applicants?
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                When someone applies for a loan, they might think that having a good credit score from a credit bureau is enough to get approved. 
                While that's partly true, Banks and Non-Banking Financial Companies (NBFCs) create their own internal scores to evaluate risk, and credit scores from bureaus are just one part of that. These lenders use complex systems (like machine learning models) to predict how risky a borrower might be. 
                Let's break down the main factors they consider in simpler terms.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Key Assessment Factors</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">1. Income Profile</h3>
                <ul className="list-disc pl-6 space-y-4 text-gray-700 mb-6">
                  <li><strong>Income:</strong> How much does the borrower earn? This could be from a job or a business. If the bank doesn't know the exact income, it estimates it conservatively.</li>
                  <li><strong>Debt:</strong> How much money does the borrower already owe to other lenders? If they have many loans, it may hurt their chances.</li>
                  <li><strong>Expenses:</strong> What are their regular monthly expenses like rent or bills? This helps estimate their remaining residual income.</li>
                  <li><strong>Residual Income:</strong> After paying all bills and debts, how much money is left? More leftover income improves their chances.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-indigo-700">2. Employment</h3>
                <ul className="list-disc pl-6 space-y-4 text-gray-700 mb-6">
                  <li><strong>Job Stability:</strong> Where does the borrower work? Someone working at a large, stable company (like Infosys) is seen as less risky than someone at a small startup.</li>
                  <li><strong>Government Employees:</strong> People working for the government are often considered more stable than private-sector employees, which might improve their chances of approval.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-indigo-700">3. Credit History</h3>
                <div className="pl-6 text-gray-700 mb-6">
                  <p className="mb-4"><strong>Existing Credit:</strong> Does the person have a credit history? If yes:</p>
                  <ul className="list-disc pl-6 space-y-4">
                    <li><strong>Past Behavior:</strong> Have they missed payments or defaulted on any loans? Late or missed payments are a big red flag.</li>
                    <li><strong>Credit Use:</strong> Have they taken a lot of unsecured loans (like personal loans or credit cards)? Or secured loans (like home or car loans)? Too many unsecured loans can make them appear financially unstable.</li>
                    <li><strong>Credit History Length:</strong> The longer they've been managing credit responsibly, the better.</li>
                  </ul>
                  <p className="mt-4"><strong>New-To-Credit:</strong> If they have no credit history at all, they're considered "New-To-Credit." Banks may be more cautious, but NBFCs are often more flexible, offering secured credit cards or other ways to build a credit history.</p>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-indigo-700">4. Loan Applications</h3>
                <ul className="list-disc pl-6 space-y-4 text-gray-700 mb-6">
                  <li><strong>Multiple Loan Applications:</strong> If a person applies for loans or credit cards with many different lenders in a short period (say, more than 3 in the last 6 months), it might signal that they're facing financial trouble, making them a riskier borrower.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-indigo-700">5. Loan Amount</h3>
                <ul className="list-disc pl-6 space-y-4 text-gray-700">
                  <li><strong>Loan Size:</strong> How much money is the person asking for? If someone with a low income is applying for a large loan, they'll be seen as a higher risk.</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">How Are Borrowers Categorized?</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <p className="text-gray-700 mb-6">
                  Lenders use a scoring system to categorize borrowers into risk bands. Based on where someone falls, they either get approved or denied. Here's a simplified version:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Band</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bad Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative Bad Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        [1, 1000, "6.0%", "33.5%"],
                        [2, 1000, "5.5%", "27.5%"],
                        [3, 1000, "5.0%", "22.0%"],
                        [4, 1000, "4.5%", "17.0%"],
                        [5, 1000, "3.5%", "12.5%"],
                        [6, 1000, "3.0%", "9.0%"],
                        [7, 1000, "2.5%", "6.0%"],
                        [8, 1000, "2.0%", "3.5%"],
                        [9, 1000, "1.0%", "1.5%"],
                        [10, 1000, "0.5%", "0.5%"]
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row[0]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[1]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[2]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-700 mt-6">
                  For example, if a lender has a rule that they can only take bad rate up to 4% then anyone in risk bands 8, 9, or 10 will be granted the loan. 
                  People in lower bands mostly will get declined, though sometimes lenders will reconsider applicants in the middle bands (6 or 7) if they provide more data or clarifications (like proof of income).
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  In short, while having a good credit score helps, a lot of other factors go into deciding whether or not you'll get a loan. 
                  Banks and NBFCs use a combination of your income, debts, job stability, credit history, and even the amount you're borrowing to figure out how risky you are. 
                  If you're looking to improve your chances, it's important to keep these factors in mind and manage your finances responsibly!
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Understanding Risk Score Ranges</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-700">Excellent (750-850)</h3>
                    <p className="text-gray-700">
                      Demonstrates exceptional creditworthiness. Likely to receive the best rates and terms on loans and credit cards.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-700">Good (700-749)</h3>
                    <p className="text-gray-700">
                      Above-average creditworthiness. Qualifies for favorable rates and terms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-700">Fair (650-699)</h3>
                    <p className="text-gray-700">
                      May face higher interest rates or stricter terms. Improvement opportunities exist.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-700">Poor (300-649)</h3>
                    <p className="text-gray-700">
                      Limited credit options. May require secured credit products or credit-builder loans.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">How to Improve Your Risk Score</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 mb-8">
                <ol className="list-decimal pl-6 space-y-4 text-gray-700">
                  <li><strong>Pay Bills on Time:</strong> Set up automatic payments or reminders to avoid late payments</li>
                  <li><strong>Reduce Credit Utilization:</strong> Keep credit card balances low relative to credit limits</li>
                  <li><strong>Maintain Old Accounts:</strong> Keep older credit accounts open to lengthen credit history</li>
                  <li><strong>Limit New Applications:</strong> Apply for new credit only when necessary</li>
                  <li><strong>Monitor Your Credit:</strong> Regularly check your credit reports for errors</li>
                  <li><strong>Diversify Credit Mix:</strong> Maintain a healthy mix of credit types when possible</li>
                </ol>
              </div>

              {/* <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Impact on Financial Opportunities</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your risk score affects various financial aspects:
                </p>
                <ul className="list-disc pl-6 space-y-4 text-gray-700">
                  <li>Loan approval and interest rates</li>
                  <li>Credit card eligibility and limits</li>
                  <li>Rental applications</li>
                  <li>Insurance premiums</li>
                  <li>Employment opportunities in financial sectors</li>
                </ul>
              </div> */}

              <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Conclusion</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  Understanding and managing your risk score is essential for maintaining good financial health. 
                  By focusing on the key factors that influence your score and following best practices for credit management, 
                  you can improve your score over time and access better financial opportunities.
                </p>
              </div>

              {/* FAQ Section */}
              <section aria-label="Frequently Asked Questions" className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-indigo-800">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-2">What is a risk score?</h3>
                    <p className="text-gray-700">A risk score is a numerical representation of your creditworthiness, calculated using various factors from your credit report. It helps lenders assess the likelihood that you'll repay borrowed money.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-2">What factors affect my risk score the most?</h3>
                    <p className="text-gray-700">Payment history (35%) and credit utilization (30%) have the biggest impact on your risk score, followed by length of credit history (15%), credit mix (10%), and new credit (10%).</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-2">How can I improve my risk score?</h3>
                    <p className="text-gray-700">You can improve your score by paying bills on time, keeping credit utilization low, maintaining older accounts, limiting new credit applications, and regularly monitoring your credit report for errors.</p>
                  </div>
                </div>
              </section>
            </article>
          </main>
        </div>
      </>
    )
}
