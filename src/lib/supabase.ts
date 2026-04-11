import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  full_name: string
  is_demo_user: boolean
  subscription_tier: 'free' | 'premium'
  created_at: string
  updated_at: string
}

export type Goal = {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'not-started' | 'in-progress' | 'completed'
  target_date: string | null
  created_at: string
  updated_at: string
}

export type Reminder = {
  id: string
  user_id: string
  goal_id: string | null
  title: string
  description: string | null
  reminder_date: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export type AITokenUsage = {
  id: string
  user_id: string
  tokens_used: number
  goal_id: string | null
  request_type: 'goal-decomposition' | 'strategy-planning'
  created_at: string
}
