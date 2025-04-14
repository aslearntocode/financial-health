"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import './styles.css';

// Update interfaces
interface SubCategories {
  shortTerm?: string[];
  longTerm?: string[];
  speculative?: string[];
  nonSpeculative?: string[];
}

type SubCategoriesType = Partial<SubCategories>;

interface IncomeHead {
  title: string;
  details?: string[];
  subCategories?: SubCategoriesType;
}

const TaxableIncomePage = () => {
  // Track expanded state for each step
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const incomeHeads: Record<string, IncomeHead> = {
    salary: {
      title: "Income from Salary",
      details: ["Basic Salary", "HRA", "Special Allowances", "Perquisites", "Other Allowances"]
    },
    houseProperty: {
      title: "Income from House Property",
      details: ["Rental Income", "Municipal Taxes", "Interest on Home Loan", "Standard Deduction"]
    },
    capitalGains: {
      title: "Income from Capital Gains",
      subCategories: {
        shortTerm: ["Stocks < 1 year", "Property < 2 years"],
        longTerm: ["Stocks > 1 year", "Property > 2 years"]
      }
    },
    business: {
      title: "Income from Business",
      subCategories: {
        speculative: ["Intraday Trading", "Futures & Options"],
        nonSpeculative: ["Regular Business Income", "Professional Income"]
      }
    },
    otherSources: {
      title: "Income from Other Sources",
      details: ["Interest Income", "Dividends", "Gifts", "Lottery", "Commission"]
    }
  };

  const steps = [
    {
      id: 1,
      title: "Calculate Gross Total Income",
      description: "Sum up income from all 5 heads of income. Click to see details.",
      icon: "💰",
      expandedContent: (
        <Card className="p-8 bg-white">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">5 Heads of Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {Object.entries(incomeHeads).map(([key, income]) => (
              <div key={key} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-lg mb-3 text-gray-800">{income.title}</h4>
                {income.details ? (
                  <ul className="space-y-2">
                    {income.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {detail}</li>
                    ))}
                  </ul>
                ) : income.subCategories && (
                  <div className="space-y-4">
                    {income.subCategories.shortTerm && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700">Short Term:</h5>
                        <ul className="space-y-1">
                          {income.subCategories.shortTerm.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {income.subCategories.longTerm && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700">Long Term:</h5>
                        <ul className="space-y-1">
                          {income.subCategories.longTerm.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {income.subCategories.speculative && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700">Speculative:</h5>
                        <ul className="space-y-1">
                          {income.subCategories.speculative.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {income.subCategories.nonSpeculative && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-gray-700">Non-Speculative:</h5>
                        <ul className="space-y-1">
                          {income.subCategories.nonSpeculative.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      id: 2,
      title: "Combine All Income Sources",
      description: "Add up income from all heads to arrive at total income",
      icon: "🔄",
      expandedContent: (
        <Card className="p-8 bg-white">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">Combining Income Sources</h3>
          <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Steps to Combine Income:</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Add all positive income from different heads</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Include income of spouse/minor if applicable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Consider clubbing provisions for family income</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Exclude exempt income under various sections</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 3,
      title: "Offset Losses",
      description: "Adjust for any losses from current year or carried forward",
      icon: "📊",
      expandedContent: (
        <Card className="p-8 bg-white">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">Loss Adjustment Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Current Year Losses</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Business losses can be set off against any head of income</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Capital losses can only be set off against capital gains</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>House property loss up to ₹2 lakhs can be set off</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Carried Forward Losses</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Business losses can be carried forward for 8 years</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Speculation losses can be carried forward for 4 years</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span>Capital losses can be carried forward for 8 years</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 4,
      title: "Apply Deductions",
      description: "Claim eligible deductions under various sections",
      icon: "✅",
      expandedContent: (
        <Card className="p-8 bg-white">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">Available Deductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Section 80C (₹1.5L)</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">• PPF Investment</li>
                <li className="text-sm text-gray-600">• ELSS Mutual Funds</li>
                <li className="text-sm text-gray-600">• Life Insurance Premium</li>
                <li className="text-sm text-gray-600">• Home Loan Principal</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Health & Education</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">• 80D: Health Insurance</li>
                <li className="text-sm text-gray-600">• 80E: Education Loan</li>
                <li className="text-sm text-gray-600">• 80DD: Medical Treatment</li>
                <li className="text-sm text-gray-600">• 80DDB: Specified Diseases</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Other Deductions</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">• 80G: Donations</li>
                <li className="text-sm text-gray-600">• 80GG: House Rent</li>
                <li className="text-sm text-gray-600">• 80TTA: Savings Interest</li>
                <li className="text-sm text-gray-600">• 80U: Disability</li>
              </ul>
            </div>
          </div>
        </Card>
      )
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold mb-16 text-center text-gray-800">
            Taxable Income Calculation Workflow
          </h1>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 px-2 md:px-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center w-full md:w-64 relative workflow-step">
                {/* Connector Line - Hidden on mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute top-16 left-[60%] w-[calc(100%-40px)] h-[2px] bg-[#98f6e4] hidden md:block" />
                )}
                
                {/* Circle Icon */}
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#98f6e4] flex items-center justify-center mb-6 z-10 shadow-md">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                
                {/* Content Card */}
                <div 
                  className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#e5e7eb] w-full max-w-sm md:max-w-none h-[180px] flex flex-col cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => toggleStep(step.id)}
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    {step.description}
                  </p>
                  <span className="text-blue-500 text-sm mt-2">
                    ▼ Click to {expandedSteps.includes(step.id) ? 'collapse' : 'expand'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Content Section - Added responsive padding */}
          {expandedSteps.map(stepId => (
            <div key={stepId} className="mt-8 w-full px-4 md:px-0 md:max-w-6xl mx-auto transition-all duration-300 ease-in-out">
              {steps.find(step => step.id === stepId)?.expandedContent}
            </div>
          ))}

          {/* Final Card - Added responsive padding */}
          <Card className="mt-20 p-6 md:p-8 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 shadow-lg mx-4 md:mx-auto md:max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Net Taxable Income = </h2>
            <p className="text-gray-700 text-center">
              <strong className="block mt-2 text-base md:text-lg">
                Gross Total Income + Combined Income of Spouse/Minor + Family Income - Losses - Eligible Deductions
              </strong>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
};

export default TaxableIncomePage;
