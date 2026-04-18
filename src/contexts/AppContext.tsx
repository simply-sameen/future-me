import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Page, DashboardTab, User, Goal, Reminder, NewsTicker, AppNotification } from '../types'
import { DEMO_USER, DEMO_GOALS, DEMO_REMINDERS, DEMO_TICKERS } from '../data/mockData'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

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
  login: (email: string, password: string) => Promise<void>

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

  chatMessages: ChatMessage[]
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  clearChatMessages: () => void

  notifications: AppNotification[]
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>

  incrementAiCalls: () => Promise<void>
  updateUserProfile: (updates: { name?: string; email?: string; password?: string }) => Promise<void>
  toggleSocialCues: () => Promise<void>
  updateUserTheme: (theme: string, accentColor: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

/* ── Accent map: DB value → hex ── */
const ACCENT_MAP: Record<string, string> = {
  'lavender': '#e8daf9',
  'yellow':   '#ffc95e',
  'orange':   '#f57362',
  'sky-blue': '#61adee',
  'teal':     '#2a9d99',
  'brown':    '#b18164',
}

function applyUserTheme(theme: string, accentColor: string) {
  const hex = ACCENT_MAP[accentColor] ?? '#61adee'
  document.documentElement.style.setProperty('--user-accent', hex)
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme === 'light' ? 'light' : 'dark')
}

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  // Apply dark mode by default on mount
  useEffect(() => {
    applyUserTheme('dark', 'sky-blue')
  }, [])

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page)
  }, [])

  const loginAsDemo = useCallback(() => {
    applyUserTheme('dark', 'sky-blue')
    setUser(DEMO_USER)
    setIsDemoMode(true)
    setGoals(DEMO_GOALS)
    setReminders(DEMO_REMINDERS)
    setChatMessages([]) // Clear chat history on session start
    setNotifications([]) // Clear notification history

    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
      sessionStorage.removeItem('chatMessages')
    }
    setCurrentPage('dashboard')
    setShowMomentumModal(true)
    setDashboardTab('reminders')
  }, [])

  const logout = useCallback(() => {
    applyUserTheme('dark', 'sky-blue')
    setUser(null)
    setIsDemoMode(false)
    setIsPremium(false)
    setGoals([])
    setReminders([])
    setChatMessages([]) // Explicitly clear chat history on logout
    setNotifications([])

    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
      sessionStorage.removeItem('chatMessages')
    }
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
      toast.error(`Database Error: ${error.message}`)
      throw error
    }

    if (data.user) {
      const avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email
      
      // Insert to our users table upon registration
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        name: data.user.user_metadata?.name || name || email.split('@')[0],
        email: data.user.email || email,
        avatar: avatar,
        is_demo_user: false
      })
      if (insertError) console.error('Supabase Error:', insertError)

      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || name || email.split('@')[0],
        email: data.user.email || email,
        avatar: avatar,
        isDemoUser: false,
        showSocialCues: true,
      })
      setIsDemoMode(false)
      setIsPremium(false)
      setGoals([])
      setReminders([])
      setChatMessages([]) // Clear chat history for fresh registration session
      setNotifications([])

      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatMessages')
        sessionStorage.removeItem('chatMessages')
      }
      toast.success('Account created successfully!')
      setCurrentPage('dashboard')
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError.message)
      toast.error(`Database Error: ${authError.message}`)
      throw authError
    }

    if (authData.user) {
      // Check if user exists in the users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      let userName = authData.user.user_metadata?.name || email.split('@')[0]
      let userAvatar = authData.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email

      if (!profile) {
        // Insert user profile into the users table if not exists
        const { error: insertError } = await supabase.from('users').insert({
          id: authData.user.id,
          name: userName,
          email: authData.user.email || email,
          avatar: userAvatar,
          is_demo_user: false
        })
        if (insertError) console.error('Supabase Error:', insertError)
      } else {
        userName = profile.name || userName
        userAvatar = profile.avatar || userAvatar
      }

      const showSocialCues = profile?.show_social_cues !== false // default true
      const userTheme = profile?.theme ?? 'dark'
      const userAccent = profile?.accent_color ?? 'sky-blue'
      applyUserTheme(userTheme, userAccent)

      setUser({
        id: authData.user.id,
        name: userName,
        email: authData.user.email || email,
        avatar: userAvatar,
        isDemoUser: false,
        showSocialCues,
        theme: userTheme,
        accentColor: userAccent,
      })

      // Fetch existing goals
      const { data: fetchedGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false })

      if (fetchedGoals) {
        setGoals(fetchedGoals.map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          category: g.category,
          progress: g.progress,
          etcDays: g.etc_days,
          color: g.color,
          subGoals: g.sub_goals || [],
          createdAt: g.created_at,
          targetDate: g.target_date,
          priority: g.priority,
          difficulty: g.difficulty,
          obstacles: g.obstacles,
          motivation: g.motivation,
        })))
      } else {
        setGoals([])
      }

      // Fetch existing reminders
      const { data: fetchedReminders } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', authData.user.id)

      if (fetchedReminders) {
        setReminders(fetchedReminders.map(r => ({
          id: r.id,
          title: r.title,
          message: r.message,
          scheduledDate: r.scheduled_date,
          scheduledTime: r.scheduled_time,
          repeat: r.repeat,
          isActive: r.is_active
        })))
      } else {
        setReminders([])
      }

      setIsDemoMode(false)
      setIsPremium(false)
      setChatMessages([]) // Clear chat history for fresh login session
      setNotifications([])

      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatMessages')
        sessionStorage.removeItem('chatMessages')
      }
      toast.success('Welcome back!')
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

    if (isDemoMode) {
      setGoals(prev => [{
        id: 'demo-goal-' + Date.now(),
        title: goal.title,
        description: goal.description,
        category: goal.category,
        progress: goal.progress,
        etcDays: goal.etcDays,
        color: goal.color,
        subGoals: goal.subGoals,
        createdAt: new Date().toISOString(),
        targetDate: goal.targetDate,
        priority: goal.priority,
        difficulty: goal.difficulty,
        obstacles: goal.obstacles,
        motivation: goal.motivation,
      }, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase.from('goals').insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        progress: goal.progress,
        etc_days: goal.etcDays,
        color: goal.color,
        sub_goals: goal.subGoals,
        target_date: goal.targetDate || null,
        priority: goal.priority || null,
        difficulty: goal.difficulty || null,
        obstacles: goal.obstacles || null,
        motivation: goal.motivation || null,
      }).select().single();

      if (error) {
        console.error('Supabase Error:', error);
        toast.error(`Database Error: ${error.message}`);
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
          createdAt: data.created_at,
          targetDate: data.target_date,
          priority: data.priority,
          difficulty: data.difficulty,
          obstacles: data.obstacles,
          motivation: data.motivation,
        }, ...prev]);
        toast.success("Goal added successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [user, isDemoMode])

  const updateGoalProgress = useCallback(async (id: string, progress: number) => {
    try {
      const { error } = await supabase.from('goals').update({ progress }).eq('id', id);
      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, progress } : g));
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [])

  const deleteGoal = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else {
        setGoals(prev => prev.filter(g => g.id !== id));
        toast.success("Goal deleted successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [])

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    try {
      const dbUpdates: any = { ...updates }
      if (updates.etcDays !== undefined) { dbUpdates.etc_days = updates.etcDays; delete dbUpdates.etcDays }
      if (updates.subGoals !== undefined) { dbUpdates.sub_goals = updates.subGoals; delete dbUpdates.subGoals }
      if (updates.targetDate !== undefined) { dbUpdates.target_date = updates.targetDate; delete dbUpdates.targetDate }
      if (updates.createdAt !== undefined) { delete dbUpdates.createdAt }

      const { error } = await supabase.from('goals').update(dbUpdates).eq('id', id);
      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        toast.success("Goal updated successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      }).eq('id', goalId).then(({ error }) => {
        if (error) {
          toast.error(`Database Error: ${error.message}`);
        }
      });

      return prev.map(g => g.id === goalId ? { ...g, subGoals: updatedSubGoals, progress: newProgress } : g)
    })
  }, [])

  const addReminder = useCallback(async (reminder: Omit<Reminder, 'id'>) => {
    if (!user) return;

    if (isDemoMode) {
      setReminders(prev => [{
        id: 'demo-reminder-' + Date.now(),
        ...reminder
      }, ...prev]);
      return;
    }

    try {
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
        console.error('Supabase Error:', error);
        toast.error(`Database Error: ${error.message}`);
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
        }, ...prev]);
        toast.success("Reminder added successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [user, isDemoMode])

  const toggleReminder = useCallback(async (id: string) => {
    setReminders(prev => {
      const reminder = prev.find(r => r.id === id)
      if (!reminder) return prev
      
      const newIsActive = !reminder.isActive
      supabase.from('reminders').update({ is_active: newIsActive }).eq('id', id).then(({ error }) => {
        if (error) {
          toast.error(`Database Error: ${error.message}`);
        } else {
          toast.success(`Reminder ${newIsActive ? 'enabled' : 'disabled'}`);
        }
      });

      return prev.map(r => r.id === id ? { ...r, isActive: newIsActive } : r)
    })
  }, [])

  const deleteReminder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id)
      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else {
        setReminders(prev => prev.filter(r => r.id !== id));
        toast.success("Reminder deleted successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [])

  const updateReminder = useCallback(async (id: string, updates: Partial<Reminder>) => {
    try {
      const dbUpdates: any = { ...updates }
      if (updates.scheduledDate !== undefined) { dbUpdates.scheduled_date = updates.scheduledDate; delete dbUpdates.scheduledDate }
      if (updates.scheduledTime !== undefined) { dbUpdates.scheduled_time = updates.scheduledTime; delete dbUpdates.scheduledTime }
      if (updates.isActive !== undefined) { dbUpdates.is_active = updates.isActive; delete dbUpdates.isActive }

      const { error } = await supabase.from('reminders').update(dbUpdates).eq('id', id)
      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        toast.success("Reminder updated successfully!");
      }
    } catch (err) {
      toast.error(`Database Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [])

  const addTicker = useCallback((ticker: NewsTicker) => {
    setTickers(prev => [ticker, ...prev])
  }, [])

  const removeTicker = useCallback((id: string) => {
    setTickers(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearChatMessages = useCallback(() => {
    setChatMessages([])
  }, [])

  const incrementAiCalls = useCallback(async () => {
    try {
      const { data } = await supabase.from('app_settings').select('total_ai_calls').eq('id', 1).single()
      await supabase.from('app_settings').update({ total_ai_calls: (data?.total_ai_calls || 0) + 1 }).eq('id', 1)
    } catch (err) {
      console.error('Failed to increment AI calls:', err)
    }
  }, [])

  const updateUserProfile = useCallback(async (updates: { name?: string; email?: string; password?: string }) => {
    try {
      // Update Supabase Auth (email/password)
      if (updates.email || updates.password) {
        const authUpdates: any = {}
        if (updates.email) authUpdates.email = updates.email
        if (updates.password) authUpdates.password = updates.password
        const { error } = await supabase.auth.updateUser(authUpdates)
        if (error) throw error
      }

      // Update our users table (name)
      if (updates.name && user) {
        const { error } = await supabase.from('users').update({ name: updates.name }).eq('id', user.id)
        if (error) throw error
      }

      // Update local state
      setUser(prev => prev ? {
        ...prev,
        ...(updates.name && { name: updates.name }),
        ...(updates.email && { email: updates.email }),
      } : null)

      toast.success('Profile updated successfully!')
    } catch (err: any) {
      toast.error(`Profile update failed: ${err.message}`)
      throw err
    }
  }, [user])

  const toggleSocialCues = useCallback(async () => {
    if (!user) return
    const newValue = !(user.showSocialCues !== false)
    try {
      if (!isDemoMode) {
        const { error } = await supabase.from('users').update({ show_social_cues: newValue }).eq('id', user.id)
        if (error) throw error
      }
      setUser(prev => prev ? { ...prev, showSocialCues: newValue } : null)
      toast.success(newValue ? 'Social cues enabled' : 'Social cues disabled')
    } catch (err: any) {
      toast.error(`Failed to update preference: ${err.message}`)
    }
  }, [user, isDemoMode])

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const now = new Date();
      // Calculate local YYYY-MM-DD
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const localDate = `${y}-${m}-${d}`;

      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;

      setNotifications(prev => {
        let triggeredAny = false;
        const newNotifs: AppNotification[] = [];

        reminders.forEach(reminder => {
          if (!reminder.isActive) return;

          const reminderTimeFormatted = reminder.scheduledTime?.substring(0, 5);
          const isMatch = (reminder.scheduledDate === localDate && reminderTimeFormatted === currentTime);
          // prevent duplicate triggers within the same minute for the same reminder
          const alreadyTriggered = prev.some(n => 
            n.id.startsWith(reminder.id) && n.time.includes(localDate) && n.time.includes(currentTime)
          );

          if (isMatch && !alreadyTriggered) {
            triggeredAny = true;
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Reminder', { body: reminder.title });
            }

            newNotifs.push({
              id: `${reminder.id}-${Date.now()}`,
              title: 'Reminder',
              message: reminder.title,
              time: now.toISOString(),
              read: false
            });

            toast.info(`Reminder: ${reminder.title}`);
          }
        });

        if (triggeredAny) {
          return [...newNotifs, ...prev];
        }
        return prev;
      });

    }, 60000);

    return () => clearInterval(interval);
  }, [user, reminders]);

  const updateUserTheme = useCallback(async (theme: string, accentColor: string) => {
    applyUserTheme(theme, accentColor)
    setUser(prev => prev ? { ...prev, theme, accentColor } : null)
    if (user && !user.isDemoMode) {
      try {
        await supabase.from('users').update({ theme, accent_color: accentColor }).eq('id', user.id)
      } catch (err) {
        console.error('Failed to persist theme:', err)
      }
    }
  }, [user])

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
      login,
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
      chatMessages,
      setChatMessages,
      clearChatMessages,
      notifications,
      setNotifications,
      incrementAiCalls,
      updateUserProfile,
      toggleSocialCues,
      updateUserTheme,
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
