'use client'

import Header from "@/components/Header"

export default function AboutPage() {
  return (
    <div>
      {/* Blue section with fixed height */}
      <div className="bg-[#2563eb] h-[400px]">
        <Header />
        
        {/* Hero Section */}
        <div className="text-center text-white pt-20 px-4">
          
          <p className="text-3xl max-w-3xl mx-auto">
            Welcome to Financial Health, where smart investing meets precision and personalization.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 -mt-20 bg-white rounded-lg shadow-lg">
        {/* Audio Player */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Listen to Our Story</h3>
          <audio controls className="w-full">
            <source src="/AboutUs.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="lead">
            Our mission is simple: to empower individuals like you to make informed, confident decisions about your financial future be it Investments or Credit.
            In a world where investment choices can often feel overwhelming, we are here to guide you toward the right financial instruments—without human biases, and with the help of cutting-edge AI technology.
            For Credit, there are a lot of options available but how do you get the best possible product at the lowest possible interest rate is where our AI comes in. We help you understand and improve your credit score and then confidently apply for a loan product that you are most likely to get approved for.

          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Problem</h2>
          <p className="mb-6"> 
            Navigating the world of investments and credit is complex. <br /> </p>
          <p className="mb-6"> 
            From choosing the right mix of mutual funds, bonds, stocks, and alternative assets, to ensuring your portfolio aligns with your long-term goals, the sheer number of options and advice out there can be paralyzing. 
            Worse, human biases often cloud investment decisions, whether they come from emotions, subjective experiences, or outdated strategies.
            <br /> </p>
            <p className="mb-6">
            Similarly, for Credit, there are a lot of options available and an easy access to loans at high interest rates can put you in a lot of debt.
            You might be able to get a loan at 12% interest rate but if you have a credit score of 750, you can get a loan at 8% interest rate. This would mean a significant difference in the total amount you pay over the loan period.
            <br />
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Solution</h2>
          <p>
            At Financial Health, we leverage the power of AI to provide you with unbiased, data-driven insights on how to distribute your portfolio across different financial instruments. Our platform offers personalized guidance to help you understand how much you should invest in each asset class, all based on your unique financial goals, risk tolerance, and time horizon.
          </p>
          <p>
            We don't just stop at asset allocation—we go further. Once you understand the "how much," we suggest specific investment opportunities like mutual funds, bonds, and more, to make sure your money is placed in the right instruments at the right time. With our system, you get an investment plan that is tailored to you—without the clutter or confusion.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why We Do It</h2>
          <p>
            Our founder knows firsthand the challenges of handling the money and planning for the future. An IIT Bombay graduate with an MBA from UNC Chapel Hill, he has spent over 15 years in the banking industry, working with some of the world's leading financial institutions. 
            Despite this extensive experience, he struggled with taking the right financial decisions, often feeling overwhelmed by conflicting advice and constantly evolving markets and his own credit needs.
          </p>
          <p>
            This personal struggle inspired the creation of financialhealth.co.in —a platform where data, not bias, drives recommendations. 
            With AI, we aim to remove the guesswork and empower you to make better financial decisions, based on your individual needs and circumstances.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Approach</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>Personalized Financial Guidance:</strong> We understand that every individual's financial situation is unique. Our AI-powered system assesses your risk profile, goals, and investment horizon to recommend a portfolio allocation that works best for you.
            </li>
            <li>
              <strong>Unbiased Recommendations:</strong> Say goodbye to conflicting advice from human advisors with hidden interests. Our platform only suggests the best financial instruments, based on data, historical performance, and your personal preferences.
            </li>
            <li>
              <strong>Continuous Learning:</strong> Our AI evolves with market changes, so your portfolio is always aligned with the latest trends and conditions. Whether you're a conservative investor or a more aggressive one, we adapt and provide real-time recommendations to optimize your returns.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Join Us on Our Journey</h2>
          <p>
            At Financial Health, we believe that financial literacy and smart investing should be accessible to everyone, regardless of background or experience. Whether you're just starting your investment journey or looking to optimize an existing portfolio, we're here to guide you every step of the way.
          </p>
          <p className="font-medium text-lg mt-6">
            Together, we can take the guesswork out of Finance and build a secure, prosperous future.
          </p>
        </div>
      </div>
    </div>
  )
} 
