'use client'

import Header from "@/components/Header"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-700">About Us</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are a team of passionate financial experts and technology enthusiasts who believe that everyone deserves access to smart investment opportunities. Our mission is to help people make informed decisions about where to put their hard-earned savings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              In today&apos;s complex financial landscape, making investment decisions can be overwhelming. We&apos;re here to simplify that journey by providing clear, unbiased information and tools to help you grow your wealth sustainably.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
              <li>Expert analysis of investment opportunities</li>
              <li>Educational resources for financial literacy</li>
              <li>Personalized investment strategies</li>
              <li>Regular market insights and updates</li>
              <li>Secure platform for managing investments</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-blue-600 mb-2">Transparency</h3>
                <p className="text-gray-600">We believe in complete honesty about risks and opportunities in investments.</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-blue-600 mb-2">Education</h3>
                <p className="text-gray-600">We empower our users with knowledge to make informed financial decisions.</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-blue-600 mb-2">Security</h3>
                <p className="text-gray-600">Your financial security and data protection are our top priorities.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Join Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you&apos;re just starting your investment journey or looking to optimize your portfolio, we&apos;re here to help. Join our community of informed investors and take control of your financial future.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 