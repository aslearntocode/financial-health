import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rruaznytrgasfzkvahyr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydWF6bnl0cmdhc2Z6a3ZhaHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MDM3OTcsImV4cCI6MjA1MjA3OTc5N30.ITz519ZuISrQcGKmhA51YNu8VkAD8o03r5cMMFgpXfM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 