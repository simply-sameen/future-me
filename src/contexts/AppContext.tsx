import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Page, DashboardTab, User, Goal, Reminder, NewsTicker } from '../types'
import { DEMO_USER, DEMO_GOALS, DEMO_REMINDERS, DEMO_TICKERS } from '../data/mockData'
import { supabase } from '../lib/supabaseClient'

interface AppContextValue {
  currentPage: Page
  navigateTo: (page: Page) => void

  user: User | null
  isAuthenticated: boolean
  isDemoMode: boolean
  isPremium: boolean
  togglePremium: () => void
  loginAsDemo: () => void
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>

  showMomentumModal: boolean
  closeMomentumModal: () => void

  dashboardTab: DashboardTab
  setDashboardTab: (tab: DashboardTab) => void

  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>
  updateGoalProgress: (id: string, progress: number) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  completeSubGoal: (goalId: string, subGoalId: string) => Promise<void>

  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>
  toggleReminder: (id: string) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>

  tickers: NewsTicker[]
  addTicker: (ticker: NewsTicker) => void
  removeTicker: (id: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('login')
  const [user, setUser] = useState<User | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showMomentumModal, setShowMomentumModal] = useState(false)
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('reminders')
  const [goals, setGoals] = useState<Goal[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [tickers, setTickers] = useState<NewsTicker[]>(DEMO_TICKERS.filter(t => t.isActive))

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page)
  }, [])

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER)
    setIsDemoMode(true)
    setGoals(DEMO_GOALS)
    setReminders(DEMO_REMINDERS)
    setCurrentPage('dashboard')
    setShowMomentumModal(true)
    setDashboardTab('reminders')
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsDemoMode(false)
    setIsPremium(false)
    setGoals([])
    setReminders([])
    setCurrentPage('login')
    setShowMomentumModal(false)
    setDashboardTab('reminders')
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    })

    if (error) {
      console.error('Registration error:', error.message)
      throw error
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || name || email.split('@')[0],
        email: data.user.email || email,
        avatar: data.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        isDemoUser: false
      })
      setIsDemoMode(false)
      setIsPremium(false)
      setGoals([])
      setReminders([])
      setCurrentPage('dashboard')
    }
  }, [])

  const togglePremium = useCallback(() => {
    setIsPremium(prev => !prev)
  }, [])

  const closeMomentumModal = useCallback(() => {
    setShowMomentumModal(false)
  }, [])

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data, error } = await supabase.from('goals').insert({
      user_id: user.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      progress: goal.progress,
      etc_days: goal.etcDays,
      color: goal.color,
      sub_goals: goal.subGoals
    }).select().single();

    if (error) {
      console.error('Error adding goal:', error.message);
      return;
    }

    if (data) {
      setGoals(prev => [{
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        progress: data.progress,
        etcDays: data.etc_days,
        color: data.color,
        subGoals: data.sub_goals,
        createdAt: data.created_at
      }, ...prev]);
    }
  }, [user])

  const updateGoalProgress = useCallback(async (id: string, progress: number) => {
    const { error } = await supabase.from('goals').update({ progress }).eq('id', id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, progress } : g))
    }
  }, [])

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id))
    }
  }, [])

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const dbUpdates: any = { ...updates }
    if (updates.etcDays !== undefined) { dbUpdates.etc_days = updates.etcDays; delete dbUpdates.etcDays }
    if (updates.subGoals !== undefined) { dbUpdates.sub_goals = updates.subGoals; delete dbUpdates.subGoals }

    const { error } = await supabase.from('goals').update(dbUpdates).eq('id', id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    }
  }, [])

  const completeSubGoal = useCallback(async (goalId: string, subGoalId: string) => {
    setGoals(prev => {
      const goal = prev.find(g => g.id === goalId)
      if (!goal) return prev

      const updatedSubGoals = goal.subGoals.map(sg =>
        sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
      )
      const completedCount = updatedSubGoals.filter(sg => sg.completed).length
      const newProgress = Math.round((completedCount / updatedSubGoals.length) * 100)

      supabase.from('goals').update({ 
        sub_goals: updatedSubGoals, 
        progress: newProgress 
      }).eq('id', goalId)

      return prev.map(g => g.id === goalId ? { ...g, subGoals: updatedSubGoals, progress: newProgress } : g)
    })
  }, [])

  const addReminder = useCallback(async (reminder: Omit<Reminder, 'id'>) => {
    if (!user) return;
    const { data, error } = await supabase.from('reminders').insert({
      user_id: user.id,
      title: reminder.title,
      message: reminder.message,
      scheduled_date: reminder.scheduledDate,
      scheduled_time: reminder.scheduledTime,
      repeat: reminder.repeat,
      is_active: reminder.isActive
    }).select().single();

    if (error) {
      console.error('Error adding reminder:', error.message);
      return;
    }

    if (data) {
      setReminders(prev => [{
        id: data.id,
        title: data.title,
        message: data.message,
        scheduledDate: data.scheduled_date,
        scheduledTime: data.scheduled_time,
        repeat: data.repeat,
        isActive: data.is_active
      }, ...prev])
    }
  }, [user])

  const toggleReminder = useCallback(async (id: string) => {
    setReminders(prev => {
      const reminder = prev.find(r => r.id === id)
      if (!reminder) return prev
      
      const newIsActive = !reminder.isActive
      supabase.from('reminders').update({ is_active: newIsActive }).eq('id', id)

      return prev.map(r => r.id === id ? { ...r, isActive: newIsActive } : r)
    })
  }, [])

  const deleteReminder = useCallback(async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id)
    if (!error) {
      setReminders(prev => prev.filter(r => r.id !== id))
    }
  }, [])

  const updateReminder = useCallback(async (id: string, updates: Partial<Reminder>) => {
    const dbUpdates: any = { ...updates }
    if (updates.scheduledDate !== undefined) { dbUpdates.scheduled_date = updates.scheduledDate; delete dbUpdates.scheduledDate }
    if (updates.scheduledTime !== undefined) { dbUpdates.scheduled_time = updates.scheduledTime; delete dbUpdates.scheduledTime }
    if (updates.isActive !== undefined) { dbUpdates.is_active = updates.isActive; delete dbUpdates.isActive }

    const { error } = await supabase.from('reminders').update(dbUpdates).eq('id', id)
    if (!error) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
    }
  }, [])

  const addTicker = useCallback((ticker: NewsTicker) => {
    setTickers(prev => [ticker, ...prev])
  }, [])

  const removeTicker = useCallback((id: string) => {
    setTickers(prev => prev.filter(t => t.id !== id))
  }, [])

  const isAuthenticated = !!user

  return (
    <AppContext.Provider value={{
      currentPage,
      navigateTo,
      user,
      isAuthenticated,
      isDemoMode,
      isPremium,
      togglePremium,
      loginAsDemo,
      logout,
      register,
      showMomentumModal,
      closeMomentumModal,
      dashboardTab,
      setDashboardTab,
      goals,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      updateGoal,
      completeSubGoal,
      reminders,
      addReminder,
      toggleReminder,
      deleteReminder,
      updateReminder,
      tickers,
      addTicker,
      removeTicker,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
