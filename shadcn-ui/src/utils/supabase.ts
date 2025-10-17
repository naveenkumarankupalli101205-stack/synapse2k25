import { createClient } from '@supabase/supabase-js'

// Use environment variables or fall back to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is configured with real credentials
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://demo.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'demo-key'
  )
}

// Optional demo mode flag
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
