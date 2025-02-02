'use client'

import Header from '@/components/Header'

function SIPGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-blue-600 text-xl md:text-2xl font-extrabold mb-4">
              Personal Finance
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 leading-tight">
              How to Invest in <span className="text-blue-600">SIP in India?</span>
            </h1>
            <div className="text-gray-600 text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              15 min read
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 1 - Keep All The Necessary Documents Ready</h2>
            <p className="text-lg leading-relaxed mb-6">
              Before you embark on your SIP investment journey, it's crucial to have all the necessary documents in order. 
              This preparation will streamline the process and save you time when you're ready to start investing. Here's a 
              comprehensive list of documents you'll need:
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">1. Proof of Identity (Any one of the following):</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>PAN Card</li>
                  <li>Aadhaar Card</li>
                  <li>Passport</li>
                  <li>Voter ID Card</li>
                  <li>Driving License</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">2. Proof of Address (Any one of the following):</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Aadhaar Card</li>
                  <li>Passport</li>
                  <li>Utility Bills (not older than 3 months)</li>
                  <li>Bank Statement (not older than 3 months)</li>
                  <li>Rental Agreement</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">3. Proof of Income:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Latest Salary Slip</li>
                  <li>Form 16</li>
                  <li>Income Tax Return (ITR) for the last two years</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">4. Bank Account Details:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancelled Cheque</li>
                  <li>Bank Statement (not older than 3 months)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">5. Passport-sized Photographs</h3>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              Having these documents ready will expedite the KYC process, which is the next crucial step in starting your SIP investment.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 2 - Get Your KYC Done</h2>
            <p className="text-lg leading-relaxed mb-6">
              KYC, or Know Your Customer, is a mandatory process for all financial investments in India, including SIPs. 
              It helps prevent fraud and ensures that your investments are compliant with regulatory requirements. Here's how to complete your KYC:
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">1. Online KYC:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Visit the website of any SEBI-registered mutual fund or KRA (KYC Registration Agency)</li>
                  <li>Fill out the online KYC form</li>
                  <li>Upload scanned copies of your documents</li>
                  <li>Complete video verification (if required)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">2. Offline KYC:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Visit the nearest branch of a mutual fund house or a CAMS/Karvy service center</li>
                  <li>Fill out the KYC form</li>
                  <li>Submit copies of required documents</li>
                  <li>Complete in-person verification</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 3 - Register For A SIP</h2>
            <p className="text-lg leading-relaxed mb-6">
              Now that your KYC is complete, you're ready to register for a SIP. Here are the options available:
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Online Registration:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Visit the website of your chosen mutual fund house or use a mutual fund investment platform</li>
                  <li>Create an account if you haven't already</li>
                  <li>Navigate to the SIP registration section</li>
                  <li>Fill in the required details</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Through a Mutual Fund Distributor or Financial Advisor:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact a registered mutual fund distributor or financial advisor</li>
                  <li>They will guide you through the registration process and help you choose suitable funds</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Visiting a Mutual Fund House Office:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Locate the nearest office of your chosen mutual fund house</li>
                  <li>Visit in person and ask for assistance with SIP registration</li>
                </ul>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              Remember, registering for a SIP doesn't mean you've started investing yet. It's merely setting up the framework for your future investments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 4 - Choose The Right Plan For Yourself</h2>
            <p className="text-lg leading-relaxed mb-6">
              Selecting the right SIP plan is crucial for achieving your financial goals. Here are some factors to consider:
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Investment Objective:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Growth: For long-term wealth creation</li>
                  <li>Income: For regular returns</li>
                  <li>Tax Saving: For tax benefits under Section 80C</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Risk Tolerance:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Conservative: Debt funds or balanced funds</li>
                  <li>Moderate: Large-cap or multi-cap funds</li>
                  <li>Aggressive: Mid-cap or small-cap funds</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Investment Horizon:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Short-term (1-3 years): Liquid or ultra-short duration funds</li>
                  <li>Medium-term (3-7 years): Balanced or multi-cap funds</li>
                  <li>Long-term (7+ years): Equity-oriented funds</li>
                </ul>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-6">
              Here's a comparison of different types of mutual funds for SIP investment:
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Returns</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suitable For</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Equity Funds</td>
                    <td className="px-6 py-4 whitespace-nowrap">High</td>
                    <td className="px-6 py-4 whitespace-nowrap">High</td>
                    <td className="px-6 py-4 whitespace-nowrap">Long-term investors</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Debt Funds</td>
                    <td className="px-6 py-4 whitespace-nowrap">Low to Moderate</td>
                    <td className="px-6 py-4 whitespace-nowrap">Moderate</td>
                    <td className="px-6 py-4 whitespace-nowrap">Conservative investors</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Balanced Funds</td>
                    <td className="px-6 py-4 whitespace-nowrap">Moderate</td>
                    <td className="px-6 py-4 whitespace-nowrap">Moderate to High</td>
                    <td className="px-6 py-4 whitespace-nowrap">Balanced approach</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Index Funds</td>
                    <td className="px-6 py-4 whitespace-nowrap">Moderate</td>
                    <td className="px-6 py-4 whitespace-nowrap">Market-linked</td>
                    <td className="px-6 py-4 whitespace-nowrap">Passive investors</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Sector Funds</td>
                    <td className="px-6 py-4 whitespace-nowrap">High</td>
                    <td className="px-6 py-4 whitespace-nowrap">High</td>
                    <td className="px-6 py-4 whitespace-nowrap">Sector-specific growth</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 5 - Choose The Amount Which You Want To Invest</h2>
            <p className="text-lg leading-relaxed mb-6">
              Determining the right SIP amount is a balance between your financial goals and current financial situation. Here are some guidelines:
            </p>

            <div className="space-y-6 mb-8">
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="font-semibold">Start Small:</span> Begin with an amount you're comfortable with, even if it's as low as ₹500 per month.
                </li>
                <li>
                  <span className="font-semibold">Use the 50-30-20 Rule:</span>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>50% of income for needs</li>
                    <li>30% for wants</li>
                    <li>20% for savings and investments (including SIP)</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Consider Your Goals:</span> Use a SIP calculator to determine how much you need to invest to reach your financial goals.
                </li>
                <li>
                  <span className="font-semibold">Increase Gradually:</span> Start with a manageable amount and increase it as your income grows.
                </li>
                <li>
                  <span className="font-semibold">Be Consistent:</span> Regular, smaller investments are often more beneficial than irregular, larger ones.
                </li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              Remember, the power of SIP lies in consistency and the magic of compounding. Even small amounts, invested regularly over a long period, can grow significantly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 6 - Choose the Date of Your SIP</h2>
            <p className="text-lg leading-relaxed mb-6">
              Selecting the right date for your SIP can have a subtle impact on your investment performance. Consider these factors:
            </p>

            <div className="space-y-6 mb-8">
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="font-semibold">Salary Credit Date:</span> Choose a date shortly after your salary is credited to ensure funds availability.
                </li>
                <li>
                  <span className="font-semibold">Avoid Month-End:</span> The last few days of the month might be tight on cash due to bill payments and other expenses.
                </li>
                <li>
                  <span className="font-semibold">Market Timing:</span> While it's impossible to time the market perfectly, some investors prefer early-month investments to potentially capture more days of market participation.
                </li>
                <li>
                  <span className="font-semibold">Multiple Dates:</span> If you're investing a larger amount, consider splitting it into two or more SIPs on different dates of the month.
                </li>
                <li>
                  <span className="font-semibold">Consistency:</span> Whatever date you choose, stick to it for the best results of rupee cost averaging.
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Step 7 - Submit Your Form</h2>
            <p className="text-lg leading-relaxed mb-6">
              The final step in starting your SIP investment is submitting your application form. Here's what you need to do:
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">1. Online Submission:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fill out the online application form</li>
                  <li>Upload any required documents</li>
                  <li>Verify all details before final submission</li>
                  <li>Complete the payment process for your first installment</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">2. Offline Submission:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fill out the physical SIP application form</li>
                  <li>Attach all necessary documents</li>
                  <li>Submit the form at the mutual fund house office or through your financial advisor</li>
                  <li>Provide a cancelled cheque or set up an ECS mandate for future installments</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">3. Post-Submission:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You'll receive a confirmation of your SIP registration</li>
                  <li>Keep track of your folio number for future reference</li>
                  <li>Set up reminders for your SIP installment dates</li>
                </ul>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              With these steps completed, you've successfully started your SIP investment journey. 
              Remember, SIP is a long-term investment strategy. Stay patient, stay invested, and let the power 
              of compounding work its magic over time.
            </p>


            

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-lg leading-relaxed mb-4">
                As we've explored the world of Systematic Investment Plans (SIPs), it's clear that this investment strategy offers a powerful 
                and accessible way for individuals to build wealth over time. SIPs provide a structured approach to investing, allowing you 
                to harness the power of compounding and navigate market volatility with greater ease.
              </p>
              <p className="text-lg leading-relaxed">
                Start your SIP journey today by researching reputable mutual fund companies, opening a demat account, and setting up 
                automatic contributions. Consistency is key, so stick to your investment plan even during market fluctuations.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-12">
              <h3 className="font-bold text-gray-900 mb-3">Disclaimer</h3>
              <p className="text-base text-gray-600">
                The information provided here is for educational purposes only and should not be considered as financial advice. 
                Please consult with a qualified financial advisor before making any investment decisions. Mutual fund investments 
                are subject to market risks. Please read the scheme information document carefully before investing.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

export default SIPGuidePage
