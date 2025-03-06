'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoanFDComparison() {
  // State for form inputs (amounts in lakhs)
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanRate, setLoanRate] = useState<string>('');
  const [loanTenure, setLoanTenure] = useState<string>('');
  const [fdAmount, setFdAmount] = useState<string>('');
  const [fdRate, setFdRate] = useState<string>('');
  const [fdTotalTenure, setFdTotalTenure] = useState<string>('');
  const [fdRemainingTenure, setFdRemainingTenure] = useState<string>('');

  // Initialize results
  const [results, setResults] = useState({
    loanInterest: 0,
    fdInterest: 0,
    difference: 0
  });

  useEffect(() => {
    if (loanAmount && loanRate && loanTenure && 
        fdAmount && fdRate && fdTotalTenure && fdRemainingTenure) {
      
      // Convert inputs to numbers (convert lakhs to actual amount)
      const loan = {
        amount: parseFloat(loanAmount) * 100000, // Convert lakhs to actual amount
        rate: parseFloat(loanRate),
        tenure: parseInt(loanTenure)
      };

      const fd = {
        amount: parseFloat(fdAmount) * 100000, // Convert lakhs to actual amount
        rate: parseFloat(fdRate),
        totalTenure: parseInt(fdTotalTenure),
        remainingTenure: parseInt(fdRemainingTenure)
      };

      // Calculate loan interest (EMI formula)
      const annualLoanRate = loan.rate / 100;
      const monthlyRate = annualLoanRate / 12;
      const emi = loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.tenure) / 
                  (Math.pow(1 + monthlyRate, loan.tenure) - 1);
      const totalLoanPayment = emi * loan.tenure;
      const loanInterest = totalLoanPayment - loan.amount;

      // Calculate FD interest with completed and remaining tenure
      const completedMonths = fd.totalTenure - fd.remainingTenure;
      const completedYears = completedMonths / 12;
      const remainingYears = fd.remainingTenure / 12;
      
      // Calculate current FD value after completed tenure
      const annualFdRate = fd.rate / 100;
      const currentFdValue = fd.amount * Math.pow(1 + annualFdRate, completedYears);
      
      // Calculate FD value at maturity
      const maturityValue = currentFdValue * (1 + annualFdRate * remainingYears);
      
      // Total FD interest for remaining period
      const fdInterest = maturityValue - currentFdValue;

      // Calculate net difference
      const difference = fdInterest - loanInterest;

      setResults({
        loanInterest: Math.round(loanInterest),
        fdInterest: Math.round(fdInterest),
        difference: Math.round(difference)
      });
    } else {
      setResults({
        loanInterest: 0,
        fdInterest: 0,
        difference: 0
      });
    }
  }, [loanAmount, loanRate, loanTenure, fdAmount, fdRate, fdTotalTenure, fdRemainingTenure]);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">Loan vs FD Calculator</h1>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Loan Details Card */}
          <Card className="col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-200 border-t-4 border-primary">
            <CardHeader className="p-2 sm:p-4 border-b bg-muted/50">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-4">
              <div className="space-y-1">
                <Label htmlFor="loanAmount" className="text-sm font-medium">Loan Amount (in Lakhs)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount in lakhs"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="loanRate" className="text-sm font-medium">Interest Rate (% p.a.)</Label>
                <Input
                  id="loanRate"
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  placeholder="Enter loan interest rate"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="loanTenure" className="text-sm font-medium">Tenure (months)</Label>
                <Input
                  id="loanTenure"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  placeholder="Enter loan tenure"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* FD Details Card */}
          <Card className="col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-200 border-t-4 border-primary">
            <CardHeader className="p-2 sm:p-4 border-b bg-muted/50">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FD Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-4">
              <div className="space-y-1">
                <Label htmlFor="fdAmount" className="text-sm font-medium">FD Amount (in Lakhs)</Label>
                <Input
                  id="fdAmount"
                  type="number"
                  value={fdAmount}
                  onChange={(e) => setFdAmount(e.target.value)}
                  placeholder="Enter FD amount in lakhs"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fdRate" className="text-sm font-medium">Interest Rate (% p.a.)</Label>
                <Input
                  id="fdRate"
                  type="number"
                  value={fdRate}
                  onChange={(e) => setFdRate(e.target.value)}
                  placeholder="Enter FD interest rate"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fdTotalTenure" className="text-sm font-medium">Total Tenure (months)</Label>
                <Input
                  id="fdTotalTenure"
                  type="number"
                  value={fdTotalTenure}
                  onChange={(e) => setFdTotalTenure(e.target.value)}
                  placeholder="Enter total FD tenure"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fdRemainingTenure" className="text-sm font-medium">Remaining Tenure (months)</Label>
                <Input
                  id="fdRemainingTenure"
                  type="number"
                  value={fdRemainingTenure}
                  onChange={(e) => setFdRemainingTenure(e.target.value)}
                  placeholder="Enter remaining tenure"
                  className="text-sm h-8 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section - More compact */}
        <Card className="mt-3 sm:mt-4 shadow-lg">
          <CardHeader className="p-2 sm:p-4 border-b bg-muted/50">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-2">
              <p className="text-sm flex justify-between">
                <span>Total Loan Interest:</span>
                <span className="font-semibold">₹{Math.abs(results.loanInterest).toLocaleString()}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>Total FD Interest:</span>
                <span className="font-semibold">₹{Math.abs(results.fdInterest).toLocaleString()}</span>
              </p>
              <div className={`text-sm font-semibold flex justify-between p-2 rounded-md 
                ${!loanAmount || !loanRate || !loanTenure || !fdAmount || !fdRate || !fdTotalTenure || !fdRemainingTenure 
                  ? 'bg-gray-50 text-gray-500' 
                  : results.difference < 0 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-green-50 text-green-600'}`}>
                <span>Net Difference:</span>
                <span>
                  ₹{results.difference.toLocaleString()}
                  {(loanAmount && loanRate && loanTenure && fdAmount && fdRate && fdTotalTenure && fdRemainingTenure) && (
                    <span className="text-xs ml-2">
                      {results.difference > 0 ? "(Keep FD)" : "(Consider breaking FD)"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
