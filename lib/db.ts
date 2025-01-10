import { supabase } from './supabase'
import { auth } from '@/lib/firebase'

interface InvestmentData {
  user_id: string
  name: string
  age: number
  current_savings: number
  monthly_savings: number
  investment_horizon_years: number
  financial_goal: string
  allocation: Array<{
    name: string
    value: number
    color: string
  }>
  created_at?: Date
}

export async function saveInvestmentData(data: InvestmentData) {
  try {
    // Get the current Firebase user
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error('No authenticated user found')
    }

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken()
    
    // Set Supabase auth header
    supabase.auth.setSession({
      access_token: idToken,
      refresh_token: ''
    })

    // Log the incoming data
    console.log('Raw data to save:', data)

    // Format data for Supabase
    const formattedData = {
      user_id: firebaseUser.uid,
      name: data.name || '',
      age: Number(data.age) || 0,
      current_savings: Number(data.current_savings) || 0,
      monthly_savings: Number(data.monthly_savings) || 0,
      investment_horizon: Number(data.investment_horizon_years) || 0,
      financial_goal: data.financial_goal || '',
      allocation: Array.isArray(data.allocation) ? data.allocation : [],
      created_at: new Date().toISOString()
    }

    console.log('Attempting to save with user:', firebaseUser.uid)
    console.log('Formatted data:', formattedData)

    // First insert the data
    const { data: result, error: insertError } = await supabase
      .from('investment_records')
      .insert([formattedData])
      .select()

    if (insertError) {
      console.error('Full insert error:', insertError)
      throw new Error(`Insert failed: ${insertError.message}`)
    }

    if (!result) {
      throw new Error('No data returned from insert')
    }

    console.log('Data saved successfully:', result)
    return result[0]

  } catch (error: any) {
    console.error('Full error object:', error)
    console.error('Error saving data:', {
      name: error.name,
      message: error.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error.stack
    })
    throw error
  }
}

export async function getUserInvestmentHistory(userId: string) {
  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    const { data, error } = await supabase
      .from('investment_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error: any) {
    console.error('Failed to fetch investment history:', {
      message: error.message,
      code: error?.code,
      details: error?.details
    })
    throw new Error(`Failed to fetch investment history: ${error.message}`)
  }
} 