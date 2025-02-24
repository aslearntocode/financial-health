'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

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
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <header className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Loan Payment Calculator</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Plan your loan with confidence. Calculate EMI, interest costs, and see how much you could save with better rates.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Left side - Calculator Inputs */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Loan Amount</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  min="1000"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Tenure (months)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  min="1"
                  max="360"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block mb-1 text-sm sm:text-base font-semibold text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  min="1"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Right side - Results */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-5">
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
          </div>
        </div>

        <footer className="mt-4 sm:mt-6 text-center text-gray-600 text-xs sm:text-sm">
          <p className="mb-1">This calculator provides approximate values for reference only.</p>
          <p>Actual loan terms and EMI may vary based on lender's policies and your credit profile.</p>
        </footer>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left">Month</th>
                <th className="border p-3 text-left">EMI</th>
                <th className="border p-3 text-left">Principal</th>
                <th className="border p-3 text-left">Interest</th>
                <th className="border p-3 text-left">Remaining Balance</th>
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
      </div>
    </>
  );
}
