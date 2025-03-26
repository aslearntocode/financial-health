'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import debounce from 'lodash/debounce'
import Header from '@/components/Header'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Investment {
  id: string
  symbol: string
  company_name: string
  quantity: number
  purchase_date: string
  sell_date: string | null
  purchase_price: number
  sell_price: number | null
  holding_period_return: number | null
  annual_return: number | null
  user_id: string
}

interface StockSearchResult {
  symbol: string
  name: string
}

interface ParsedPdfData {
  sections?: {
    accounts?: {
      type: string
      dp_id: string
      value: number
      broker: string
      client_id: string
      isins_count: number
    }[]
    equities?: {
      company_name: string
      face_value: number
      isin: string
      market_price: number
      shares: number
      stock_symbol: string
      value: number
    }[]
    summary?: {
      total_value: string
      mutual_funds: {
        value: string
        folio_count: string
        schemes_count: string
      }
      statement_period: string
    }
    mutualFunds?: {
      isin: string
      type: string
      value: number
      symbol: string | null
      folio_no: string | null
      quantity: number
      total_cost: number | null
      scheme_name: string | null
      market_price: number
      cost_per_unit: number | null
      annualised_return: number | null
      unrealised_profit: number | null
    }[]
    mutual_fund_folios?: {
      scheme_name: string
      folio_no: string
      quantity: number
      market_price: number
      cost_per_unit: number
      total_cost: number
      value: number
      unrealised_profit: number
      annualised_return: number
    }[]
  }
}

export default function PortfolioTracker() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [newInvestment, setNewInvestment] = useState({
    company_name: '',
    symbol: '',
    quantity: '',
    purchase_date: '',
    sell_date: ''
  })
  const [activeTab, setActiveTab] = useState<'manual' | 'pdf'>('manual')
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [parsedPdfData, setParsedPdfData] = useState<ParsedPdfData>({})
  const [selectedCard, setSelectedCard] = useState<'summary' | 'mutual-funds-folios' | 'additional-mutual-funds' | 'equities' | null>(null)
  const [availablePeriods, setAvailablePeriods] = useState<{
    created_at: string;
    period: string | null;
  }[]>([]);

  // Create a Supabase client for the component
  const supabaseClient = createClientComponentClient()

  useEffect(() => {
    // Use Firebase auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
        loadInvestments(user.uid)
        loadParsedPdfData(user.uid)
      } else {
        setUserId(null)
        setInvestments([])
        setParsedPdfData({})
      }
    })

    return () => unsubscribe()
  }, [])

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const getLastMarketOpenDate = (): string => {
    let date = new Date();
    
    // If current time is before 9:30 AM IST (4:00 AM UTC), use previous day
    if (date.getUTCHours() < 4) {
      date.setDate(date.getDate() - 1);
    }
    
    // Keep going back until we find a weekday
    while (isWeekend(date)) {
      date.setDate(date.getDate() - 1);
    }
    
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = auth.currentUser
    if (!user) {
      console.error('No Firebase user found')
      return
    }

    try {
      // Format dates consistently
      const purchaseDate = formatDateString(newInvestment.purchase_date)
      const sellDate = newInvestment.sell_date 
        ? formatDateString(newInvestment.sell_date)
        : getLastMarketOpenDate()

      console.log('Processing investment:', {
        symbol: newInvestment.symbol,
        purchaseDate,
        sellDate,
        userId: user.uid,
        investment: newInvestment
      })

      // Fetch historical prices
      const purchaseResult = await fetchStockPrice(newInvestment.symbol, purchaseDate)
      if (!purchaseResult) {
        throw new Error(`Could not fetch purchase price for ${newInvestment.symbol} on ${purchaseDate}`)
      }

      const sellResult = await fetchStockPrice(newInvestment.symbol, sellDate)
      if (!sellResult) {
        throw new Error(`Could not fetch sell price for ${newInvestment.symbol} on ${sellDate}`)
      }

      const { holdingPeriodReturn, annualReturn } = calculateReturns(
        purchaseResult.price,
        sellResult.price,
        purchaseResult.actualDate,
        sellResult.actualDate
      )

      // Prepare investment data matching the exact database schema
      const investment = {
        user_id: user.uid,
        symbol: newInvestment.symbol.toUpperCase(),
        company_name: newInvestment.company_name,
        quantity: parseInt(newInvestment.quantity),
        purchase_date: purchaseResult.actualDate,
        sell_date: sellResult.actualDate || null,
        purchase_price: purchaseResult.price,
        sell_price: sellResult.price || null,
        holding_period_return: holdingPeriodReturn || null,
        annual_return: annualReturn || null
      }

      console.log('Sending investment data:', investment)

      const { data, error: supabaseError } = await supabase
        .from('portfolio_investments')
        .insert([investment])
        .select()

      if (supabaseError) {
        console.error('Database error:', {
          error: supabaseError,
          data: investment
        })
        throw new Error(`Failed to save investment: ${supabaseError.message}`)
      }

      console.log('Investment saved successfully:', data)

      alert('Investment added successfully!')
      
      setNewInvestment({
        company_name: '',
        symbol: '',
        quantity: '',
        purchase_date: '',
        sell_date: ''
      })
      
      await loadInvestments(user.uid)

    } catch (error) {
      console.error('Error details:', {
        error: error instanceof Error ? {
          message: error.message,
          name: error.name,
          stack: error.stack
        } : error,
        investment: newInvestment
      })
      alert(error instanceof Error ? error.message : 'Error saving investment. Please try again.')
    }
  }

  const loadInvestments = async (userId: string) => {
    try {
      const cleanUserId = userId.replace(/['"]+/g, '')
      
      const { data, error } = await supabase
        .from('portfolio_investments')
        .select('*')
        .eq('user_id', cleanUserId)
        .order('purchase_date', { ascending: false })

      if (error) {
        console.error('Load investments error:', error)
        return
      }

      // Update sell prices for unsold investments
      const updatedInvestments = await Promise.all(data?.map(async (investment) => {
        if (!investment.sell_date) {
          const lastMarketDate = getLastMarketOpenDate()
          const sellResult = await fetchStockPrice(investment.symbol, lastMarketDate)
          
          if (sellResult) {
            const { holdingPeriodReturn, annualReturn } = calculateReturns(
              investment.purchase_price,
              sellResult.price,
              investment.purchase_date,
              sellResult.actualDate
            )

            // Update the investment with new prices and returns
            const { error: updateError } = await supabase
              .from('portfolio_investments')
              .update({
                sell_date: sellResult.actualDate,
                sell_price: sellResult.price,
                holding_period_return: holdingPeriodReturn,
                annual_return: annualReturn
              })
              .eq('id', investment.id)

            if (!updateError) {
              return {
                ...investment,
                sell_date: sellResult.actualDate,
                sell_price: sellResult.price,
                holding_period_return: holdingPeriodReturn,
                annual_return: annualReturn
              }
            }
          }
        }
        return investment
      }) || [])

      setInvestments(updatedInvestments)
    } catch (error) {
      console.error('Error loading investments:', error)
    }
  }

  const searchStocks = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await axios.get(`/api/yahoo-search?q=${encodeURIComponent(query)}`)

      if (response.data.quotes) {
        const results = response.data.quotes
          .filter((quote: any) => quote.quoteType === 'EQUITY')
          .map((quote: any) => ({
            symbol: quote.symbol,
            name: quote.longname || quote.shortname
          }))
        setSearchResults(results)
      }
    } catch (error) {
      console.error('Error searching stocks:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const debouncedSearch = debounce(searchStocks, 300)

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewInvestment(prev => ({ ...prev, company_name: value, symbol: '' }))
    debouncedSearch(value)
  }

  const selectStock = (stock: StockSearchResult) => {
    setNewInvestment(prev => ({
      ...prev,
      company_name: stock.name,
      symbol: stock.symbol
    }))
    setSearchResults([])
  }

  const getLastWorkingDay = (): string => {
    const today = new Date()
    let lastWorkingDay = new Date(today)

    // Keep going back one day until we find a weekday
    do {
      lastWorkingDay.setDate(lastWorkingDay.getDate() - 1)
    } while (lastWorkingDay.getDay() === 0 || lastWorkingDay.getDay() === 6)

    return lastWorkingDay.toISOString().split('T')[0]
  }

  const findNextTradingDay = async (symbol: string, startDate: string): Promise<{ date: string, price: number } | null> => {
    try {
      // Try up to 10 business days forward to find the next trading day
      for (let i = 0; i < 10; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          continue
        }

        const formattedDate = currentDate.toISOString().split('T')[0]
        const price = await fetchStockPriceForDate(symbol, formattedDate)
        
        if (price !== null) {
          return { date: formattedDate, price }
        }
      }
      return null
    } catch (error) {
      console.error('Error finding next trading day:', error)
      return null
    }
  }

  const fetchStockPriceForDate = async (symbol: string, date: string): Promise<number | null> => {
    try {
      const formattedSymbol = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`
      
      // Parse and format the date consistently
      let dateObj: Date
      if (date.includes('/')) {
        const [day, month, year] = date.split('/')
        dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
      } else {
        dateObj = new Date(date)
      }

      // Validate date
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date:', { inputDate: date })
        return null
      }

      // Format date as YYYY-MM-DD
      const formattedDate = dateObj.toISOString().split('T')[0]
      
      // Set to beginning of day in local timezone
      dateObj.setHours(0, 0, 0, 0)
      const nextDay = new Date(dateObj)
      nextDay.setDate(nextDay.getDate() + 1)

      const startTimestamp = Math.floor(dateObj.getTime() / 1000)
      const endTimestamp = Math.floor(nextDay.getTime() / 1000)

      console.log('Fetching price with params:', {
        symbol: formattedSymbol,
        date: formattedDate,
        startTimestamp,
        endTimestamp,
        startDate: new Date(startTimestamp * 1000).toISOString(),
        endDate: new Date(endTimestamp * 1000).toISOString()
      })

      const response = await axios.get('/api/yahoo-price', {
        params: {
          symbol: formattedSymbol,
          period1: startTimestamp,
          period2: endTimestamp
        }
      })

      // Log the response for debugging
      console.log('Yahoo Finance response:', {
        symbol: formattedSymbol,
        date: formattedDate,
        data: response.data
      })

      if (!response.data.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.[0]) {
        // Try to get the previous close if available
        const timestamp = response.data.chart?.result?.[0]?.timestamp?.[0]
        const previousClose = response.data.chart?.result?.[0]?.meta?.previousClose
        
        if (previousClose) {
          console.log('Using previous close price:', {
            symbol: formattedSymbol,
            date: formattedDate,
            previousClose
          })
          return previousClose
        }
        
        console.error('No price data available:', {
          symbol: formattedSymbol,
          date: formattedDate,
          timestamps: response.data.chart?.result?.[0]?.timestamp,
          indicators: response.data.chart?.result?.[0]?.indicators
        })
        return null
      }

      return response.data.chart.result[0].indicators.quote[0].close[0]
    } catch (error) {
      console.error('Error fetching stock price:', {
        symbol,
        date,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  }

  const fetchStockPrice = async (symbol: string, date: string): Promise<{ price: number, actualDate: string } | null> => {
    try {
      // First try the given date
      const price = await fetchStockPriceForDate(symbol, date)
      if (price !== null) {
        return { price, actualDate: date }
      }

      // If no price found, try to find the next trading day
      console.log('No price found for given date, searching for next trading day...')
      const nextTradingDay = await findNextTradingDay(symbol, date)
      if (nextTradingDay) {
        return { price: nextTradingDay.price, actualDate: nextTradingDay.date }
      }

      return null
    } catch (error) {
      console.error('Error in fetchStockPrice:', error)
      return null
    }
  }

  const calculateReturns = (purchasePrice: number, sellPrice: number, purchaseDate: string, sellDate: string) => {
    const holdingPeriodReturn = ((sellPrice - purchasePrice) / purchasePrice) * 100

    const purchaseDateTime = new Date(purchaseDate).getTime()
    const sellDateTime = new Date(sellDate).getTime()
    const years = (sellDateTime - purchaseDateTime) / (365 * 24 * 60 * 60 * 1000)
    
    const annualReturn = ((Math.pow(1 + holdingPeriodReturn / 100, 1 / years) - 1) * 100)

    return {
      holdingPeriodReturn,
      annualReturn
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInvestment({
      ...newInvestment,
      [e.target.name]: e.target.value
    })
  }

  const getYesterday = (): string => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  // Helper function to format date string consistently
  const formatDateString = (dateStr: string): string => {
    try {
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      // If the date is already in YYYY-MM-DD format
      return dateStr
    } catch (error) {
      console.error('Error formatting date:', { dateStr, error })
      return dateStr
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'always'
    }).format(value / 100);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestment) return;

    try {
      const sellDate = formatDateString(editingInvestment.sell_date || getLastMarketOpenDate());
      
      // Fetch new sell price
      const sellResult = await fetchStockPrice(editingInvestment.symbol, sellDate);
      if (!sellResult) {
        throw new Error(`Could not fetch sell price for ${editingInvestment.symbol} on ${sellDate}`);
      }

      // Calculate new returns
      const { holdingPeriodReturn, annualReturn } = calculateReturns(
        editingInvestment.purchase_price,
        sellResult.price,
        editingInvestment.purchase_date,
        sellResult.actualDate
      );

      // Update the investment
      const { error: updateError } = await supabase
        .from('portfolio_investments')
        .update({
          sell_date: sellResult.actualDate,
          sell_price: sellResult.price,
          holding_period_return: holdingPeriodReturn,
          annual_return: annualReturn
        })
        .eq('id', editingInvestment.id);

      if (updateError) throw new Error(`Failed to update investment: ${updateError.message}`);

      // Refresh the investments list
      const user = auth.currentUser;
      if (user) await loadInvestments(user.uid);

      setIsEditing(false);
      setEditingInvestment(null);
      alert('Investment updated successfully!');

    } catch (error) {
      console.error('Error updating investment:', error);
      alert(error instanceof Error ? error.message : 'Error updating investment');
    }
  };

  const handleDelete = async (investmentId: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_investments')
        .delete()
        .eq('id', investmentId);

      if (error) throw new Error(`Failed to delete investment: ${error.message}`);

      const user = auth.currentUser;
      if (user) await loadInvestments(user.uid);
      
      alert('Investment deleted successfully!');
    } catch (error) {
      console.error('Error deleting investment:', error);
      alert(error instanceof Error ? error.message : 'Error deleting investment');
    }
  };

  const calculatePortfolioMetrics = (investments: Investment[]) => {
    const totalInvestment = investments.reduce((sum, inv) => 
      sum + (inv.quantity * inv.purchase_price), 0);
    
    const totalCurrentValue = investments.reduce((sum, inv) => 
      sum + (inv.quantity * (inv.sell_price || inv.purchase_price)), 0);
      
    const holdingPeriodReturn = ((totalCurrentValue - totalInvestment) / totalInvestment) * 100;
    
    // Calculate weighted average annual return
    const weightedAnnualReturn = investments.reduce((sum, inv) => {
      const investmentValue = inv.quantity * inv.purchase_price;
      return sum + ((inv.annual_return ?? 0) * (investmentValue / totalInvestment));
    }, 0);

    return {
      totalValue: totalCurrentValue,
      holdingPeriodReturn,
      annualReturn: weightedAnnualReturn
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setUploadError('')
  }

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !password) {
      setUploadError('Please select a PDF file and enter password')
      return
    }

    try {
      setIsUploading(true)
      setUploadError('')

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('password', password)

      // Log the request details
      console.log('Uploading file:', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        password: password ? 'provided' : 'not provided'
      })

      const response = await fetch('http://172.210.82.112:5000/api/parse-pdf', {
        method: 'POST',
        body: formData,
      })

      // Get the raw response text first
      const responseText = await response.text()
      
      // Log the response details for debugging
      console.log('Response status:', response.status)
      console.log('Response length:', responseText.length)
      console.log('Response text snippet:', responseText.substring(0, 200)) // Log first 200 chars
      
      // If response is not OK, try to parse the error message
      if (!response.ok) {
        let errorMessage = 'Upload failed'
        try {
          // Try to clean and fix common JSON issues in the error response
          const cleanedResponse = responseText
            .replace(/[\n\r]/g, '') // Remove all newlines and carriage returns
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote unquoted property names
            .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
            .replace(/([}\]])\s*([{[])/g, '$1,$2') // Add missing commas between arrays/objects
            .replace(/"\s*([+\-0-9.]+)\s*"/g, '$1') // Convert numeric strings to numbers
            
          console.log('Cleaned error response:', cleanedResponse)
          const errorJson = JSON.parse(cleanedResponse)
          errorMessage = errorJson.message || errorJson.error || responseText
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          
          // If it's a SyntaxError, try to provide context around the error
          if (parseError instanceof Error) {
            const match = parseError.message.match(/position (\d+)/)
            if (match) {
              const position = parseInt(match[1])
              const start = Math.max(0, position - 50)
              const end = Math.min(responseText.length, position + 50)
              console.error('JSON parse error context:', {
                errorPosition: position,
                contextBefore: responseText.substring(start, position),
                errorAt: responseText.substring(position, position + 1),
                contextAfter: responseText.substring(position + 1, end)
              })
            }
            errorMessage = `Upload failed: ${parseError.message}`
          } else {
            errorMessage = 'Upload failed: Unknown parsing error'
          }
        }
        throw new Error(errorMessage)
      }

      // Try to parse the successful response
      let data
      try {
        // Clean and normalize the response text
        const cleanedResponse = responseText
          .replace(/[\n\r]/g, '') // Remove all newlines and carriage returns
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote unquoted property names
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .replace(/([}\]])\s*([{[])/g, '$1,$2') // Add missing commas between arrays/objects
          .replace(/"\s*([+\-0-9.]+)\s*"/g, '$1') // Convert numeric strings to numbers
          .replace(/undefined/g, 'null') // Replace undefined with null
          
        console.log('Cleaned response:', cleanedResponse.substring(0, 200)) // Log first 200 chars
        data = JSON.parse(cleanedResponse)
        
        // Validate the parsed data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format: expected an object')
        }
        
        // Log the parsed data structure
        console.log('Successfully parsed response. Data structure:', {
          hasData: !!data.data,
          dataKeys: data.data ? Object.keys(data.data) : [],
          responseType: typeof data,
          isArray: Array.isArray(data)
        })
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        
        // If it's a SyntaxError, provide detailed context
        let errorMessage = 'Failed to parse server response';
        if (parseError instanceof Error) {
          const match = parseError.message.match(/position (\d+)/)
          if (match) {
            const position = parseInt(match[1])
            const start = Math.max(0, position - 50)
            const end = Math.min(responseText.length, position + 50)
            console.error('Parse error context:', {
              errorPosition: position,
              contextBefore: responseText.substring(start, position),
              errorAt: responseText.substring(position, position + 1),
              contextAfter: responseText.substring(position + 1, end)
            })
          }
          errorMessage = `Failed to parse server response: ${parseError.message}`
        }
        
        throw new Error(errorMessage)
      }

      if (!data) {
        throw new Error('No data received from server')
      }

      // Verify data integrity before saving
      if (!data.data?.mutual_fund_folios || !data.data?.mutual_funds || !data.data?.equities) {
        console.error('Missing expected data sections:', {
          hasMutualFundFolios: !!data.data?.mutual_fund_folios,
          hasMutualFunds: !!data.data?.mutual_funds,
          hasEquities: !!data.data?.equities
        })
      }

      // Save data in chunks if necessary
      try {
        const { error: importError } = await supabase
          .from('pdf_imported_investments')
          .insert([{
            user_id: userId,
            period: data.data?.summary?.statement_period || 'Not Available',
            summary: {
              total_value: data.data?.summary?.total_value,
              mutual_funds: data.data?.summary?.mutual_funds,
              statement_period: data.data?.summary?.statement_period,
              accounts: data.data?.summary?.accounts,
              timestamp: new Date().toISOString(),
              data_integrity: {
                mutual_fund_folios_count: data.data?.mutual_fund_folios?.length || 0,
                mutual_funds_count: data.data?.mutual_funds?.length || 0,
                equities_count: data.data?.equities?.length || 0
              }
            },
            equities: data.data?.equities || [],
            mutual_funds: {
              folios: data.data?.mutual_fund_folios || [],
              schemes: data.data?.mutual_funds || []
            },
            created_at: new Date().toISOString()
          }])

        if (importError) {
          console.error('Supabase error:', importError)
          throw new Error(`Failed to save imported investments: ${importError.message}`)
        }

        console.log('Data saved successfully to pdf_imported_investments with split columns')
      } catch (saveError) {
        console.error('Error saving to Supabase:', saveError)
        throw new Error('Failed to save data to database. The data may be too large.')
      }

      // Format the data for display
      const formattedData = {
        sections: {
          accounts: Array.isArray(data.data?.summary?.accounts)
            ? data.data.summary.accounts.map((account: any) => ({
                type: account.type || '',
                dp_id: account.dp_id || '',
                value: typeof account.value === 'string' ? parseFloat(account.value.replace(/[₹,]/g, '')) || 0 : account.value || 0,
                broker: account.broker || '',
                client_id: account.client_id || '',
                isins_count: parseInt(account.isins_count) || 0
              }))
            : [],
          equities: Array.isArray(data.data?.equities)
            ? data.data.equities.map((equity: any) => ({
                company_name: equity.company_name || '',
                face_value: equity.face_value || 0,
                isin: equity.isin || '',
                market_price: typeof equity.market_price === 'string' ? parseFloat(equity.market_price.replace(/[₹,]/g, '')) || 0 : equity.market_price || 0,
                shares: equity.shares || 0,
                stock_symbol: equity.stock_symbol || '',
                value: typeof equity.value === 'string' ? parseFloat(equity.value.replace(/[₹,]/g, '')) || 0 : equity.value || 0
              }))
            : [],
          summary: {
            total_value: typeof data.data?.summary?.total_value === 'string'
              ? '₹' + Math.round(parseFloat(data.data.summary.total_value.replace(/[₹,]/g, '')) || 0).toLocaleString('en-IN')
              : typeof data.data?.summary?.total_value === 'number'
                ? '₹' + Math.round(data.data.summary.total_value).toLocaleString('en-IN')
                : '₹0',
            mutual_funds: {
              value: typeof data.data?.summary?.mutual_funds?.value === 'string'
                ? '₹' + Math.round(parseFloat(data.data.summary.mutual_funds.value.replace(/[₹,]/g, '')) || 0).toLocaleString('en-IN')
                : typeof data.data?.summary?.mutual_funds?.value === 'number'
                  ? '₹' + Math.round(data.data.summary.mutual_funds.value).toLocaleString('en-IN')
                  : '₹0',
              folio_count: data.data?.summary?.mutual_funds?.folio_count || '0',
              schemes_count: data.data?.summary?.mutual_funds?.schemes_count || '0'
            },
            statement_period: data.data?.summary?.statement_period || ''
          },
          mutualFunds: Array.isArray(data.data?.mutual_funds)
            ? data.data.mutual_funds.map((fund: any) => {
                const currentValue = typeof fund.value === 'string'
                  ? parseFloat(fund.value.replace(/[₹,]/g, ''))
                  : typeof fund.value === 'number'
                    ? fund.value
                    : 0;

                const units = typeof fund.units === 'string'
                  ? parseFloat(fund.units.replace(/,/g, ''))
                  : typeof fund.units === 'number'
                    ? fund.units
                    : 0;

                const cost = typeof fund.cost === 'string'
                  ? parseFloat(fund.cost.replace(/[₹,]/g, ''))
                  : typeof fund.cost === 'number'
                    ? fund.cost
                    : 0;

                const nav = typeof fund.nav === 'string'
                  ? parseFloat(fund.nav.replace(/[₹,]/g, ''))
                  : typeof fund.nav === 'number'
                    ? fund.nav
                    : 0;

                const unrealizedProfit = typeof fund.unrealised_profit === 'string'
                  ? parseFloat(fund.unrealised_profit.replace(/[₹,]/g, ''))
                  : typeof fund.unrealised_profit === 'number'
                    ? fund.unrealised_profit
                    : 0;

                return {
                  isin: fund.isin || '',
                  type: fund.type || '',
                  value: currentValue,
                  symbol: fund.symbol || null,
                  folio_no: fund.folio_no || '',
                  quantity: units,
                  total_cost: cost,
                  scheme_name: fund.scheme_name || '',
                  market_price: nav,
                  cost_per_unit: nav,
                  annualised_return: parseFloat(fund.annualised_return || '0'),
                  unrealised_profit: unrealizedProfit
                };
              })
            : [],
          mutual_fund_folios: Array.isArray(data.data?.mutual_fund_folios)
            ? data.data.mutual_fund_folios.map((fund: any) => ({
                scheme_name: fund.scheme_name || '',
                folio_no: fund.folio_no || '',
                quantity: typeof fund.quantity === 'string' ? parseFloat(fund.quantity.replace(/,/g, '')) : fund.quantity || 0,
                market_price: typeof fund.current_nav === 'string' ? parseFloat(fund.current_nav.replace(/[₹,]/g, '')) : fund.current_nav || 0,
                cost_per_unit: typeof fund.cost_per_unit === 'string' ? parseFloat(fund.cost_per_unit.replace(/[₹,]/g, '')) : fund.cost_per_unit || 0,
                total_cost: typeof fund.total_cost === 'string' ? parseFloat(fund.total_cost.replace(/[₹,]/g, '')) : fund.total_cost || 0,
                value: typeof fund.current_value === 'string' ? parseFloat(fund.current_value.replace(/[₹,]/g, '')) : fund.current_value || 0,
                unrealised_profit: typeof fund.unrealised_profit === 'string' ? parseFloat(fund.unrealised_profit.replace(/[₹,]/g, '')) : fund.unrealised_profit || 0,
                annualised_return: typeof fund.annualised_return === 'string' ? parseFloat(fund.annualised_return) : fund.annualised_return || 0
              }))
            : []
        }
      }

      // Log the formatted data before setting state
      console.log('Formatted mutual fund folios:', formattedData.sections.mutual_fund_folios);
      console.log('Formatted mutual funds:', formattedData.sections.mutualFunds);

      setParsedPdfData(formattedData)
      alert('PDF successfully uploaded and parsed!')
      setSelectedFile(null)
      setPassword('')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message
        setUploadError(`Upload failed: ${errorMessage}`)
      } else {
        let errorMessage = 'Upload failed: An unknown error occurred';
        
        if (error instanceof Error) {
          errorMessage = `Upload failed: ${error.message}`;
        } else if (typeof error === 'string') {
          errorMessage = `Upload failed: ${error}`;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = `Upload failed: ${error.message}`;
        }
        
        setUploadError(errorMessage)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const loadParsedPdfData = async (userId: string) => {
    try {
      console.log('Loading PDF data for user:', userId);
      console.log('Current selected date:', selectedDate);
      
      // Fetch all periods from Supabase
      const { data: periodsData, error: periodsError } = await supabase
        .from('pdf_imported_investments')
        .select('created_at, period')
        .eq('user_id', userId)
        .order('period', { ascending: false });  // Order by period descending (newest first)

      if (periodsError) {
        console.error('Error fetching periods:', periodsError);
        return;
      }

      // Filter out any null periods and set in state
      const validPeriods = periodsData?.filter(p => p.period) || [];
      console.log('Available periods:', validPeriods);
      setAvailablePeriods(validPeriods);

      // If we have periods but no selected date, use the most recent one
      const periodToUse = selectedDate || validPeriods[0]?.period;
      
      if (periodToUse) {
        console.log('Fetching data for period:', periodToUse);
        
        // Fetch data for the selected period
        const { data, error } = await supabase
          .from('pdf_imported_investments')
          .select('summary, equities, mutual_funds')
          .eq('user_id', userId)
          .eq('period', periodToUse)
          .single();

        if (error) {
          console.error('Error fetching PDF data:', error);
          return;
        }

        if (data) {
          console.log('Setting data for period:', periodToUse);
          setParsedPdfData(formatPdfData(data));
          
          // Update selected date if none was selected
          if (!selectedDate) {
            setSelectedDate(periodToUse);
          }
        }
      }
    } catch (error) {
      console.error('Error in loadParsedPdfData:', error);
    }
  };

  // Helper function to format PDF data consistently
  const formatPdfData = (data: any) => {
    return {
      sections: {
        accounts: Array.isArray(data.summary?.accounts) 
          ? data.summary.accounts.map((account: any) => ({
              type: account.type || '',
              dp_id: account.dp_id || '',
              value: typeof account.value === 'string' ? parseFloat(account.value.replace(/[₹,]/g, '')) || 0 : account.value || 0,
              broker: account.broker || '',
              client_id: account.client_id || '',
              isins_count: parseInt(account.isins_count) || 0
            }))
          : [],
        equities: Array.isArray(data.equities)
          ? data.equities.map((equity: any) => ({
              company_name: equity.company_name || '',
              face_value: equity.face_value || 0,
              isin: equity.isin || '',
              market_price: typeof equity.market_price === 'string' ? parseFloat(equity.market_price.replace(/[₹,]/g, '')) || 0 : equity.market_price || 0,
              shares: equity.shares || 0,
              stock_symbol: equity.stock_symbol || '',
              value: typeof equity.value === 'string' ? parseFloat(equity.value.replace(/[₹,]/g, '')) || 0 : equity.value || 0
            }))
          : [],
        summary: data.summary,
        mutualFunds: data.mutual_funds?.schemes || [],
        mutual_fund_folios: data.mutual_funds?.folios || []
      }
    };
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">External Portfolio Tracker</h1>
        <h3 className="text-lg font-bold mb-6">Add Your Investments from Multiple Brokerage Accounts and Track them Here</h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('manual')}
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            className={`flex-1 md:flex-none ${
              activeTab === 'manual' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                : 'text-blue-600 hover:text-blue-700 border-blue-600 hover:bg-blue-50'
            }`}
          >
            Manual Entry
          </Button>
          <Button
            onClick={() => setActiveTab('pdf')}
            variant={activeTab === 'pdf' ? 'default' : 'outline'}
            className={`flex-1 md:flex-none ${
              activeTab === 'pdf' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                : 'text-blue-600 hover:text-blue-700 border-blue-600 hover:bg-blue-50'
            }`}
          >
            PDF Upload
          </Button>
        </div>

        {/* Manual Entry Tab */}
        {activeTab === 'manual' && (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 relative">
                  <Input
                    name="company_name"
                    placeholder="Search company name"
                    value={newInvestment.company_name}
                    onChange={handleCompanyNameChange}
                    required
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.symbol}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => selectStock(result)}
                        >
                          <div className="font-medium">{result.symbol}</div>
                          <div className="text-sm text-gray-600">{result.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {newInvestment.symbol && (
                    <p className="text-sm text-gray-500">Selected: {newInvestment.symbol}</p>
                  )}
                </div>
                <Input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={newInvestment.quantity}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="purchase_date"
                  type="date"
                  value={newInvestment.purchase_date}
                  onChange={handleInputChange}
                  required
                />
                <div className="space-y-2">
                  <Input
                    name="sell_date"
                    type="date"
                    value={newInvestment.sell_date}
                    onChange={handleInputChange}
                    max={getLastMarketOpenDate()}
                  />
                  <p className="text-sm text-gray-500">
                    If not Sold, then leave it Empty
                  </p>
                </div>
              </div>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                Add Investment
              </Button>
            </form>

            {/* Existing investments table */}
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Symbol</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Quantity</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Purchase Date</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Purchase Price</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Sell Date</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Sell Price</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Total Value</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Holding Period Return</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Annual Return</th>
                    <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {investments.map((investment, index) => {
                    const totalValue = investment.quantity * (investment.sell_price || investment.purchase_price);
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-blue-600">{investment.symbol}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{investment.quantity.toLocaleString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{new Date(investment.purchase_date).toLocaleDateString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{formatCurrency(investment.purchase_price)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{investment.sell_date ? new Date(investment.sell_date).toLocaleDateString() : '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{investment.sell_price ? formatCurrency(investment.sell_price) : '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">{formatCurrency(totalValue)}</td>
                        <td className={`px-3 py-2 whitespace-nowrap font-medium text-center ${(investment.holding_period_return ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(investment.holding_period_return ?? 0)}
                        </td>
                        <td className={`px-3 py-2 whitespace-nowrap font-medium text-center ${(investment.annual_return ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(investment.annual_return ?? 0)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingInvestment(investment);
                              setIsEditing(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(investment.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm ml-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-semibold border-t-2 border-gray-200">
                  {(() => {
                    const metrics = calculatePortfolioMetrics(investments);
                    return (
                      <tr>
                        <td className="px-3 py-3 whitespace-nowrap">Portfolio Total</td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">{formatCurrency(metrics.totalValue)}</td>
                        <td className={`px-3 py-3 whitespace-nowrap text-center ${metrics.holdingPeriodReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(metrics.holdingPeriodReturn)}
                        </td>
                        <td className={`px-3 py-3 whitespace-nowrap text-center ${metrics.annualReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(metrics.annualReturn)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center"></td>
                      </tr>
                    );
                  })()}
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* PDF Upload Tab */}
        {activeTab === 'pdf' && (
          <div>
            {/* PDF Upload Form */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4">Upload Portfolio PDF</h4>
              <form onSubmit={handlePdfUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter PDF password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full"
                    />
                  </div>
                </div>
                {uploadError && (
                  <p className="text-red-600 text-sm">{uploadError}</p>
                )}
                <Button 
                  type="submit"
                  disabled={isUploading || !selectedFile || !password}
                  className={`w-full md:w-auto ${
                    isUploading || !selectedFile || !password
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload and Parse PDF'}
                </Button>
              </form>
            </div>

            {/* Time Period Display */}
            <div className="mb-8 bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h4 className="text-base font-semibold text-gray-700">Report Period:</h4>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedDate}
                      onChange={async (e) => {
                        const newDate = e.target.value;
                        console.log('Selected new period:', newDate);
                        setSelectedDate(newDate);
                        
                        // Fetch data directly for the selected period
                        if (userId) {
                          const { data, error } = await supabase
                            .from('pdf_imported_investments')
                            .select('summary, equities, mutual_funds')
                            .eq('user_id', userId)
                            .eq('period', newDate)
                            .single();

                          if (error) {
                            console.error('Error fetching PDF data:', error);
                            return;
                          }

                          if (data) {
                            console.log('Setting data for period:', newDate);
                            setParsedPdfData(formatPdfData(data));
                          }
                        }
                      }}
                      className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availablePeriods.map((item) => (
                        <option key={item.created_at} value={item.period || ''}>
                          {item.period || 'Unknown Period'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Previously Parsed Data Summary */}
            <div className="mb-8">
              {/* Mobile View - Horizontal Scrollable Cards */}
              <div className="md:hidden overflow-x-auto pb-4">
                <div className="flex space-x-4 px-4 min-w-max">
                  {/* Total Portfolio Summary Card */}
                  <div 
                    className="w-72 bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg flex-shrink-0"
                    onClick={() => setSelectedCard(selectedCard === 'summary' ? null : 'summary')}
                  >
                    <h4 className="text-base font-semibold mb-4 text-gray-800">Portfolio Summary</h4>
                    <div className={`p-4 rounded-lg border transition-colors ${
                      selectedCard === 'summary' ? 'bg-blue-100 border-blue-200' : 'bg-blue-50 border-blue-100'
                    }`}>
                      <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-blue-900 uppercase tracking-wider mb-1">Total Portfolio Value</h5>
                        <p className="text-xs text-blue-700 mb-2">
                          {parsedPdfData?.sections?.summary?.statement_period || 'Not available'}
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {parsedPdfData?.sections?.summary?.total_value?.replace(/\.00/g, '') || '₹0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mutual Fund Folios Card */}
                  <div 
                    className="w-72 bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg flex-shrink-0"
                    onClick={() => setSelectedCard(selectedCard === 'mutual-funds-folios' ? null : 'mutual-funds-folios')}
                  >
                    <h4 className="text-base font-semibold mb-4 text-gray-800">Mutual Fund Folios</h4>
                    <div className={`p-4 rounded-lg border transition-colors ${
                      selectedCard === 'mutual-funds-folios' ? 'bg-green-100 border-green-200' : 'bg-green-50 border-green-100'
                    }`}>
                      <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-green-900 uppercase tracking-wider mb-1">Total Folio Value</h5>
                        <p className="text-xs text-green-700 mb-2">
                          {parsedPdfData?.sections?.summary?.mutual_funds?.folio_count || '0'} Folios
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {parsedPdfData?.sections?.summary?.mutual_funds?.value?.replace(/\.00/g, '') || '₹0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Mutual Funds Card */}
                  <div 
                    className="w-72 bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg flex-shrink-0"
                    onClick={() => setSelectedCard(selectedCard === 'additional-mutual-funds' ? null : 'additional-mutual-funds')}
                  >
                    <h4 className="text-base font-semibold mb-4 text-gray-800">Additional Mutual Funds</h4>
                    <div className={`p-4 rounded-lg border transition-colors ${
                      selectedCard === 'additional-mutual-funds' ? 'bg-green-100 border-green-200' : 'bg-green-50 border-green-100'
                    }`}>
                      <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-green-900 uppercase tracking-wider mb-1">Total Fund Value</h5>
                        <p className="text-xs text-green-700 mb-2">
                          {parsedPdfData?.sections?.mutualFunds?.length || '0'} Schemes
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          ₹{Math.round(parsedPdfData?.sections?.mutualFunds?.reduce((sum, fund) => sum + (fund.value || 0), 0) || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Equities Card */}
                  <div 
                    className="w-72 bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg flex-shrink-0"
                    onClick={() => setSelectedCard(selectedCard === 'equities' ? null : 'equities')}
                  >
                    <h4 className="text-base font-semibold mb-4 text-gray-800">Equities</h4>
                    <div className={`p-4 rounded-lg border transition-colors ${
                      selectedCard === 'equities' ? 'bg-purple-100 border-purple-200' : 'bg-purple-50 border-purple-100'
                    }`}>
                      <div className="flex flex-col">
                        <h5 className="text-sm font-medium text-purple-900 uppercase tracking-wider mb-1">Total Equity Value</h5>
                        <p className="text-xs text-purple-700 mb-2">
                          {parsedPdfData?.sections?.equities?.length || 0} Stocks
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          ₹{Math.round(parsedPdfData?.sections?.equities?.reduce((sum, equity) => sum + (equity.value || 0), 0) || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop View - Grid Layout */}
              <div className="hidden md:grid md:grid-cols-4 gap-6">
                {/* Keep existing desktop cards code */}
                <div 
                  className="bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg"
                  onClick={() => setSelectedCard(selectedCard === 'summary' ? null : 'summary')}
                >
                  <h4 className="text-base font-semibold mb-4 text-gray-800">Portfolio Summary</h4>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    selectedCard === 'summary' ? 'bg-blue-100 border-blue-200' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="flex flex-col">
                      <h5 className="text-sm font-medium text-blue-900 uppercase tracking-wider mb-1">Total Portfolio Value</h5>
                      <p className="text-xs text-blue-700 mb-2">
                        {parsedPdfData?.sections?.summary?.statement_period || 'Not available'}
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {parsedPdfData?.sections?.summary?.total_value?.replace(/\.00/g, '') || '₹0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg"
                  onClick={() => setSelectedCard(selectedCard === 'mutual-funds-folios' ? null : 'mutual-funds-folios')}
                >
                  <h4 className="text-base font-semibold mb-4 text-gray-800">Mutual Fund Folios</h4>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    selectedCard === 'mutual-funds-folios' ? 'bg-green-100 border-green-200' : 'bg-green-50 border-green-100'
                  }`}>
                    <div className="flex flex-col">
                      <h5 className="text-sm font-medium text-green-900 uppercase tracking-wider mb-1">Total Folio Value</h5>
                      <p className="text-xs text-green-700 mb-2">
                        {parsedPdfData?.sections?.summary?.mutual_funds?.folio_count || '0'} Folios
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {parsedPdfData?.sections?.summary?.mutual_funds?.value?.replace(/\.00/g, '') || '₹0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg"
                  onClick={() => setSelectedCard(selectedCard === 'additional-mutual-funds' ? null : 'additional-mutual-funds')}
                >
                  <h4 className="text-base font-semibold mb-4 text-gray-800">Additional Mutual Funds</h4>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    selectedCard === 'additional-mutual-funds' ? 'bg-green-100 border-green-200' : 'bg-green-50 border-green-100'
                  }`}>
                    <div className="flex flex-col">
                      <h5 className="text-sm font-medium text-green-900 uppercase tracking-wider mb-1">Total Fund Value</h5>
                      <p className="text-xs text-green-700 mb-2">
                        {parsedPdfData?.sections?.mutualFunds?.length || '0'} Schemes
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        ₹{Math.round(parsedPdfData?.sections?.mutualFunds?.reduce((sum, fund) => sum + (fund.value || 0), 0) || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-102 hover:shadow-lg"
                  onClick={() => setSelectedCard(selectedCard === 'equities' ? null : 'equities')}
                >
                  <h4 className="text-base font-semibold mb-4 text-gray-800">Equities</h4>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    selectedCard === 'equities' ? 'bg-purple-100 border-purple-200' : 'bg-purple-50 border-purple-100'
                  }`}>
                    <div className="flex flex-col">
                      <h5 className="text-sm font-medium text-purple-900 uppercase tracking-wider mb-1">Total Equity Value</h5>
                      <p className="text-xs text-purple-700 mb-2">
                        {parsedPdfData?.sections?.equities?.length || 0} Stocks
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        ₹{Math.round(parsedPdfData?.sections?.equities?.reduce((sum, equity) => sum + (equity.value || 0), 0) || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Sections */}
            {selectedCard === 'summary' && (
              <div className="mb-8 bg-white rounded-lg shadow p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-semibold">Portfolio Details</h4>
                  <div className="text-sm text-gray-600">
                    {parsedPdfData?.sections?.summary?.statement_period || 'Not available'}
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Asset Allocation */}
                  <div>
                    <h5 className="text-lg font-medium mb-4">Asset Allocation</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mutual Fund Folios</span>
                        <span className="font-medium">
                          {parsedPdfData?.sections?.summary?.mutual_funds?.value?.replace(/\.00/g, '') || '₹0'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Additional Mutual Funds</span>
                        <span className="font-medium">
                          ₹{Math.round(parsedPdfData?.sections?.mutualFunds?.filter(fund => 
                            !parsedPdfData?.sections?.mutual_fund_folios?.some(
                              folio => folio.scheme_name === fund.scheme_name
                            )
                          ).reduce((sum, fund) => sum + (fund.value || 0), 0) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Equities</span>
                        <span className="font-medium">
                          ₹{Math.round(parsedPdfData?.sections?.equities?.reduce((sum, equity) => sum + (equity.value || 0), 0) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedCard === 'mutual-funds-folios' && (
              <div className="mb-8">
                <h4 className="text-base font-semibold mb-4">Mutual Fund Folios</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-sm">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Scheme Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Folio Number</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Units</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">NAV</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Cost/Unit</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Total Cost</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Value</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">P/L</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Return</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parsedPdfData?.sections?.mutual_fund_folios?.map((fund, index) => (
                        <tr key={`folio-${index}`} className={index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50 hover:bg-green-50'}>
                          <td className="px-3 py-2 text-sm">{fund.scheme_name || 'NOT AVAILABLE'}</td>
                          <td className="px-3 py-2 text-sm font-mono">{fund.folio_no}</td>
                          <td className="px-3 py-2 text-sm text-center">{fund.quantity.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(fund.market_price))}</td>
                          <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(fund.cost_per_unit))}</td>
                          <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(fund.total_cost))}</td>
                          <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(fund.value))}</td>
                          <td className={`px-3 py-2 text-sm text-center font-medium ${fund.unrealised_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.round(fund.unrealised_profit))}
                          </td>
                          <td className={`px-3 py-2 text-sm text-center font-medium ${fund.annualised_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(fund.annualised_return)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium border-t-2 border-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-xs">Total</td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs text-center">{formatCurrency(
                          Math.round(parsedPdfData?.sections?.mutual_fund_folios?.reduce((sum, fund) => sum + (fund.total_cost || 0), 0) || 0)
                        )}</td>
                        <td className="px-3 py-2 text-xs text-center">{formatCurrency(
                          Math.round(parsedPdfData?.sections?.mutual_fund_folios?.reduce((sum, fund) => sum + fund.value, 0) || 0)
                        )}</td>
                        <td className="px-3 py-2 text-xs text-center">{formatCurrency(
                          Math.round(parsedPdfData?.sections?.mutual_fund_folios?.reduce((sum, fund) => sum + (fund.unrealised_profit || 0), 0) || 0)
                        )}</td>
                        <td className="px-3 py-2 text-xs"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {selectedCard === 'additional-mutual-funds' && (
              <div className="mb-8">
                <h4 className="text-base font-semibold mb-4">Additional Mutual Funds</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-sm">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Scheme Name</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Units</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">NAV</th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parsedPdfData?.sections?.mutualFunds?.filter(fund => 
                        !parsedPdfData?.sections?.mutual_fund_folios?.some(
                          folio => folio.scheme_name === fund.scheme_name
                        )
                      ).map((fund, index) => {
                        const quantity = parseFloat(String(fund.quantity)) || 0;
                        const marketPrice = parseFloat(String(fund.market_price)) || 0;
                        const value = parseFloat(String(fund.value)) || 0;
                        
                        return (
                          <tr key={`fund-${index}`} className={index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50 hover:bg-green-50'}>
                            <td className="px-3 py-2 text-sm">{fund.scheme_name || '-'}</td>
                            <td className="px-3 py-2 text-sm text-center">{quantity ? quantity.toFixed(3) : '0.000'}</td>
                            <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(marketPrice))}</td>
                            <td className="px-3 py-2 text-sm text-center">{formatCurrency(Math.round(value))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium border-t-2 border-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-xs">Total</td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs"></td>
                        <td className="px-3 py-2 text-xs text-center">{formatCurrency(
                          Math.round(parsedPdfData?.sections?.mutualFunds?.filter(fund => 
                            !parsedPdfData?.sections?.mutual_fund_folios?.some(
                              folio => folio.scheme_name === fund.scheme_name
                            )
                          ).reduce((sum, fund) => sum + fund.value, 0) || 0)
                        )}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {selectedCard === 'equities' && (
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Equity Holdings</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-purple-600 text-white">
                      <tr>
                        <th className="px-3 py-2.5 text-left text-sm font-semibold">Symbol</th>
                        <th className="px-3 py-2.5 text-right text-sm font-semibold">Shares</th>
                        <th className="px-3 py-2.5 text-right text-sm font-semibold">Market Price</th>
                        <th className="px-3 py-2.5 text-right text-sm font-semibold">Current Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parsedPdfData?.sections?.equities
                        ?.sort((a, b) => (b.value || 0) - (a.value || 0))
                        ?.map((equity, index) => (
                        <tr key={`equity-${index}`} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                          <td className="px-3 py-2 text-sm font-medium text-blue-600">{equity.stock_symbol}</td>
                          <td className="px-3 py-2 text-sm text-right text-gray-900">{Math.round(equity.shares).toLocaleString()}</td>
                          <td className="px-3 py-2 text-sm text-right text-gray-900">{formatCurrency(Math.round(equity.market_price))}</td>
                          <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(Math.round(equity.value))}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium border-t-2 border-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-sm">Total ({parsedPdfData?.sections?.equities?.length || 0} Stocks)</td>
                        <td className="px-3 py-2 text-sm text-right">{Math.round(parsedPdfData?.sections?.equities?.reduce((sum, equity) => sum + equity.shares, 0) || 0).toLocaleString()}</td>
                        <td className="px-3 py-2 text-sm"></td>
                        <td className="px-3 py-2 text-sm text-right font-medium">{formatCurrency(
                          Math.round(parsedPdfData?.sections?.equities?.reduce((sum, equity) => sum + equity.value, 0) || 0)
                        )}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal - Move outside of tabs */}
        {isEditing && editingInvestment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Investment
                </h3>
                <form onSubmit={handleEditSubmit} className="mt-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Symbol: {editingInvestment.symbol}
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Purchase Date: {new Date(editingInvestment.purchase_date).toLocaleDateString()}
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Sell Date
                    </label>
                    <Input
                      type="date"
                      value={editingInvestment.sell_date || ''}
                      onChange={(e) => setEditingInvestment({
                        ...editingInvestment,
                        sell_date: e.target.value
                      })}
                      max={getLastMarketOpenDate()}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingInvestment(null);
                      }}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 