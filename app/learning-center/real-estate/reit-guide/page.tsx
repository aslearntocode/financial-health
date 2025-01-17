'use client'

import Header from '@/components/Header'

export default function REITGuide() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#3366FF] mb-2">Real Estate</h1>
          
          <h2 className="text-3xl font-bold mb-4">
            Understanding REITs: <span className="text-[#3366FF]">A Comprehensive Guide</span>
          </h2>

          <div className="flex items-center text-gray-600 mb-8">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              8 min read
            </span>
          </div>
        </div>

        <article className="text-lg leading-relaxed">
          <p className="mb-8">
            A Real Estate Investment Trust (REIT) is a company that owns, operates, or finances income-generating real estate across a range of property sectors. Modeled after mutual funds, REITs pool the capital of numerous investors to buy and manage properties, offering a way for retail investors to earn dividends from real estate investments without directly owning the properties.
          </p>

          <h3 className="text-2xl font-bold mb-4">What is a REIT?</h3>
          <p className="mb-8">
            In India, REITs are regulated by the Securities and Exchange Board of India (SEBI). They are mandated to distribute at least 90% of their net distributable income to unitholders, making them attractive for investors looking for regular income. Popular REITs in India primarily focus on commercial real estate like office spaces, retail malls, and warehouses.
          </p>

          <h3 className="text-2xl font-bold mb-4">Advantages of Investing in REITs</h3>
          <ul className="list-disc pl-6 mb-8 space-y-3">
            <li>
              <strong>Regular Income:</strong> REITs are required to pay out most of their income as dividends, providing a steady income stream for investors.
            </li>
            <li>
              <strong>Diversification:</strong> Investing in REITs allows retail investors to diversify their portfolio into the real estate sector without the high costs associated with purchasing properties.
            </li>
            <li>
              <strong>Liquidity:</strong> Unlike direct property investments, REITs are traded on stock exchanges, offering better liquidity.
            </li>
            <li>
              <strong>Professional Management:</strong> REITs are managed by experienced professionals who handle property management and leasing, reducing the burden on individual investors.
            </li>
            <li>
              <strong>Accessibility:</strong> REITs offer a way for small investors to participate in the real estate market with lower capital requirements.
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Steps to Invest in REITs</h3>
          <ol className="list-decimal pl-6 mb-8 space-y-3">
            <li>
              <strong>Open a Demat and Trading Account:</strong> Necessary for trading REIT units on the stock market.
            </li>
            <li>
              <strong>Research Available REITs:</strong> Understand the properties they hold, their income distributions, and management.
            </li>
            <li>
              <strong>Place an Order:</strong> Use your trading platform to buy REIT units.
            </li>
            <li>
              <strong>Monitor Performance:</strong> Keep an eye on market trends, interest rates, and the REIT's financial health.
            </li>
          </ol>

          <p className="text-gray-700 mt-8">
            REIT investments in India offer a balanced mix of income and growth potential, making them an attractive option for a wide range of investors.
          </p>
        </article>
      </main>
    </div>
  )
} 