'use client'

import { useState, useEffect, FormEvent } from "react"
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
import { User } from 'firebase/auth'
import { supabase } from '@/app/lib/supabaseClient'
import { testSupabaseConnection } from '@/lib/supabase-utils'

interface InvestmentRecord {
  stocks: number
  bonds: number
  cash: number
  real_estate: number
  user_id: string
  has_emergency_fund: 'Y' | 'N'
  needs_money_during_horizon: 'Y' | 'N'
  allocation?: any
  id?: string
  age?: number
  current_savings?: number
  monthly_savings?: number
  investment_horizon?: number
  financial_goal?: string
  created_at?: string
  name?: string
  has_investment_experience: 'Y' | 'N'
  risk_score: number
}

interface FormData {
  name: string
  age: string
  current_savings: string
  monthly_savings: string
  investment_horizon_years: string
  financial_goal: string
  has_emergency_fund: 'Y' | 'N'
  needs_money_during_horizon: 'Y' | 'N'
  has_investment_experience: 'Y' | 'N'
}

interface AllocationResponse {
  chartData: Array<{
    category: string;
    fill: string;
    percentage: number;
  }>;
  full_response: string;
  totalPercentage: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface ChartState {
  allocation: ChartDataItem[];
  risk_score: number;
  full_response: string;
}

async function checkExistingRecord(formData: FormData, userId: string) {
  try {
    // First, log the connection attempt
    console.log('Testing Supabase connection...');
    const isConnected = await testSupabaseConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    // Log query parameters
    const queryParams = {
      user_id: userId,
      age: parseInt(formData.age),
      current_savings: parseFloat(formData.current_savings),
      monthly_savings: parseFloat(formData.monthly_savings),
      investment_horizon: parseInt(formData.investment_horizon_years),
      financial_goal: formData.financial_goal,
      has_emergency_fund: formData.has_emergency_fund,
      needs_money_during_horizon: formData.needs_money_during_horizon,
      has_investment_experience: formData.has_investment_experience
    };

    console.log('Querying Supabase with params:', queryParams);

    // Perform query in steps to identify where it might be failing
    const { data: records, error: queryError } = await supabase
      .from('investment_records')
      .select('*');

    if (queryError) {
      console.error('Initial query error:', queryError);
      return null;
    }

    console.log('All records:', records);

    // Manual filtering to see what records exist
    const matchingRecord = records?.find(record => {
      const matches = 
        record.user_id === queryParams.user_id &&
        record.age === queryParams.age &&
        record.current_savings === queryParams.current_savings &&
        record.monthly_savings === queryParams.monthly_savings &&
        record.investment_horizon === queryParams.investment_horizon &&
        record.financial_goal === queryParams.financial_goal &&
        record.has_emergency_fund === queryParams.has_emergency_fund &&
        record.needs_money_during_horizon === queryParams.needs_money_during_horizon &&
        record.has_investment_experience === queryParams.has_investment_experience;

      console.log('Comparing with record:', {
        recordId: record.id,
        matches,
        recordValues: {
          user_id: `${typeof record.user_id}: ${record.user_id}`,
          age: `${typeof record.age}: ${record.age}`,
          current_savings: `${typeof record.current_savings}: ${record.current_savings}`,
          monthly_savings: `${typeof record.monthly_savings}: ${record.monthly_savings}`,
          investment_horizon: `${typeof record.investment_horizon}: ${record.investment_horizon}`,
          financial_goal: `${typeof record.financial_goal}: ${record.financial_goal}`,
          has_emergency_fund: `${typeof record.has_emergency_fund}: ${record.has_emergency_fund}`,
          needs_money_during_horizon: `${typeof record.needs_money_during_horizon}: ${record.needs_money_during_horizon}`,
          has_investment_experience: `${typeof record.has_investment_experience}: ${record.has_investment_experience}`
        },
        queryParams: {
          user_id: `${typeof queryParams.user_id}: ${queryParams.user_id}`,
          age: `${typeof queryParams.age}: ${queryParams.age}`,
          current_savings: `${typeof queryParams.current_savings}: ${queryParams.current_savings}`,
          monthly_savings: `${typeof queryParams.monthly_savings}: ${queryParams.monthly_savings}`,
          investment_horizon: `${typeof queryParams.investment_horizon}: ${queryParams.investment_horizon}`,
          financial_goal: `${typeof queryParams.financial_goal}: ${queryParams.financial_goal}`,
          has_emergency_fund: `${typeof queryParams.has_emergency_fund}: ${queryParams.has_emergency_fund}`,
          needs_money_during_horizon: `${typeof queryParams.needs_money_during_horizon}: ${queryParams.needs_money_during_horizon}`,
          has_investment_experience: `${typeof queryParams.has_investment_experience}: ${queryParams.has_investment_experience}`
        }
      });

      return matches;
    });

    console.log('Matching record found:', matchingRecord);
    return matchingRecord || null;

  } catch (err) {
    console.error('Database error:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    return null;
  }
}

// Modify the transformAllocationData function
function transformAllocationData(rawData: any) {
  console.log('transformAllocationData input:', rawData);
  
  // If rawData is a string, try to parse it
  let dataToProcess = rawData;
  if (typeof rawData === 'string') {
    try {
      dataToProcess = JSON.parse(rawData);
    } catch (e) {
      console.error('Failed to parse rawData string:', e);
    }
  }

  // If we have an object with allocation property, use that
  if (dataToProcess?.allocation) {
    dataToProcess = dataToProcess.allocation;
  }

  if (!Array.isArray(dataToProcess)) {
    console.error('Invalid allocation data format:', dataToProcess);
    return [];
  }

  const colorMap: { [key: string]: string } = {
    'Equity': '#2563eb',
    'Mutual Funds': '#7c3aed',
    'Bonds': '#059669',
    'Real Estate': '#dc2626',
    'Gold': '#eab308',
    'Cash': '#64748b'
  };

  const transformed = dataToProcess.map(item => ({
    name: item.name || item.category,
    value: Number(item.value || item.percentage),
    color: item.color || colorMap[item.name?.split(' ')[0]] || colorMap[item.category?.split(' ')[0]] || '#94a3b8'
  }));

  console.log('Transformed allocation data:', transformed);
  return transformed;
}

// Update the extractRiskScore function with more logging
function extractRiskScore(data: any): number {
  console.log('Raw data received in extractRiskScore:', data);
  
  try {
    // If no data provided
    if (!data) {
      console.log('No data provided to extractRiskScore');
      return 0;
    }

    // If data is an object
    if (typeof data === 'object' && data !== null) {
      console.log('Data is an object with properties:', Object.keys(data));
      
      // Check for direct risk_score
      if ('risk_score' in data) {
        console.log('Found risk_score:', data.risk_score);
        return data.risk_score;
      }

      // Check full_response
      if (data.full_response) {
        console.log('Found full_response:', data.full_response);
        try {
          const responses = data.full_response.split('\n\n');
          console.log('Split responses:', responses);
          
          const riskResponse = responses.find(resp => resp.includes('"Risk"'));
          console.log('Risk response found:', riskResponse);
          
          if (riskResponse) {
            const riskJson = JSON.parse(riskResponse);
            console.log('Parsed risk JSON:', riskJson);
            return riskJson.Risk;
          }
        } catch (e) {
          console.error('Error parsing full_response:', e);
        }
      }
    }

    // If data is a string
    if (typeof data === 'string') {
      console.log('Data is a string:', data);
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed string data:', parsed);
        if (parsed.risk_score) {
          return parsed.risk_score;
        }
      } catch (e) {
        console.error('Error parsing string data:', e);
      }
    }

    console.log('No risk score found in data');
    return 0;
  } catch (error) {
    console.error('Error in extractRiskScore:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return 0;
  }
}

export default function InvestmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [showChart, setShowChart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [savedRecord, setSavedRecord] = useState<InvestmentRecord | null>(null)
  const [allocation, setAllocation] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [riskScore, setRiskScore] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    current_savings: '',
    monthly_savings: '',
    investment_horizon_years: '',
    financial_goal: '',
    has_emergency_fund: 'N',
    needs_money_during_horizon: 'N',
    has_investment_experience: 'N'
  })
  const [userName, setUserName] = useState('')
  const [chartKey, setChartKey] = useState(0)
  const [isDataReady, setIsDataReady] = useState(false)
  const [isFromCache, setIsFromCache] = useState(false)
  const [chartData, setChartData] = useState<ChartState>({
    allocation: [],
    risk_score: 0,
    full_response: ''
  });

  // Fix the useEffect dependency warning
  useEffect(() => {
    const handlePageClick = () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        sessionStorage.setItem('formData', JSON.stringify(formData))
        sessionStorage.setItem('returnUrl', window.location.pathname)
        router.push('/login')
      }
    }

    const pageContainer = document.getElementById('investment-page-container')
    pageContainer?.addEventListener('click', handlePageClick)

    return () => {
      pageContainer?.removeEventListener('click', handlePageClick)
    }
  }, [formData, router])

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
        const user = auth.currentUser;
        if (!user) return;

        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data?.allocation) {
          console.log('Raw allocation data:', data.allocation);
          updateAllocation(data.allocation, data.risk_score);
        }
      } catch (error) {
        console.error('Error fetching saved investment:', error);
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
  }, []); // Empty dependency array since we only want to check connection once

  // Modify handleCalculate to include more logging
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        console.log('No user logged in, redirecting to login page');
        sessionStorage.setItem('formData', JSON.stringify(formData));
        sessionStorage.setItem('returnUrl', window.location.pathname);
        router.push('/login');
        return;
      }

      try {
        const existingRecord = await checkExistingRecord(formData, auth.currentUser.uid);
        console.log('Existing record check result:', existingRecord);

        if (existingRecord?.allocation) {
          console.log('Found existing allocation:', existingRecord.allocation);
          updateAllocation(existingRecord.allocation, existingRecord.risk_score);
        } else {
          console.log('No existing record found, generating new portfolio');
          await generatePortfolio();
        }
      } catch (innerError) {
        console.error('Error during portfolio calculation:', {
          error: innerError,
          message: innerError instanceof Error ? innerError.message : 'Unknown error',
          stack: innerError instanceof Error ? innerError.stack : undefined
        });
        throw new Error(innerError instanceof Error ? innerError.message : 'Failed to process investment data');
      }

    } catch (error) {
      console.error('HandleCalculate error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      let errorMessage = 'Failed to calculate allocation';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      setError(errorMessage);
      setShowChart(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the generatePortfolio function
  const generatePortfolio = async () => {
    try {
      // Create API request data from formData
      const apiRequestData = {
        userId: auth.currentUser?.uid,
        name: auth.currentUser?.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon_years: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        has_emergency_fund: formData.has_emergency_fund,
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience
      };

      console.log('Sending data to API:', apiRequestData);

      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', errorText);
        throw new Error(`Failed to fetch allocation data: ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw API Response:', data);

      // Validate the response structure
      if (!data || !data.allocation || !Array.isArray(data.allocation)) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response structure from API');
      }

      // Transform the allocation data
      const transformedAllocation = data.allocation.map((item: any) => ({
        name: item.name || item.category,
        value: parseFloat(item.value || item.percentage) || 0,
        color: item.color || item.fill || getColorForCategory(item.name || item.category)
      }));

      console.log('Transformed allocation:', transformedAllocation);

      // Update the UI with the new allocation
      updateAllocation(transformedAllocation, data.risk_score);

      // Prepare data for Supabase
      const finalSaveData = {
        user_id: auth.currentUser?.uid,
        name: auth.currentUser?.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        has_emergency_fund: formData.has_emergency_fund,
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience,
        allocation: transformedAllocation, // Use transformed allocation
        risk_score: data.risk_score || 0
      };

      console.log('Attempting to save to Supabase:', finalSaveData);

      const { data: insertedData, error: supabaseError } = await supabase
        .from('investment_records')
        .insert([finalSaveData])
        .select();

      if (supabaseError) {
        console.error('Supabase insert error:', supabaseError);
        throw new Error(`Failed to save data: ${supabaseError.message}`);
      }

      console.log('Successfully saved to Supabase:', insertedData);

    } catch (error) {
      console.error('Error in generatePortfolio:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error
      });
      throw error;
    }
  };

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
        
        // Query to get the latest record
        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', auth.currentUser.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Supabase query error:', error);
          return;
        }

        // If there's a latest record, set the form data
        if (data) {
          setFormData({
            name: data.name,
            age: data.age.toString(),
            current_savings: data.current_savings.toString(),
            monthly_savings: data.monthly_savings.toString(),
            investment_horizon_years: data.investment_horizon.toString(),
            financial_goal: data.financial_goal,
            has_emergency_fund: data.has_emergency_fund,
            needs_money_during_horizon: data.needs_money_during_horizon,
            has_investment_experience: data.has_investment_experience
          });

          if (data.allocation) {
            setAllocation(data.allocation);
            setShowChart(true);
          }
        }

      } catch (error) {
        console.error('Error checking initial count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthReady(true)
      if (user) {
        checkInitialCount()
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, []) // Empty dependency array since we're using auth.onAuthStateChanged

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please log in to continue')
      router.push('/login')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // First get all records for this user
      const { data: userRecords, error: fetchError } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', user.uid)

      console.log('All user records:', userRecords)

      if (fetchError) {
        console.error('Error fetching records:', fetchError)
        throw fetchError
      }

      const formElement = e.currentTarget
      const formData = new FormData(formElement)

      // Current form values
      const currentValues = {
        age: parseInt(formData.get('age') as string),
        current_savings: parseFloat(formData.get('current_savings') as string),
        monthly_savings: parseFloat(formData.get('monthly_savings') as string),
        investment_horizon: parseInt(formData.get('investment_horizon_years') as string),
        financial_goal: formData.get('financial_goal') as string,
        has_emergency_fund: formData.get('has_emergency_fund') as string,
        needs_money_during_horizon: formData.get('needs_money_during_horizon') as string,
        has_investment_experience: formData.get('has_investment_experience') as string
      }

      console.log('Current form values:', currentValues)

      // Look for matching record
      const matchingRecord = userRecords?.find(record => {
        const matches = 
          record.age === currentValues.age &&
          record.current_savings === currentValues.current_savings &&
          record.monthly_savings === currentValues.monthly_savings &&
          record.investment_horizon === currentValues.investment_horizon &&
          record.financial_goal === currentValues.financial_goal &&
          record.has_emergency_fund === currentValues.has_emergency_fund &&
          record.needs_money_during_horizon === currentValues.needs_money_during_horizon &&
          record.has_investment_experience === currentValues.has_investment_experience

        console.log('Comparing with record:', {
          recordId: record.id,
          matches,
          recordValues: {
            age: `${typeof record.age}: ${record.age}`,
            current_savings: `${typeof record.current_savings}: ${record.current_savings}`,
            monthly_savings: `${typeof record.monthly_savings}: ${record.monthly_savings}`,
            investment_horizon: `${typeof record.investment_horizon}: ${record.investment_horizon}`,
            financial_goal: `${typeof record.financial_goal}: ${record.financial_goal}`,
            has_emergency_fund: `${typeof record.has_emergency_fund}: ${record.has_emergency_fund}`,
            needs_money_during_horizon: `${typeof record.needs_money_during_horizon}: ${record.needs_money_during_horizon}`,
            has_investment_experience: `${typeof record.has_investment_experience}: ${record.has_investment_experience}`
          },
          currentValues: {
            age: `${typeof currentValues.age}: ${currentValues.age}`,
            current_savings: `${typeof currentValues.current_savings}: ${currentValues.current_savings}`,
            monthly_savings: `${typeof currentValues.monthly_savings}: ${currentValues.monthly_savings}`,
            investment_horizon: `${typeof currentValues.investment_horizon}: ${currentValues.investment_horizon}`,
            financial_goal: `${typeof currentValues.financial_goal}: ${currentValues.financial_goal}`,
            has_emergency_fund: `${typeof currentValues.has_emergency_fund}: ${currentValues.has_emergency_fund}`,
            needs_money_during_horizon: `${typeof currentValues.needs_money_during_horizon}: ${currentValues.needs_money_during_horizon}`,
            has_investment_experience: `${typeof currentValues.has_investment_experience}: ${currentValues.has_investment_experience}`
          }
        })

        return matches
      })

      console.log('Matching record found:', matchingRecord)

      if (matchingRecord?.allocation) {
        console.log('Using existing allocation:', matchingRecord.allocation)
        setChartData(matchingRecord.allocation)
        setIsFromCache(true)
        setIsLoading(false)
        
        const resultsSection = document.getElementById('results-section')
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }

      // If no matching record found or no allocation, call API
      console.log('No matching record with allocation found, calling API')
      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          name: user.displayName || 'Anonymous',
          ...currentValues
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error Response:', errorData)
        throw new Error(errorData)
      }

      const data = await response.json()
      console.log('OpenAI API response:', data)

      // Store the new allocation in Supabase
      const { error: insertError } = await supabase
        .from('investment_records')
        .insert([{
          ...currentValues,
          name: user.displayName || 'Anonymous',
          allocation: data.chartData,
          risk_score: data.risk_score,
          full_response: data.full_response,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Error storing allocation:', insertError)
      }

      setChartData(data.chartData)
      setIsFromCache(false)
      setIsLoading(false)

      const resultsSection = document.getElementById('results-section')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' })
      }

    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const updateAllocation = (newAllocation: any[], newRiskScore?: number) => {
    setIsDataReady(false);
    const transformedData = transformAllocationData(newAllocation);
    console.log('Setting transformed allocation:', transformedData);
    setAllocation(transformedData);
    if (newRiskScore !== undefined) {
      setRiskScore(newRiskScore);
    }
    setShowChart(true);
  };

  // Add this useEffect to handle allocation updates
  useEffect(() => {
    if (allocation.length > 0) {
      console.log('Allocation updated, setting data ready...');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setIsDataReady(true);
        setChartKey(prev => prev + 1);
      }, 100);
    }
  }, [allocation]);

  // Add this effect to handle initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data?.allocation) {
          console.log('Loading initial allocation data');
          updateAllocation(data.allocation, data.risk_score);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []); // Run once on mount

  console.log('Chart data being passed:', chartData);

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

              <div className="space-y-2">
                <Label htmlFor="has_investment_experience">Do you have experience investing in equity market?</Label>
                <Select 
                  value={formData.has_investment_experience}
                  onValueChange={(value: 'Y' | 'N') => {
                    console.log('Investment experience selection:', value);
                    setFormData(prev => ({ ...prev, has_investment_experience: value }));
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
              <div>
                <div key={chartKey} className="cursor-pointer" onClick={() => router.push('/investment-details')}>
                  <PieChart data={allocation} />
                </div>
                
                {/* Add the new information section */}
                <div className="mt-6 space-y-4 text-sm">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Portfolio Risk Score</h3>
                    <p className="text-blue-700">
                      Your portfolio risk score is: {riskScore} out of 10
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Things to consider</h3>
                    <p className="text-yellow-700">
                      Balancing your portfolio is extremely critical. Consider regenerating your portfolio:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-yellow-700">
                      <li>Every 3 months</li>
                      <li>After significant life events such as marriage, salary change, or the birth of a child</li>
                    </ul>
                    <p className="text-yellow-700">
                    Click on the pie chart above to see detailed investment recommendations for each category.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Fill out the form and calculate to see your allocation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 