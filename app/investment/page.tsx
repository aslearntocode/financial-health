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
  approximate_debt: number
}

interface FormData {
  name: string
  age: string
  current_savings: string
  monthly_savings: string
  investment_horizon_years: string
  financial_goal: string
  approximate_debt: string
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
  expected_return: number;
}

async function checkExistingRecord(formData: FormData, userId: string) {
  console.log('checkExistingRecord function called');
  console.log('Input parameters:', { formData, userId });

  try {
    // Convert form values to the correct types for comparison
    const searchParams = {
      userId,
      age: parseInt(formData.age),
      current_savings: parseFloat(formData.current_savings),
      monthly_savings: parseFloat(formData.monthly_savings),
      investment_horizon: parseInt(formData.investment_horizon_years),
      financial_goal: formData.financial_goal,
      approximate_debt: parseFloat(formData.approximate_debt),
      needs_money_during_horizon: formData.needs_money_during_horizon,
      has_investment_experience: formData.has_investment_experience
    };

    console.log('Converted search parameters:', searchParams);

    // Get all records for this user
    console.log('Fetching records from Supabase...');
    const { data: records, error: fetchError } = await supabase
      .from('investment_records')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return null;
    }

    console.log(`Found ${records?.length || 0} records for user`);

    // Look for exact match
    const matchingRecord = records?.find(record => {
      const matches = 
        record.age === searchParams.age &&
        record.current_savings === searchParams.current_savings &&
        record.monthly_savings === searchParams.monthly_savings &&
        record.investment_horizon === searchParams.investment_horizon &&
        record.financial_goal === searchParams.financial_goal &&
        record.approximate_debt === searchParams.approximate_debt &&
        record.needs_money_during_horizon === searchParams.needs_money_during_horizon &&
        record.has_investment_experience === searchParams.has_investment_experience;

      console.log('Record comparison:', {
        recordId: record.id,
        matches,
        recordValues: {
          age: record.age,
          current_savings: record.current_savings,
          monthly_savings: record.monthly_savings,
          investment_horizon: record.investment_horizon,
          financial_goal: record.financial_goal,
          approximate_debt: record.approximate_debt,
          needs_money_during_horizon: record.needs_money_during_horizon,
          has_investment_experience: record.has_investment_experience
        },
        searchValues: searchParams
      });

      return matches;
    });

    console.log('Final result:', matchingRecord ? 'Match found' : 'No match found');
    return matchingRecord || null;

  } catch (err) {
    console.error('Error in checkExistingRecord:', err);
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
    approximate_debt: '',
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

      // Check for existing record first
      const existingRecord = await checkExistingRecord(formData, auth.currentUser.uid);
      
      if (existingRecord) {
        console.log('Found existing record, using cached data:', existingRecord);
        
        // Transform the existing allocation data to match the expected format
        const transformedAllocation = Array.isArray(existingRecord.allocation) 
          ? existingRecord.allocation 
          : JSON.parse(existingRecord.allocation);

        // Set chart data with all existing values
        setChartData({
          allocation: transformedAllocation,
          risk_score: existingRecord.risk_score || 0,
          expected_return: existingRecord.expected_return || 0
        });
        
        setShowChart(true);
        setIsLoading(false);
        
        // Scroll to results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Only proceed with API call if no existing record was found
      console.log('No existing record found, calling API...');
      const requestPayload = {
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon_years: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        approximate_debt: parseFloat(formData.approximate_debt),
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience
      };

      console.log('API request payload:', requestPayload);

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

      // Explicitly define only the fields we want to save
      const dbRecord = {
        user_id: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        approximate_debt: parseFloat(formData.approximate_debt),
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience,
        // Make sure allocation is stringified if it's an object
        allocation: Array.isArray(responseData.allocation) ? responseData.allocation : JSON.stringify(responseData.allocation),
        risk_score: Number(responseData.risk_score),
        expected_return: Number(responseData.expected_return),
        created_at: new Date().toISOString()
      };

      console.log('Attempting to save record to Supabase:', dbRecord);

      // Try inserting without the select
      const { error: saveError } = await supabase
        .from('investment_records')
        .insert(dbRecord);

      if (saveError) {
        console.error('Detailed Supabase error:', {
          code: saveError.code,
          message: saveError.message,
          details: saveError.details,
          hint: saveError.hint
        });
        throw saveError;
      }

      console.log('Successfully saved to Supabase:', responseData);

      setChartData({
        allocation: responseData.allocation,
        risk_score: responseData.risk_score,
        expected_return: responseData.expected_return
      });
      setShowChart(true);

    } catch (error) {
      console.error('HandleCalculate error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
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
        approximate_debt: parseFloat(formData.approximate_debt),
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
            // Update form data - ensure approximate_debt is converted to string
            setFormData({
              name: latestRecord.name || '',
              age: latestRecord.age?.toString() || '',
              current_savings: latestRecord.current_savings?.toString() || '',
              monthly_savings: latestRecord.monthly_savings?.toString() || '',
              investment_horizon_years: latestRecord.investment_horizon?.toString() || '',
              financial_goal: latestRecord.financial_goal || '',
              approximate_debt: latestRecord.approximate_debt?.toString() || '', // Convert to string
              needs_money_during_horizon: latestRecord.needs_money_during_horizon || 'N',
              has_investment_experience: latestRecord.has_investment_experience || 'N'
            });

            // Update chart data with all metrics
            if (latestRecord.allocation) {
              const transformedData: ChartState = {
                allocation: latestRecord.allocation,
                risk_score: latestRecord.risk_score || 0,
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

  const callApiAndSaveData = async () => {
    if (!user) {
      console.log('No user found in callApiAndSaveData');
      return;
    }

    try {
      console.log('Starting API call process...');
      const requestPayload = {
        userId: user.uid,
        name: user.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon_years: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        approximate_debt: parseFloat(formData.approximate_debt),
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience
      };

      console.log('Making API call with payload:', requestPayload);

      const response = await fetch('/api/calculate-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API call failed:', errorText);
        throw new Error(`API call failed: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      // Save to Supabase
      const dbRecord = {
        user_id: user.uid,
        name: user.displayName || 'Anonymous',
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        approximate_debt: parseFloat(formData.approximate_debt),
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience,
        allocation: responseData.allocation,
        risk_score: responseData.risk_score,
        expected_return: responseData.expected_return,
        created_at: new Date().toISOString()
      };

      console.log('Saving new record to Supabase:', dbRecord);

      const { error: saveError } = await supabase
        .from('investment_records')
        .insert(dbRecord);

      if (saveError) {
        console.error('Error saving to Supabase:', saveError);
        throw saveError;
      }

      console.log('Successfully saved to Supabase');

      // Update UI with new data
      setChartData({
        allocation: responseData.allocation,
        risk_score: responseData.risk_score,
        expected_return: responseData.expected_return
      });
      setShowChart(true);

    } catch (error) {
      console.error('Error in callApiAndSaveData:', error);
      throw error;
    }
  };

  // Update handleSubmit to properly call the API function
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!user) {
      console.log('No user found - redirecting to login');
      setError('Please log in to continue');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // FIRST: Check for existing record
      console.log('Starting existing record check...');
      const existingRecord = await checkExistingRecord(formData, user.uid);
      console.log('Existing record check result:', existingRecord);
      
      if (existingRecord) {
        console.log('Found existing record:', existingRecord);
        // Use cached data
        const transformedAllocation = Array.isArray(existingRecord.allocation) 
          ? existingRecord.allocation 
          : JSON.parse(existingRecord.allocation);

        setChartData({
          allocation: transformedAllocation,
          risk_score: existingRecord.risk_score || 0,
          expected_return: existingRecord.expected_return || 0
        });
        setShowChart(true);
      } else {
        // IMPORTANT: Call API and save data if no existing record
        console.log('No existing record found - calling API...');
        await callApiAndSaveData();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setShowChart(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Update this useEffect for better error handling and auth state management
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Wait for auth to be ready
        const user = auth.currentUser;
        if (!user) {
          console.log('No user logged in, skipping initial data load');
          return;
        }

        console.log('Loading data for user:', user.uid);
        const { data, error } = await supabase
          .from('investment_records')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found - this is okay for new users
            console.log('No existing investment records found for user');
            return;
          }
          // Log other errors
          console.error('Supabase error:', error);
          throw error;
        }

        if (data?.allocation) {
          console.log('Found existing allocation data:', data);
          updateAllocation(data.allocation, data.risk_score);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error loading initial data:', error.message);
        } else {
          console.error('Unknown error loading initial data:', error);
        }
      }
    };

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Auth state changed - user logged in:', user.uid);
        loadInitialData();
      } else {
        console.log('Auth state changed - no user');
        setAllocation([]);
        setShowChart(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []); // Empty dependency array since we want this to run once on mount

  console.log('Chart data being passed:', chartData);

  const handleMutualFundClick = async () => {
    try {
      setIsLoading(true);
      
      if (!auth.currentUser) {
        throw new Error('Please log in to get recommendations');
      }

      // Create current form data object for comparison
      const currentFormData = {
        age: parseInt(formData.age),
        current_savings: parseFloat(formData.current_savings),
        monthly_savings: parseFloat(formData.monthly_savings),
        investment_horizon: parseInt(formData.investment_horizon_years),
        financial_goal: formData.financial_goal,
        approximate_debt: parseFloat(formData.approximate_debt),
        needs_money_during_horizon: formData.needs_money_during_horizon,
        has_investment_experience: formData.has_investment_experience
      };

      // First check if recommendations exist in Supabase
      const { data: existingRec, error: fetchError } = await supabase
        .from('mutual_fund_recommendations')
        .select('*')
        .eq('user_id', auth.currentUser.uid)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching existing recommendations:', fetchError);
        throw new Error('Failed to check existing recommendations');
      }

      // Check if form data has changed from last saved data
      const shouldMakeNewRequest = !existingRec?.length || existingRec.some(rec => {
        return (
          rec.age !== currentFormData.age ||
          rec.current_savings !== currentFormData.current_savings ||
          rec.monthly_savings !== currentFormData.monthly_savings ||
          rec.investment_horizon !== currentFormData.investment_horizon ||
          rec.financial_goal !== currentFormData.financial_goal ||
          rec.approximate_debt !== currentFormData.approximate_debt ||
          rec.needs_money_during_horizon !== currentFormData.needs_money_during_horizon ||
          rec.has_investment_experience !== currentFormData.has_investment_experience
        );
      });

      // If data hasn't changed, use existing recommendations
      if (existingRec?.length && !shouldMakeNewRequest) {
        console.log('Using existing recommendations as form data unchanged:', existingRec[0]);
        router.push(`/recommendations/mutual-funds?id=${existingRec[0].id}`);
        return;
      }

      // If data has changed or no existing recommendations, make new API call
      console.log('Making new API call due to changed data or no existing recommendations');
      const requestData = {
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anonymous',
        ...currentFormData
      };

      const response = await fetch('/api/mutual-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch recommendations: ${errorText}`);
      }

      const result = await response.json();

      // Save new recommendations to Supabase
      const { data: savedRec, error: saveError } = await supabase
        .from('mutual_fund_recommendations')
        .insert({
          user_id: auth.currentUser.uid,
          user_name: auth.currentUser.displayName || 'Anonymous',
          ...currentFormData,
          recommendations: result.data,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving to Supabase:', saveError);
        throw new Error('Failed to save recommendations');
      }

      // Redirect to recommendations page with the new record ID
      router.push(`/recommendations/mutual-funds?id=${savedRec.id}`);

    } catch (error) {
      console.error('Mutual Fund Recommendation Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockClick = async () => {
    try {
      setIsLoading(true);
      
      if (!auth.currentUser) {
        throw new Error('Please log in to get recommendations');
      }

      // First check if recommendations exist in Supabase
      const { data: existingRecommendations, error: fetchError } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('user_id', auth.currentUser.uid)
        .eq('age', formData.age || 30)
        .eq('current_savings', formData.current_savings || 0)
        .eq('monthly_savings', formData.monthly_savings || 0)
        .eq('investment_horizon', formData.investment_horizon_years || 5)
        .eq('financial_goal', formData.financial_goal || 'Growth')
        .eq('approximate_debt', formData.approximate_debt || 0)
        .eq('needs_money_during_horizon', formData.needs_money_during_horizon || false)
        .eq('has_investment_experience', formData.has_investment_experience || false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error checking existing recommendations:', fetchError);
        throw new Error('Failed to check existing recommendations');
      }

      if (existingRecommendations && existingRecommendations.length > 0) {
        // Use existing recommendations
        console.log('Using existing recommendations');
        return router.push(`/recommendations/stocks?id=${existingRecommendations[0].id}`);
      }

      // If no existing recommendations, get new ones
      console.log('Getting new recommendations');
      const requestData = {
        userId: auth.currentUser.uid,
        name: formData.name || 'Anonymous',
        age: parseInt(formData.age || 30),
        current_savings: parseFloat(formData.current_savings || 0),
        monthly_savings: parseFloat(formData.monthly_savings || 0),
        investment_horizon_years: parseInt(formData.investment_horizon_years || 5),
        financial_goal: formData.financial_goal || 'Growth',
        approximate_debt: parseFloat(formData.approximate_debt || 0),
        needs_money_during_horizon: formData.needs_money_during_horizon || false,
        has_investment_experience: formData.has_investment_experience || false,
      };

      // Get recommendations from API
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch recommendations: ${errorText}`);
      }

      const result = await response.json();

      // Save new recommendations to Supabase
      const { data: savedRec, error: saveError } = await supabase
        .from('stock_recommendations')
        .insert({
          user_id: auth.currentUser.uid,
          user_name: formData.name || 'Anonymous',
          age: parseInt(formData.age || 30),
          current_savings: parseFloat(formData.current_savings || 0),
          monthly_savings: parseFloat(formData.monthly_savings || 0),
          investment_horizon: parseInt(formData.investment_horizon_years || 5),
          financial_goal: formData.financial_goal || 'Growth',
          approximate_debt: parseFloat(formData.approximate_debt || 0),
          needs_money_during_horizon: formData.needs_money_during_horizon || false,
          has_investment_experience: formData.has_investment_experience || false,
          recommendations: result.data,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving recommendations:', saveError);
        throw new Error('Failed to save recommendations');
      }

      // Redirect to recommendations page with the new record ID
      router.push(`/recommendations/stocks?id=${savedRec.id}`);

    } catch (error) {
      console.error('Stock Recommendation Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="investment-page-container" className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Investment Profile</h2>
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
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
                <Label htmlFor="approximate_debt">How much approximate debt do you have?</Label>
                <Input
                  id="approximate_debt"
                  type="number"
                  placeholder="Enter your approximate debt amount"
                  value={formData.approximate_debt}
                  onChange={(e) => setFormData({ ...formData, approximate_debt: e.target.value })}
                  required
                />
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

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Calculating...' : 'Calculate Allocation'}
              </Button>
            </form>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Your Investment Allocation</h2>
            {isLoading ? (
              <p>Calculating your allocation...</p>
            ) : showChart && chartData.allocation && chartData.allocation.length > 0 ? (
              <div>
                <div key={chartKey} className="pointer-events-none">
                  <PieChart data={chartData.allocation} />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Risk Level Card */}
                    <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="font-semibold text-blue-800 text-base mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Risk Level
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-blue-600 text-2xl font-bold">
                          {chartData.risk_score?.toFixed(0)}
                        </p>
                        <p className="text-blue-600 ml-2 text-sm">
                          out of 10
                        </p>
                      </div>
                    </div>

                    {/* Expected Return Card */}
                    <div className="p-4 bg-green-50 rounded-lg shadow-sm border border-green-100">
                      <h3 className="font-semibold text-green-800 text-base mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Expected Annual Return
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-green-700 text-2xl font-bold">
                          {chartData.expected_return?.toFixed(1)}
                        </p>
                        <p className="text-green-600 ml-1 text-base">
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Options Grid */}
                  <div className="mt-8">
                    <div className="text-center mb-4 p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg text-sm">
                      To get specific recommendations, click on the financial instruments below
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      <button 
                        onClick={handleMutualFundClick}
                        className="p-3 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        MUTUAL FUNDS
                      </button>
                      <button 
                        onClick={handleStockClick}
                        className="p-3 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        STOCKS
                      </button>
                      <button 
                        onClick={() => router.push('/recommendations/bonds')}
                        className="p-3 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        BONDS
                      </button>
                      <button 
                        onClick={() => router.push('/recommendations/fixed-deposit')}
                        className="p-3 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        FIXED DEPOSITS
                      </button>
                      <button 
                        onClick={() => router.push('/recommendations/etf')}
                        className="p-3 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        ETF
                      </button>
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