import { supabase } from './supabase'

interface DatabaseRecord {
  [key: string]: string | number | boolean;
}

export async function saveRecord(data: DatabaseRecord) {
  // ... rest of the function
} 