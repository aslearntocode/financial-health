'use client'

import { useState, useEffect } from "react"
import { PieChart } from "@/components/PieChart"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { saveInvestmentData } from '@/lib/db'
import { supabase, testSupabaseConnection } from '../../lib/supabase'

interface InvestmentRecord {
  stocks: number
  bonds: number
  cash: number
  real_estate: number
  user_id: string
}

// Add type for Supabase error
type PostgrestError = {
  code?: string;
  message?: string;
  details?: string;
};

// Modify the checkExistingRecord function with simpler error handling
async function checkExistingRecord(formData: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('investment_records')
      .select('*')
      .eq('user_id', userId)
      .eq('age', parseInt(formData.age))
      .eq('current_savings', parseFloat(formData.current_savings))
      .eq('monthly_savings', parseFloat(formData.monthly_savings))
      .eq('investment_horizon', parseInt(formData.investment_horizon_years))
      .eq('financial_goal', formData.financial_goal)
      .single();

    if (error) {
      console.log('Query error:', error);
      return null;
    }

    console.log('Found existing record:', data);
    return data;

  } catch (err) {
    console.error('Database error:', err);
    throw new Error(err instanceof Error ? err.message : 'Database query failed');
  }
}

export default function InvestmentPage() {
  const router = useRouter()
  const [showChart, setShowChart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allocation, setAllocation] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    current_savings: '',
    monthly_savings: '',
    investment_horizon_years: '',
    financial_goal: ''
  })
  const [savedRecord, setSavedRecord] = useState<InvestmentRecord | null>(null)
  const [userName, setUserName] = useState('')

  // Add debug log for render
  console.log('Current state:', { showChart, isLoading, error, allocation })

  // Add click handler for the entire page
  useEffect(() => {
    const handlePageClick = () => {
      if (!auth.currentUser) {
        // Save current form data
        sessionStorage.setItem('formData', JSON.stringify(formData))
        sessionStorage.setItem('returnUrl', window.location.pathname)
        router.push('/login')
      }
    }

    // Add click listener to the page container
    const pageContainer = document.getElementById('investment-page-container')
    pageContainer?.addEventListener('click', handlePageClick)

    // Cleanup listener on unmount
    return () => {
      pageContainer?.removeEventListener('click', handlePageClick)
    }
  }, [auth.currentUser, formData, router])

  // Add this effect to fetch saved record when component mounts
  useEffect(() => {
    async function fetchSavedInvestment() {
      try {
        // Get current Firebase user
        const user = auth.currentUser
        if (!user) {
          setIsLoading(false)
          return
        }

        // Fetch the latest record for this user
        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setSavedRecord(data)
      } catch (error) {
        console.error('Error fetching saved investment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedInvestment()
  }, []) // Run once when component mounts

  // Add useEffect to get and set user's name from Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Get the user's name from Firebase auth
        const displayName = user.displayName || user.email?.split('@')[0] || ''
        setUserName(displayName)
      }
    })

    return () => unsubscribe()
  }, [])

  // Add this effect at the top of your component
  useEffect(() => {
    async function checkConnection() {
      const isConnected = await testSupabaseConnection();
      console.log('Supabase connection status:', isConnected);
    }
    checkConnection();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
      sessionStorage.setItem('returnUrl', window.location.pathname);
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the user's name from auth
      const userName = auth.currentUser.displayName || 
                      auth.currentUser.email?.split('@')[0] || 
                      'Anonymous User';

      // Check for existing record
      const existingRecord = await checkExistingRecord(formData, auth.currentUser.uid);
      
      if (existingRecord && existingRecord.allocation) {
        console.log('Using existing record:', existingRecord);
        setAllocation(existingRecord.allocation);
        setShowChart(true);
        return;
      }

      // If no existing record, call OpenAI API
      console.log('No existing record found, calling OpenAI API...');
      
      const apiFormData = {
        ...formData,
        name: userName, // Include the name
        userId: auth.currentUser.uid,
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon: parseInt(formData.investment_horizon_years)
      };
      
      console.log('Sending data to API:', apiFormData);
      
      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.allocation) {
        throw new Error('No allocation data received from API');
      }

      // Set the allocation data from API response
      setAllocation(data.allocation);
      setShowChart(true);

      // Save the new data to Supabase with the name
      try {
        const saveData = {
          user_id: auth.currentUser.uid,
          name: userName, // Ensure name is included
          age: parseInt(formData.age),
          current_savings: parseFloat(formData.current_savings),
          monthly_savings: parseFloat(formData.monthly_savings),
          investment_horizon: parseInt(formData.investment_horizon_years),
          financial_goal: formData.financial_goal,
          allocation: data.allocation
        };

        console.log('Saving data with name:', saveData);
        
        await saveInvestmentData(saveData);
        console.log('New data saved to Supabase');
      } catch (supabaseError) {
        console.error('Failed to save to Supabase:', supabaseError);
        setError('Warning: Failed to save your results, but you can still view them.');
      }

    } catch (error) {
      console.error('HandleCalculate error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      setError(error instanceof Error ? error.message : 'Failed to calculate allocation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="investment-page-container" className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Investment Profile</h2>
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  readOnly
                  className="form-input bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_savings">Current Savings</Label>
                <Input
                  id="current_savings"
                  type="number"
                  placeholder="Enter your current savings"
                  value={formData.current_savings}
                  onChange={(e) => setFormData({ ...formData, current_savings: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_savings">Monthly Savings</Label>
                <Input
                  id="monthly_savings"
                  type="number"
                  placeholder="Enter your monthly savings"
                  value={formData.monthly_savings}
                  onChange={(e) => setFormData({ ...formData, monthly_savings: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment_horizon_years">Investment Horizon (Years)</Label>
                <Input
                  id="investment_horizon_years"
                  type="number"
                  placeholder="Enter investment duration in years"
                  value={formData.investment_horizon_years}
                  onChange={(e) => setFormData({ ...formData, investment_horizon_years: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financial_goal">Financial Goal</Label>
                <Select 
                  value={formData.financial_goal}
                  onValueChange={(value) => setFormData({ ...formData, financial_goal: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your financial goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="House">House Purchase</SelectItem>
                    <SelectItem value="Wealth">Wealth Creation</SelectItem>
                    <SelectItem value="Passive Income">Passive Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Calculating...' : 'Calculate Allocation'}
              </Button>
            </form>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Your Investment Allocation</h2>
            {isLoading ? (
              <p>Calculating your allocation...</p>
            ) : showChart && allocation.length > 0 ? (
              <>
                <p className="text-gray-600 mb-8">
                  Based on your profile, here's your recommended investment allocation:
                </p>
                <PieChart data={allocation} />
              </>
            ) : (
              <p>Fill out the form and calculate to see your allocation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 