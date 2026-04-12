export type Page = 'login' | 'dashboard' | 'admin'
export type DashboardTab = 'reminders' | 'goals' | 'calendar' | 'analytics' | 'ai-assistant'
export type PlanTier = 'free' | 'premium'
export type TickerCategory = 'missing-person' | 'help-a-life' | 'community'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isDemoUser?: boolean
}

export interface SubGoal {
  id: string
  title: string
  completed: boolean
  estimatedDays: number
}

export interface Goal {
  id: string
  title: string
  description: string
  category: string
  progress: number
  etcDays: number
  subGoals: SubGoal[]
  createdAt: string
  color: 'pink' | 'blue' | 'green'
  targetDate?: string
  priority?: number
  difficulty?: number
  obstacles?: string
  motivation?: string
}

export interface Reminder {
  id: string
  title: string
  message: string
  scheduledDate: string
  scheduledTime: string
  repeat: 'none' | 'daily' | 'weekly' | 'monthly'
  isActive: boolean
}

export interface NewsTicker {
  id: string
  message: string
  category: TickerCategory
  isActive: boolean
  publishedAt: string
}

export interface AdminMetrics {
  totalUsers: number
  mrr: number
  serverCosts: number
  activeGoals: number
  remindersScheduled: number
}

export interface AppNotification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}
