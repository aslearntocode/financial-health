import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('test').select('*').limit(1)
    return !error
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
} 