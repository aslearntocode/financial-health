'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'

export default function CreditCardRewards() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Understanding Credit Card Rewards</h1>
            <div className="flex items-center text-sm">
              <span className="mr-4">12 min read</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">All</span>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Credit card rewards are one of the most attractive features of using a credit card. Understanding how these rewards work and choosing the right reward program can help you maximize the benefits from your everyday spending.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">1. Types of Credit Card Rewards</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Reward Points</h3>
              <p className="text-gray-700 leading-relaxed">
                Points earned on purchases that can be redeemed for various rewards including cashback, merchandise, travel bookings, or gift vouchers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Cashback</h3>
              <p className="text-gray-700 leading-relaxed">
                Direct cash rewards credited back to your credit card account, usually calculated as a percentage of your spending.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Air Miles</h3>
              <p className="text-gray-700 leading-relaxed">
                Travel rewards that can be redeemed for flights, hotel stays, and other travel-related expenses.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">2. How Rewards Work</h2>
          <div className="bg-white-50 p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            {/* <h3 className="text-xl font-semibold mb-4 text-yellow-800">Important Points to Remember:</h3> */}
            <p className="text-gray-700 leading-relaxed">
              Most credit cards in India offer between 0.25% to 5% value back on purchases. However, the actual reward rate depends on various factors such as spending category, card type, and ongoing promotions. Premium cards typically offer higher reward rates but come with annual fees. Some rewards may expire if not redeemed within a specific timeframe, usually 2-3 years from the date of earning.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">3. Credit Card Rewards Comparison</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-lg border border-blue-100 mb-8">
            {/* Mobile view - card style */}
            <div className="block md:hidden space-y-6">
              {[
                {
                  name: 'HDFC Diners Club Black',
                  bank: 'HDFC Bank',
                  rewardRate: '10X rewards (3.3% value)',
                  fee: '₹10,000',
                  benefits: ['10X rewards on select merchants', 'Airport lounge access worldwide', 'Golf privileges']
                },
                {
                  name: 'SimplySAVE Credit Card',
                  bank: 'HDFC Bank',
                  rewardRate: '5% cashback',
                  fee: '₹499',
                  benefits: ['5% cashback on groceries & movies', '1% cashback on other spends', 'Fuel surcharge waiver']
                },
                {
                  name: 'Flipkart Axis Bank',
                  bank: 'Axis Bank',
                  rewardRate: '5% cashback',
                  fee: '₹500',
                  benefits: ['5% unlimited cashback on Flipkart', '4% on preferred partners', '1.5% on other spends']
                },
                {
                  name: 'ICICI Amazon Pay',
                  bank: 'ICICI Bank',
                  rewardRate: '5% rewards',
                  fee: '₹500',
                  benefits: ['5% rewards on Amazon', '2% on digital payments', 'Welcome benefits worth ₹2,500']
                }
              ].map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg text-blue-800">{card.name}</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-medium">Bank:</span> {card.bank}</p>
                    <p><span className="font-medium">Reward Rate:</span> {card.rewardRate}</p>
                    <p><span className="font-medium">Annual Fee:</span> {card.fee}</p>
                    <div className="mt-3">
                      <p className="font-medium mb-1">Key Benefits:</p>
                      <ul className="list-disc pl-4">
                        {card.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
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
                    <th className="px-4 py-3 text-left">Reward Rate</th>
                    <th className="px-4 py-3 text-left">Annual Fee</th>
                    <th className="px-4 py-3 text-left">Key Benefits</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">HDFC Diners Club Black</td>
                    <td className="px-4 py-3">HDFC Bank</td>
                    <td className="px-4 py-3">10X rewards (3.3% value)</td>
                    <td className="px-4 py-3">₹10,000</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>10X rewards on select merchants</li>
                        <li>Airport lounge access worldwide</li>
                        <li>Golf privileges</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">SimplySAVE Credit Card</td>
                    <td className="px-4 py-3">HDFC Bank</td>
                    <td className="px-4 py-3">5% cashback</td>
                    <td className="px-4 py-3">₹499</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>5% cashback on groceries & movies</li>
                        <li>1% cashback on other spends</li>
                        <li>Fuel surcharge waiver</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Flipkart Axis Bank</td>
                    <td className="px-4 py-3">Axis Bank</td>
                    <td className="px-4 py-3">5% cashback</td>
                    <td className="px-4 py-3">₹500</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>5% unlimited cashback on Flipkart</li>
                        <li>4% on preferred partners</li>
                        <li>1.5% on other spends</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">ICICI Amazon Pay</td>
                    <td className="px-4 py-3">ICICI Bank</td>
                    <td className="px-4 py-3">5% rewards</td>
                    <td className="px-4 py-3">₹500</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-sm">
                        <li>5% rewards on Amazon</li>
                        <li>2% on digital payments</li>
                        <li>Welcome benefits worth ₹2,500</li>
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
                  <span>• <span className="font-medium">Best Overall Rewards:</span> HDFC Diners Club Black (10X rewards)</span>
                  <a 
                    href="https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Best for Everyday Use:</span> HDFC SimplySAVE</span>
                  <a 
                    href="https://www.hdfcbank.com/personal/pay/cards/credit-cards/simplysave-credit-card" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Best for Online Shopping:</span> Flipkart Axis Bank Card</span>
                  <a 
                    href="https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 px-4 py-1 border border-blue-200 rounded-full text-sm"
                  >
                    Apply Now →
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <span className="font-medium">Best for Amazon Shopping:</span> ICICI Amazon Pay Card</span>
                  <a 
                    href="https://www.icicibank.com/card/credit-cards/amazon-pay-credit-card" 
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