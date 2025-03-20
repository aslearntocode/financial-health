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

export default function PortfolioTracker() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [newInvestment, setNewInvestment] = useState({
    company_name: '',
    symbol: '',
    quantity: '',
    purchase_date: '',
    sell_date: ''
  })
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Create a Supabase client for the component
  const supabaseClient = createClientComponentClient()

  useEffect(() => {
    // Use Firebase auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
        loadInvestments(user.uid)
      } else {
        setUserId(null)
        setInvestments([])
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

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

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

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">External Portfolio Tracker</h1>
        <h3 className="text-lg font-bold mb-6">Add Your Investments from Multiple Brokerage Accounts and Track them Here</h3>
        
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
            disabled={!newInvestment.symbol}
          >
            Add Investment
          </Button>
        </form>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Symbol</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Quantity</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Purchase Date</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Purchase Price</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Sell Date</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Sell Price</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Total Value</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Holdig Period Return</th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider">Annual Return</th>
                <th className="px-3 py-3 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {investments.map((investment, index) => {
                const totalValue = investment.quantity * (investment.sell_price || investment.purchase_price);
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-blue-600">{investment.symbol}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{investment.quantity.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(investment.purchase_date).toLocaleDateString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(investment.purchase_price)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{investment.sell_date ? new Date(investment.sell_date).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{investment.sell_price ? formatCurrency(investment.sell_price) : '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(totalValue)}</td>
                    <td className={`px-3 py-2 whitespace-nowrap font-medium ${(investment.holding_period_return ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(investment.holding_period_return ?? 0)}
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap font-medium ${(investment.annual_return ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(investment.annual_return ?? 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right space-x-2">
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
          </table>
        </div>

        {/* Edit Modal */}
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
                      className="bg-gray-100 hover:bg-gray-200"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
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