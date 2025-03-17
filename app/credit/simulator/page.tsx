'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/components/Header"
import Image from "next/image"

interface ScoreImpactSimulation {
  action: string;
  currentValue: number;
  newValue: number;
  impact: number;
  type: 'amount' | 'percentage' | 'years';
}

interface SimulationOption {
  id: string;
  name: string;
  description: string;
  type: 'amount' | 'percentage' | 'years';
  placeholder: string;
  defaultValue?: number;
}

const SIMULATION_OPTIONS: SimulationOption[] = [
  {
    id: 'new_loan',
    name: 'Take a New Loan',
    description: 'Simulate the impact of taking a new loan',
    type: 'amount',
    placeholder: 'Enter loan amount'
  },
  {
    id: 'pay_overdue',
    name: 'Pay Overdue Amount',
    description: 'See how paying off overdue amounts affects your score',
    type: 'amount',
    placeholder: 'Enter amount to pay'
  },
  {
    id: 'pay_writeoff',
    name: 'Pay Written-off Amount',
    description: 'Understand the impact of paying written-off accounts',
    type: 'amount',
    placeholder: 'Enter amount to pay'
  },
  {
    id: 'settle_writeoff',
    name: 'Settle Written-off Amount',
    description: 'See how settling written-off accounts affects your score',
    type: 'amount',
    placeholder: 'Enter settlement amount'
  },
  {
    id: 'account_age',
    name: 'Account Age Increase with Timely Payments',
    description: 'Simulate the impact of account aging',
    type: 'years',
    placeholder: 'Enter number of years',
    defaultValue: 2
  },
  {
    id: 'utilization',
    name: 'Credit Utilization Reduction',
    description: 'See how reducing credit utilization helps',
    type: 'percentage',
    placeholder: 'Enter reduction percentage'
  }
];

export default function CreditScoreSimulatorPage() {
  const router = useRouter()
  const [score, setScore] = useState<number>(700)
  const [simulations, setSimulations] = useState<ScoreImpactSimulation[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [simulationValue, setSimulationValue] = useState<number>(0)
  
  const calculateScoreImpact = (action: string, amount: number): number => {
    const MAX_SCORE = 900;
    
    switch (action) {
      case 'new_loan':
        // New account impact (14.8%) + Inquiry impact (13.1%)
        const baseImpact = Math.floor(MAX_SCORE * -0.279);
        return Math.max(baseImpact, -25 - Math.floor(amount / 100000));
        
      case 'pay_overdue':
        // Overdue accounts impact (14.5%)
        const overdueImpact = Math.floor(MAX_SCORE * 0.145);
        return Math.min(overdueImpact, Math.floor(amount / 5000));
        
      case 'pay_writeoff':
        // Write-offs impact (15.1%)
        const writeoffImpact = Math.floor(MAX_SCORE * 0.151);
        return Math.min(writeoffImpact, Math.floor(amount / 5000));
        
      case 'settle_writeoff':
        // Partial write-off impact (15.1% * 0.7 for settlement)
        const settlementImpact = Math.floor(MAX_SCORE * 0.151 * 0.7);
        return Math.min(settlementImpact, Math.floor(amount / 7000));
        
      case 'account_age':
        // Credit history length impact (16.0%)
        const ageImpact = Math.floor((MAX_SCORE * 0.16) / 10); // Spread over 10 years
        return Math.min(amount * ageImpact, Math.floor(MAX_SCORE * 0.16));
        
      case 'utilization':
        // Current balance impact (7.0%)
        const utilizationImpact = Math.floor(MAX_SCORE * 0.07);
        return Math.min(Math.floor(amount * 0.7), utilizationImpact);
        
      default:
        return 0;
    }
  };

  const handleSimulate = () => {
    if (!selectedOption || !simulationValue) return;
    
    const impact = calculateScoreImpact(selectedOption, simulationValue);
    const option = SIMULATION_OPTIONS.find(opt => opt.id === selectedOption);
    
    setSimulations(prev => [...prev, {
      action: selectedOption,
      currentValue: 0,
      newValue: simulationValue,
      impact,
      type: option?.type || 'amount'
    }]);
    
    setSelectedOption('');
    setSimulationValue(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 600) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Simulator Controls */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                <h1 className="text-3xl font-bold mb-3 text-gray-900">Credit Score Simulator</h1>
                <p className="text-gray-600 mb-8 text-lg">
                  See how different financial actions might affect your credit score
                </p>

                {/* Current Score Input */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Current Score
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                        transition-all duration-200"
                      placeholder="Enter your current score"
                      value={score || ''}
                      onChange={(e) => setScore(Number(e.target.value))}
                      min="300"
                      max="900"
                    />
                    <div className={`text-3xl font-bold ${getScoreColor(score)} min-w-[100px] text-center`}>
                      {score}
                    </div>
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Action to Simulate
                    </label>
                    <select
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                        transition-all duration-200 bg-white"
                      value={selectedOption}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        const option = SIMULATION_OPTIONS.find(opt => opt.id === e.target.value);
                        if (option?.defaultValue) {
                          setSimulationValue(option.defaultValue);
                        } else {
                          setSimulationValue(0);
                        }
                      }}
                    >
                      <option value="">Select an action</option>
                      {SIMULATION_OPTIONS.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedOption && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {SIMULATION_OPTIONS.find(opt => opt.id === selectedOption)?.description}
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                            transition-all duration-200"
                          placeholder={SIMULATION_OPTIONS.find(opt => opt.id === selectedOption)?.placeholder}
                          value={simulationValue || ''}
                          onChange={(e) => setSimulationValue(Number(e.target.value))}
                          min="0"
                        />
                        <button
                          onClick={handleSimulate}
                          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 
                            transition-all duration-200 font-semibold shadow-md hover:shadow-lg
                            active:scale-95"
                        >
                          Simulate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              {simulations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                  <h3 className="text-3xl font-bold mb-6 text-gray-900">Simulation Results</h3>
                  <div className="space-y-4">
                    {SIMULATION_OPTIONS.map(option => {
                      const optionSimulations = simulations.filter(sim => sim.action === option.id);
                      if (optionSimulations.length === 0) return null;

                      return (
                        <div key={option.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-700">{option.name}</span>
                            <button
                              onClick={() => {
                                setSimulations(prev => prev.filter(sim => sim.action !== option.id));
                              }}
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="space-y-2">
                            {optionSimulations.map((sim, index) => (
                              <div key={index} 
                                className="flex items-center justify-between p-3 bg-white rounded-lg
                                  shadow-sm group hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-center justify-between flex-1 mr-3">
                                  <span className="text-gray-600">
                                    {sim.type === 'amount' ? `₹${sim.newValue.toLocaleString()}` :
                                     sim.type === 'percentage' ? `${sim.newValue}%` :
                                     `${sim.newValue} years`}
                                  </span>
                                  <span className={`font-semibold ${sim.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {sim.impact > 0 ? '+' : ''}{sim.impact} points
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSimulations(prev => 
                                      prev.filter((_, i) => i !== simulations.indexOf(sim))
                                    );
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 
                                    text-gray-400 hover:text-red-500"
                                  title="Remove this simulation"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl 
                      font-semibold mt-6 border border-blue-100"
                    >
                      <span className="text-gray-700">Estimated New Score</span>
                      <span className={`text-2xl ${getScoreColor(
                        score + simulations.reduce((acc, sim) => acc + sim.impact, 0)
                      )}`}>
                        {score + simulations.reduce((acc, sim) => acc + sim.impact, 0)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSimulations([])}
                    className="mt-6 text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Clear All Simulations
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Image */}
            <div className="hidden md:block relative">
              <div className="sticky top-24">
                <Image
                  src="/CreditSimulator.png"
                  alt="Credit Score Simulation Illustration"
                  width={500}
                  height={500}
                  className="w-[500px] h-auto rounded-2xl shadow-lg mx-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 