export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('test').select('*').limit(1)
    return !error
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
} 