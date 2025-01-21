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
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

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
  allocation: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  risk_score: number;
  risk_value: number;
  expected_return: number;
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
          
          const riskResponse = responses.find((resp:any) => resp.includes('"Risk"'));
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
    risk_value: 0,
    expected_return: 0
  });

  // Update useEffect for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Update form data with user's name when they log in
        setFormData(prevData => ({
          ...prevData,
          name: currentUser.displayName || ''
        }));
        setUserName(currentUser.displayName || ''); // Also update userName state
      }
    });

    return () => unsubscribe();
  }, []);

  // Modify the click handler to show Google sign-in explicitly
  useEffect(() => {
    const handlePageClick = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        sessionStorage.setItem('formData', JSON.stringify(formData));
        sessionStorage.setItem('returnUrl', window.location.pathname);
        // Force account selection by adding specific parameters to the URL
        router.push('/login?prompt=select_account');
      }
    };

    const pageContainer = document.getElementById('investment-page-container');
    pageContainer?.addEventListener('click', handlePageClick);

    return () => {
      pageContainer?.removeEventListener('click', handlePageClick);
    };
  }, [formData]);

  // Modify handleCalculate to save to database
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

      const requestPayload = {
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon_years: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        has_emergency_fund: formData.has_emergency_fund,
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience
      };

      console.log('Sending request with payload:', requestPayload);

      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API call failed: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      const transformedData: ChartState = {
        allocation: responseData.allocation.map((item: any) => ({
          name: item.name,
          value: item.value,
          color: item.color
        })),
        risk_score: responseData.risk_score,
        risk_value: responseData.risk_score,
        expected_return: responseData.expected_return
      };

      // Save to database
      if (auth.currentUser) {
        const { error: saveError } = await supabase
          .from('investment_records')
          .insert([{
            user_id: auth.currentUser.uid,
            name: auth.currentUser.displayName || 'Anonymous',
            age: parseInt(formData.age),
            current_savings: parseFloat(formData.current_savings),
            monthly_savings: parseFloat(formData.monthly_savings),
            investment_horizon: parseInt(formData.investment_horizon_years),
            financial_goal: formData.financial_goal,
            has_emergency_fund: formData.has_emergency_fund,
            needs_money_during_horizon: formData.needs_money_during_horizon,
            has_investment_experience: formData.has_investment_experience,
            allocation: transformedData.allocation,
            risk_score: transformedData.risk_score,
            risk_value: transformedData.risk_value,
            expected_return: transformedData.expected_return,
            created_at: new Date().toISOString()
          }]);

        if (saveError) {
          console.error('Error saving to database:', saveError);
        }
      }

      setChartData(transformedData);
      setShowChart(true);

    } catch (error) {
      console.error('HandleCalculate error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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

      const responseData = await response.json();
      console.log('Raw API response:', responseData);

      // Parse the full_response string to get risk and expected return
      const fullResponseString = responseData.full_response
        .replace(/```json\n|\n```/g, '') // Remove markdown formatting
        .split('\n')
        .filter(Boolean); // Remove empty lines

      console.log('Split response:', fullResponseString);

      // The second line contains the risk and expected return
      const metricsData = JSON.parse(fullResponseString[1]);
      console.log('Metrics data:', metricsData);

      // Extract risk and expected return values
      const riskValue = Number(metricsData.risk || 0);
      const expectedReturn = Number(metricsData.expected_return?.replace('%', '') || 0);

      console.log('Extracted metrics:', { riskValue, expectedReturn });

      // Transform the chart data
      const transformedData: ChartState = {
        allocation: responseData.allocation.map((item: any) => ({
          name: item.name,
          value: item.value,
          color: item.color
        })),
        risk_score: riskValue,
        risk_value: riskValue,
        expected_return: expectedReturn
      };

      console.log('Final transformed data:', transformedData);
      setChartData(transformedData);
      setShowChart(true);

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

  // Update the useEffect that loads saved data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const { data: latestRecord } = await supabase
            .from('investment_records')
            .select('*')
            .eq('user_id', user.uid)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (latestRecord) {
            // Update form data
            setFormData({
              name: latestRecord.name || '',
              age: latestRecord.age?.toString() || '',
              current_savings: latestRecord.current_savings?.toString() || '',
              monthly_savings: latestRecord.monthly_savings?.toString() || '',
              investment_horizon_years: latestRecord.investment_horizon?.toString() || '',
              financial_goal: latestRecord.financial_goal || '',
              has_emergency_fund: latestRecord.has_emergency_fund || 'N',
              needs_money_during_horizon: latestRecord.needs_money_during_horizon || 'N',
              has_investment_experience: latestRecord.has_investment_experience || 'N'
            });

            // Update chart data with all metrics
            if (latestRecord.allocation) {
              const transformedData: ChartState = {
                allocation: latestRecord.allocation,
                risk_score: latestRecord.risk_score || 0,
                risk_value: latestRecord.risk_score || 0,
                expected_return: latestRecord.expected_return || 0
              };
              setChartData(transformedData);
              setShowChart(true);
            }
          }
        } catch (error) {
          console.error('Error loading latest record:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
          allocation: data.allocation,
          risk_score: data.risk_score,
          risk_value: data.risk_value,
          expected_return: data.expected_return,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Error storing allocation:', insertError)
      }

      setChartData(data)
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
                
              

                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Risk Level Card */}
                    <div className="p-6 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="font-semibold text-blue-800 text-lg mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Risk Level
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-blue-700 text-3xl font-bold">
                          {chartData.risk_value || 0}
                        </p>
                        <p className="text-blue-600 ml-2 text-lg">
                          out of 10
                        </p>
                      </div>
                      <p className="text-blue-600 text-sm mt-2">
                        Based on your investment preferences and financial goals
                      </p>
                    </div>

                    {/* Expected Return Card */}
                    <div className="p-6 bg-green-50 rounded-lg shadow-sm border border-green-100">
                      <h3 className="font-semibold text-green-800 text-lg mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Expected Annual Return
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-green-700 text-3xl font-bold">
                          {chartData.expected_return || 0}
                        </p>
                        <p className="text-green-600 ml-1 text-2xl">
                          %
                        </p>
                      </div>
                      <p className="text-green-600 text-sm mt-2">
                        Historical average based on similar portfolio compositions
                      </p>
                    </div>
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