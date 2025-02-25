'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Script from 'next/script';

interface PaymentSchedule {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export default function LoanPaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [tenure, setTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);

  // Structured data for the calculator
  const calculatorStructuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Personal Loan EMI Calculator",
    "description": "Calculate your monthly EMI, total interest cost, and view complete payment schedule for your personal loan.",
    "url": "https://financialhealth.co.in/learning-center/personal-loans/payment",
    "category": "Personal Loan Calculator",
    "provider": {
      "@type": "Organization",
      "name": "Financial Health",
      "url": "https://financialhealth.co.in"
    }
  };

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How is personal loan EMI calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Personal loan EMI is calculated using the formula: EMI = P × r × (1 + r)^n/((1 + r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months."
      }
    }, {
      "@type": "Question",
      "name": "What factors affect my EMI amount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your EMI amount is affected by three main factors: loan amount, interest rate, and loan tenure. A higher loan amount or interest rate increases EMI, while a longer tenure reduces it."
      }
    }]
  };

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = (rate / 12) / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const formatNumber = (num: number, showDecimals: boolean = false): string => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: showDecimals ? 2 : 0,
      minimumFractionDigits: showDecimals ? 2 : 0
    }).format(num);
  };

  const generateSchedule = () => {
    const monthlyRate = (interestRate / 12) / 100;
    const emi = calculateEMI(loanAmount, interestRate, tenure);
    setMonthlyEMI(emi);

    let balance = loanAmount;
    const newSchedule: PaymentSchedule[] = [];

    for (let month = 1; month <= tenure; month++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance = balance - principal;

      newSchedule.push({
        month,
        emi,
        principal,
        interest,
        remainingBalance: balance > 0 ? balance : 0,
      });
    }

    setSchedule(newSchedule);
  };

  useEffect(() => {
    generateSchedule();
  }, [loanAmount, tenure, interestRate]);

  return (
    <>
      <Head>
        <title>Personal Loan EMI Calculator | Calculate Monthly Payments | Financial Health</title>
        <meta name="description" content="Calculate your personal loan EMI, view amortization schedule, and understand total interest costs. Free EMI calculator with detailed payment breakup." />
        <meta name="keywords" content="personal loan calculator, EMI calculator, loan EMI, monthly payments, interest calculation, loan amortization, loan repayment schedule" />
        <meta property="og:title" content="Personal Loan EMI Calculator | Financial Health" />
        <meta property="og:description" content="Calculate your personal loan EMI and view complete amortization schedule. Free calculator with detailed payment breakup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financialhealth.co.in/learning-center/personal-loans/payment" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://financialhealth.co.in/learning-center/personal-loans/payment" />
      </Head>

      <Script
        id="calculator-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorStructuredData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <header className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Personal Loan EMI Calculator</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Plan your loan with confidence. Calculate EMI, interest costs, and see how much you could save with better rates.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Left side - Calculator Inputs */}
            <section aria-label="Calculator Inputs" className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label htmlFor="loanAmount" className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Loan Amount</label>
                  <input
                    id="loanAmount"
                    type="number"
                    inputMode="numeric"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min="1000"
                    aria-label="Enter loan amount"
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label htmlFor="tenure" className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Tenure (months)</label>
                  <input
                    id="tenure"
                    type="number"
                    inputMode="numeric"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    min="1"
                    max="360"
                    aria-label="Enter loan tenure in months"
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label htmlFor="interestRate" className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Interest Rate (%)</label>
                  <input
                    id="interestRate"
                    type="number"
                    inputMode="decimal"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min="1"
                    max="100"
                    step="0.1"
                    aria-label="Enter interest rate percentage"
                  />
                </div>
              </div>
            </section>

            {/* Right side - Results */}
            <section aria-label="Calculation Results" className="bg-white rounded-lg shadow p-4 sm:p-5">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
                  Monthly EMI: ₹{formatNumber(monthlyEMI)}
                </h2>
                <div className="h-0.5 w-16 bg-blue-500 mx-auto mt-2"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1">Total Interest Paid</h3>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    ₹{formatNumber(monthlyEMI * tenure - loanAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1">Interest Savings with 1% Lower Rate</h3>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    ₹{formatNumber(
                      monthlyEMI * tenure -
                      calculateEMI(loanAmount, interestRate - 1, tenure) * tenure
                    )}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Amortization Schedule */}
          <section aria-label="Amortization Schedule" className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" aria-label="Monthly payment schedule">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="border p-3 text-left">Month</th>
                    <th scope="col" className="border p-3 text-left">EMI</th>
                    <th scope="col" className="border p-3 text-left">Principal</th>
                    <th scope="col" className="border p-3 text-left">Interest</th>
                    <th scope="col" className="border p-3 text-left">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="border p-3">{row.month}</td>
                      <td className="border p-3">₹{formatNumber(row.emi)}</td>
                      <td className="border p-3">₹{formatNumber(row.principal)}</td>
                      <td className="border p-3">₹{formatNumber(row.interest)}</td>
                      <td className="border p-3">₹{formatNumber(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section aria-label="Frequently Asked Questions" className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">How is personal loan EMI calculated?</h3>
                <p className="text-gray-700">Personal loan EMI is calculated using the formula: EMI = P × r × (1 + r)^n/((1 + r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">What factors affect my EMI amount?</h3>
                <p className="text-gray-700">Your EMI amount is affected by three main factors: loan amount, interest rate, and loan tenure. A higher loan amount or interest rate increases EMI, while a longer tenure reduces it.</p>
              </div>
            </div>
          </section>

          <footer className="mt-4 sm:mt-6 text-center text-gray-600 text-xs sm:text-sm">
            {/* <p className="mb-1">This calculator provides approximate values for reference only.</p> */}
            <p>Actual loan terms and EMI may vary based on lender's policies and your credit profile.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
