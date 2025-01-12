import { supabase } from './supabase'
import { auth } from '@/lib/firebase'

interface InvestmentData {
  user_id: string
  name: string
  age: number
  current_savings: number
  monthly_savings: number
  investment_horizon: number
  financial_goal: string
  allocation: Array<{
    name: string
    value: number
    color: string
  }>
}

export async function saveInvestmentData(data: InvestmentData) {
  try {
    console.log('Attempting to save data:', {
      ...data,
      user_id: data.user_id.substring(0, 8) + '...'
    });

    const record = {
      user_id: data.user_id,
      name: data.name,
      age: data.age,
      current_savings: data.current_savings,
      monthly_savings: data.monthly_savings,
      investment_horizon: data.investment_horizon,
      financial_goal: data.financial_goal,
      allocation: data.allocation,
      created_at: new Date().toISOString()
    };

    console.log('Prepared record:', record);

    const { data: result, error: insertError } = await supabase
      .from('investment_records')
      .insert([record])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      throw new Error(`Failed to save investment data: ${insertError.message}`);
    }

    console.log('Successfully saved investment data:', result);
    return result;

  } catch (error) {
    console.error('SaveInvestmentData error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
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