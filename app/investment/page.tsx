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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface InvestmentRecord {
  stocks: number
  bonds: number
  cash: number
  real_estate: number
  user_id: string
  has_emergency_fund: 'Y' | 'N'
  needs_money_during_horizon: 'Y' | 'N'
}

// Add type for Supabase error
type PostgrestError = {
  code?: string;
  message?: string;
  details?: string;
};

// Modify the checkExistingRecord function to be more precise
async function checkExistingRecord(formData: any, userId: string) {
  try {
    // Format the values for comparison
    const searchParams = {
      user_id: userId,
      age: parseInt(formData.age),
      current_savings: parseFloat(formData.current_savings),
      monthly_savings: parseFloat(formData.monthly_savings),
      investment_horizon: parseInt(formData.investment_horizon_years),
      financial_goal: formData.financial_goal,
      has_emergency_fund: formData.has_emergency_fund,
      needs_money_during_horizon: formData.needs_money_during_horizon
    };

    console.log('Searching for existing record with params:', searchParams);

    const { data, error } = await supabase
      .from('investment_records')
      .select('*')
      .eq('user_id', searchParams.user_id)
      .eq('age', searchParams.age)
      .eq('current_savings', searchParams.current_savings)
      .eq('monthly_savings', searchParams.monthly_savings)
      .eq('investment_horizon', searchParams.investment_horizon)
      .eq('financial_goal', searchParams.financial_goal)
      .eq('has_emergency_fund', searchParams.has_emergency_fund)
      .eq('needs_money_during_horizon', searchParams.needs_money_during_horizon);

    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }

    // Log the results
    console.log('Supabase query returned:', {
      recordsFound: data?.length || 0,
      firstRecord: data?.[0] || null
    });

    // Return the first matching record if any exists
    return data && data.length > 0 ? data[0] : null;

  } catch (err) {
    console.error('Database error:', err);
    return null;
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
    financial_goal: '',
    has_emergency_fund: 'N' as 'Y' | 'N',
    needs_money_during_horizon: 'N' as 'Y' | 'N'
  })
  const [savedRecord, setSavedRecord] = useState<InvestmentRecord | null>(null)
  const [userName, setUserName] = useState('')
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [dialogActions, setDialogActions] = useState<{ onProceed?: () => Promise<void> }>({})
  const [monthlyCount, setMonthlyCount] = useState(0)
  const [isAuthReady, setIsAuthReady] = useState(false)

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

  // Load saved data when component mounts
  useEffect(() => {
    try {
      // Load saved form data and allocation from localStorage
      const savedFormData = localStorage.getItem('investmentFormData');
      const savedAllocation = localStorage.getItem('investmentAllocation');
      
      console.log('Loading saved data:', { savedFormData, savedAllocation });
      
      if (savedFormData) {
        const parsedFormData = JSON.parse(savedFormData);
        console.log('Setting form data:', parsedFormData);
        setFormData(parsedFormData);
      }
      
      if (savedAllocation) {
        const parsedAllocation = JSON.parse(savedAllocation);
        console.log('Setting allocation:', parsedAllocation);
        setAllocation(parsedAllocation);
        setShowChart(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []); // Run once when component mounts

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
        
        if (data) {
          // Set form data
          setFormData({
            name: data.name,
            age: data.age.toString(),
            current_savings: data.current_savings.toString(),
            monthly_savings: data.monthly_savings.toString(),
            investment_horizon_years: data.investment_horizon.toString(),
            financial_goal: data.financial_goal,
            has_emergency_fund: data.has_emergency_fund,
            needs_money_during_horizon: data.needs_money_during_horizon
          });
          
          if (data.allocation) {
            setAllocation(data.allocation);
            setShowChart(true);
          }
          
          setSavedRecord(data);
        }
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

  // Add function to check monthly generation count
  const checkMonthlyGenerationCount = async (userId: string) => {
    try {
      // Get the first day of current month in UTC
      const now = new Date();
      const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      
      console.log('=== Starting Monthly Count Check ===');
      console.log('User ID:', userId);
      console.log('First day of month (UTC):', firstDayOfMonth.toISOString());

      // First verify the user ID is valid
      if (!userId) {
        console.error('Invalid user ID provided');
        throw new Error('Invalid user ID');
      }

      // Query investment_records table
      const { data, error } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', firstDayOfMonth.toISOString());

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // Log the raw data returned
      console.log('Raw Supabase response:', data);

      const count = data?.length || 0;
      console.log('Monthly generation count:', count);

      // Set state and handle count conditions
      setMonthlyCount(count);
      
      if (count === 2) {
        console.log('WARNING: This is the last available generation');
        setShowWarningDialog(true);
        return count;
      } else if (count >= 3) {
        console.log('ERROR: Monthly limit exceeded');
        throw new Error('You have reached the maximum limit of 3 portfolio generations this month.');
      }

      console.log('=== Count Check Complete ===');
      return count;

    } catch (error) {
      console.error('Error in checkMonthlyGenerationCount:', error);
      throw error;
    }
  };

  // Modify handleCalculate to check count before proceeding
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        sessionStorage.setItem('formData', JSON.stringify(formData));
        sessionStorage.setItem('returnUrl', window.location.pathname);
        router.push('/login');
        return;
      }

      // Get the first day of current month in UTC
      const now = new Date();
      const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      
      console.log('Checking portfolio count for user:', auth.currentUser.uid);

      // Query to count existing portfolios
      const { data, error } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', auth.currentUser.uid)
        .gte('created_at', firstDayOfMonth.toISOString());

      if (error) {
        console.error('Error checking portfolio count:', error);
        throw error;
      }

      const count = data?.length || 0;
      console.log('Current portfolio count this month:', count);

      // Check count and handle accordingly
      if (count >= 3) {
        setError('You have already generated the maximum allowed portfolios (3) for this month. Please try again next month.');
        setIsLoading(false);
        return;
      }

      if (count === 2) {
        // Show warning dialog for last attempt
        return new Promise((resolve) => {
          const handleProceed = async () => {
            setShowWarningDialog(false);
            await generatePortfolio();
            resolve();
          };
          setDialogActions({ onProceed: handleProceed });
          setShowWarningDialog(true);
        });
      }

      // Proceed with normal generation for count 0 or 1
      await generatePortfolio();

    } catch (error) {
      console.error('HandleCalculate error:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate allocation');
      setShowChart(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function for portfolio generation
  const generatePortfolio = async () => {
    try {
      const userName = auth.currentUser.displayName || 
                      auth.currentUser.email?.split('@')[0] || 
                      'Anonymous User';

      const apiFormData = {
        userId: auth.currentUser.uid,
        name: userName,
        age: formData.age,
        current_savings: formData.current_savings,
        monthly_savings: formData.monthly_savings,
        investment_horizon_years: formData.investment_horizon_years,
        financial_goal: formData.financial_goal,
        has_emergency_fund: formData.has_emergency_fund,
        needs_money_during_horizon: formData.needs_money_during_horizon
      };

      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiFormData)
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        throw new Error('Failed to parse API response');
      }

      if (data.allocation) {
        setAllocation(data.allocation);
        setShowChart(true);

        // Save to Supabase
        const finalSaveData = {
          user_id: auth.currentUser.uid,
          name: userName,
          age: parseInt(formData.age),
          current_savings: parseFloat(formData.current_savings),
          monthly_savings: parseFloat(formData.monthly_savings),
          investment_horizon: parseInt(formData.investment_horizon_years),
          financial_goal: formData.financial_goal,
          has_emergency_fund: formData.has_emergency_fund,
          needs_money_during_horizon: formData.needs_money_during_horizon,
          allocation: data.allocation
        };

        const { error: supabaseError } = await supabase
          .from('investment_records')
          .insert([finalSaveData]);

        if (supabaseError) throw supabaseError;
      }
    } catch (error) {
      throw error;
    }
  };

  // Add this useEffect to monitor dialog state
  useEffect(() => {
    console.log('Warning dialog state changed:', showWarningDialog);
  }, [showWarningDialog]);

  // Modify the useEffect for initial count check
  useEffect(() => {
    const checkInitialCount = async () => {
      try {
        // Wait for auth to be ready
        if (!auth.currentUser) {
          console.log('No user logged in');
          return;
        }

        console.log('Checking count for user:', auth.currentUser.uid);
        
        // Get the first day of current month in UTC
        const now = new Date();
        const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        
        // Query to count existing portfolios
        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', auth.currentUser.uid)
          .gte('created_at', firstDayOfMonth.toISOString());

        if (error) {
          console.error('Supabase query error:', error);
          return;
        }

        if (!data) {
          console.log('No records found');
          return;
        }

        const count = data.length;
        console.log('Found records:', count);
        setMonthlyCount(count);

        // Set error message if limit reached
        if (count >= 3) {
          setError('You have reached the maximum limit of 3 portfolio generations this month.');
        }

        // If there's a latest record, set the form data
        if (data.length > 0) {
          const latestRecord = data[0];
          setFormData({
            name: latestRecord.name,
            age: latestRecord.age.toString(),
            current_savings: latestRecord.current_savings.toString(),
            monthly_savings: latestRecord.monthly_savings.toString(),
            investment_horizon_years: latestRecord.investment_horizon.toString(),
            financial_goal: latestRecord.financial_goal,
            has_emergency_fund: latestRecord.has_emergency_fund,
            needs_money_during_horizon: latestRecord.needs_money_during_horizon
          });

          if (latestRecord.allocation) {
            setAllocation(latestRecord.allocation);
            setShowChart(true);
          }
        }

      } catch (error) {
        console.error('Error checking initial count:', error);
        // Don't set error state here as it might not be relevant to the user
      } finally {
        setIsLoading(false);
      }
    };

    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthReady(true);
      if (user) {
        checkInitialCount();
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []); // Empty dependency array since we're using auth.onAuthStateChanged

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

              <div className="space-y-2">
                <Label htmlFor="has_emergency_fund">Do you have emergency funds equivalent to 6 months of your income?</Label>
                <Select 
                  value={formData.has_emergency_fund}
                  onValueChange={(value: 'Y' | 'N') => {
                    console.log('Emergency fund selection:', value);
                    setFormData(prev => ({ ...prev, has_emergency_fund: value }));
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs_money_during_horizon">Do you anticipate needing this money during your investment horizon?</Label>
                <Select 
                  value={formData.needs_money_during_horizon}
                  onValueChange={(value: 'Y' | 'N') => {
                    console.log('Money needs selection:', value);
                    setFormData(prev => ({ ...prev, needs_money_during_horizon: value }));
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
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
                <PieChart data={allocation} />
              </>
            ) : (
              <p>Fill out the form and calculate to see your allocation</p>
            )}
          </div>
        </div>
      </div>

      {/* Warning Dialog - Moved outside of other components */}
      <Dialog 
        open={showWarningDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setDialogActions({});
          }
          setShowWarningDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-600">Last Portfolio Generation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DialogDescription className="text-gray-700">
              You have already generated 2 portfolios this month. This will be your last available generation until next month.
            </DialogDescription>
            <div className="mt-4 font-medium text-gray-700">
              Would you like to proceed?
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowWarningDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => dialogActions.onProceed?.()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Generate Final Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 