import { supabase } from './supabase'

interface DatabaseRecord {
  [key: string]: string | number | boolean;
}

// Your database functions here
export async function saveRecord(table: string, record: DatabaseRecord) {
  const { data, error } = await supabase
    .from(table)
    .insert([record])
  
  if (error) throw error
  return data
}

export async function getRecord(table: string, query: DatabaseRecord) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .match(query)
  
  if (error) throw error
  return data
} 