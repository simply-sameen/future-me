import { useState, useEffect } from 'react'
import { Users, DollarSign, Server, Target, Bell, ArrowLeft, Send, TriangleAlert as AlertTriangle, Heart, Users as Users2, Sparkles, TrendingUp, Zap, Bug } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabaseClient'
import { THEME_PRESETS } from '../lib/themes'
import { toast } from 'sonner'
import type { TickerCategory, NewsTicker } from '../types'
import type { ChartConfig } from '../components/ui/chart'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const growthConfig: ChartConfig = {
  users: { label: 'Users', color: '#FF69B4' },
}

const CATEGORY_OPTIONS: { id: TickerCategory; label: string; icon: typeof AlertTriangle; color: string }[] = [
  { id: 'missing-person', label: 'Missing Person', icon: AlertTriangle, color: '#FF69B4' },
  { id: 'help-a-life', label: 'Help a Life', icon: Heart, color: '#89CFF0' },
  { id: 'community', label: 'Community', icon: Users2, color: '#86efac' },
]

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  prefix = '',
}: {
  icon: typeof Users
  label: string
  value: number
  sub: string
  color: string
  prefix?: string
}) {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 group"
      style={{ background: '#0A0A0A', border: `1px solid ${color}25` }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${color}15`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-black text-foreground mb-0.5">
        {prefix}{value.toLocaleString()}
      </p>
      <p className="text-xs font-semibold text-foreground/70">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  )
}

export function AdminPage() {
  const { navigateTo, isDemoMode, goals, reminders, tickers, addTicker, removeTicker, themePreset, glowEnabled, setAppTheme, setAppGlow } = useApp()
  const [tickerMessage, setTickerMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TickerCategory>('community')
  const [published, setPublished] = useState(false)

  // Supabase-driven state
  const [appSettings, setAppSettings] = useState<{ social_cue: string; total_ai_calls: number } | null>(null)
  const [socialCueInput, setSocialCueInput] = useState('')
  const [totalUsers, setTotalUsers] = useState(0)
  const [userGrowthData, setUserGrowthData] = useState<{ month: string; users: number }[]>([])
  const [isSavingCue, setIsSavingCue] = useState(false)

  // Fetch app_settings and user data on mount
  useEffect(() => {
    async function fetchAdminData() {
      try {
        // Fetch app_settings
        const { data: settings } = await supabase
          .from('app_settings')
          .select('social_cue, total_ai_calls')
          .eq('id', 1)
          .single()

        if (settings) {
          setAppSettings(settings)
          setSocialCueInput(settings.social_cue || '')
        }

        // Fetch users for count and growth graph
        const { data: users } = await supabase
          .from('users')
          .select('id, created_at')

        if (users) {
          setTotalUsers(users.length)

          // Group users by month for growth chart (cumulative)
          const monthMap: Record<string, number> = {}
          const now = new Date()
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = `${d.getFullYear()}-${d.getMonth()}`
            monthMap[key] = 0
          }

          users.forEach(u => {
            const created = new Date(u.created_at)
            const key = `${created.getFullYear()}-${created.getMonth()}`
            if (monthMap[key] !== undefined) {
              monthMap[key] += 1
            }
          })

          // Build cumulative growth
          let cumulative = 0
          const sortedEntries = Object.entries(monthMap).sort(([a], [b]) => {
            const [ay, am] = a.split('-').map(Number)
            const [by, bm] = b.split('-').map(Number)
            return ay !== by ? ay - by : am - bm
          })

          // Count users from before our window
          const earliestKey = sortedEntries[0]?.[0]
          if (earliestKey) {
            const [ey, em] = earliestKey.split('-').map(Number)
            const earliestDate = new Date(ey, em, 1)
            cumulative = users.filter(u => new Date(u.created_at) < earliestDate).length
          }

          const growthData = sortedEntries.map(([key, count]) => {
            cumulative += count
            const [, m] = key.split('-').map(Number)
            return { month: MONTH_NAMES[m], users: cumulative }
          })

          setUserGrowthData(growthData)
        }
      } catch (err) {
        console.error('Admin data fetch error:', err)
      }
    }

    if (!isDemoMode) {
      fetchAdminData()
    } else {
      // Demo mode defaults
      setTotalUsers(1247)
      setAppSettings({ social_cue: 'Welcome to Future Me!', total_ai_calls: 42 })
      setSocialCueInput('Welcome to Future Me!')
      setUserGrowthData([
        { month: 'Jul', users: 320 },
        { month: 'Aug', users: 580 },
        { month: 'Sep', users: 740 },
        { month: 'Oct', users: 890 },
        { month: 'Nov', users: 1050 },
        { month: 'Dec', users: 1247 },
      ])
    }
  }, [isDemoMode])

  const handleSaveSocialCue = async () => {
    if (isDemoMode) {
      setAppSettings(prev => prev ? { ...prev, social_cue: socialCueInput } : null)
      toast.success('Social cue updated (demo mode)')
      return
    }
    setIsSavingCue(true)
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ social_cue: socialCueInput })
        .eq('id', 1)
      if (error) throw error
      setAppSettings(prev => prev ? { ...prev, social_cue: socialCueInput } : null)
      toast.success('Social cue saved to database!')
    } catch (err) {
      toast.error('Failed to save social cue')
    } finally {
      setIsSavingCue(false)
    }
  }

  const aiCallsCount = appSettings?.total_ai_calls || 0

  const handlePublish = () => {
    if (!tickerMessage.trim()) return
    const newTicker: NewsTicker = {
      id: `ticker-${Date.now()}`,
      message: tickerMessage,
      category: selectedCategory,
      isActive: true,
      publishedAt: new Date().toISOString(),
    }
    addTicker(newTicker)
    setTickerMessage('')
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  const serverCosts = 50
  const mrr = isDemoMode ? 1247 : 0
  const profit = mrr - serverCosts

  const triggerTestToast = () => {
    toast.success('Test Toast Successful!')
  }

  const triggerTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Debug Mode', { body: 'Test Notification Successful!' })
      toast.success('Native notification triggered!')
    } else {
      toast.error('Notification permission denied or unavailable.')
    }
  }

  return (
    <div
      className="min-h-screen p-6 grid-pattern"
      style={{ background: '#141414' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: '#0A0A0A', border: '1px solid #262626' }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF69B4, #89CFF0)' }}
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <h1 className="text-2xl font-black text-foreground">Admin Dashboard</h1>
                <Badge
                  className="text-xs border-none"
                  style={{ background: 'rgba(255,105,180,0.15)', color: '#FF69B4' }}
                >
                  Internal
                </Badge>
                <Badge
                  className="text-xs border-none"
                  style={{ background: isDemoMode ? 'rgba(137,207,240,0.15)' : 'rgba(134,239,172,0.15)', color: isDemoMode ? '#89CFF0' : '#86efac' }}
                >
                  {isDemoMode ? 'Demo Mode' : 'Live Data'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Future Me · Platform Analytics & Controls</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Profit this month</p>
            <p className="text-xl font-black" style={{ color: '#86efac' }}>
              ${profit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard icon={Users} label="Total Users" value={totalUsers} sub={isDemoMode ? '+12% this month' : 'live count'} color="#FF69B4" />
          <MetricCard icon={DollarSign} label="Monthly Revenue" value={mrr} sub="$1/user/mo" color="#89CFF0" prefix="$" />
          <MetricCard icon={Server} label="Server Costs" value={serverCosts} sub="AWS + hosting" color="#f97316" prefix="$" />
          <MetricCard icon={Target} label="Active Goals" value={goals.length} sub="across all users" color="#86efac" />
          <MetricCard icon={Bell} label="Reminders" value={reminders.length} sub="scheduled total" color="#c084fc" />
          <MetricCard icon={Zap} label="AI Calls" value={aiCallsCount} sub="total requests" color="#fbbf24" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 mb-8">
          <div
            className="rounded-xl p-5"
            style={{ background: '#0A0A0A', border: '1px solid #262626' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-neon-pink" />
              <h3 className="font-bold text-foreground">User Growth</h3>
              <Badge
                className="text-xs border-none ml-auto"
                style={{ background: 'rgba(134,239,172,0.15)', color: '#86efac' }}
              >
                {totalUsers} total
              </Badge>
            </div>
            <ChartContainer config={growthConfig} className="h-52 w-full">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF69B4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="users" stroke="#FF69B4" strokeWidth={2} fill="url(#userGrad)" />
              </AreaChart>
            </ChartContainer>
          </div>

          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: '#0A0A0A', border: '1px solid #262626' }}
          >
            <h3 className="font-bold text-foreground">Quick Stats</h3>

            {[
              { label: 'Free Users', value: isDemoMode ? '81%' : '100%', color: '#888' },
              { label: 'Premium Users', value: isDemoMode ? '19%' : '0%', color: '#FF69B4' },
              { label: 'Conversion Rate', value: isDemoMode ? '19%' : '0%', color: '#89CFF0' },
              { label: 'Avg Goals/User', value: isDemoMode ? '3.1' : ((goals.length > 0 ? goals.length : 0).toString()), color: '#86efac' },
              { label: 'AI API Calls', value: aiCallsCount.toString(), color: '#fbbf24' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid #1A1A1A' }}
              >
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}

            <div
              className="rounded-lg p-3 text-center"
              style={{ background: 'rgba(255,105,180,0.05)', border: '1px solid rgba(255,105,180,0.2)' }}
            >
              <p className="text-xs text-muted-foreground">Net Profit Margin</p>
              <p className="text-2xl font-black" style={{ color: '#86efac' }}>
                {mrr > 0 ? Math.round((profit / mrr) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Social Cue Broadcaster — Supabase Connected */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: '#0A0A0A', border: '1px solid #262626' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,105,180,0.15)', border: '1px solid rgba(255,105,180,0.3)' }}
            >
              <Send className="w-5 h-5 text-neon-pink" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Social Cue Broadcaster</h3>
              <p className="text-xs text-muted-foreground">Publish news tickers & persist the social cue to Supabase</p>
            </div>
          </div>

          {/* Persistent Social Cue */}
          <div className="mb-5 p-4 rounded-lg" style={{ background: '#141414', border: '1px solid #262626' }}>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Global Social Cue (Saved to DB)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter the global social cue message..."
                value={socialCueInput}
                onChange={e => setSocialCueInput(e.target.value)}
                className="border-border bg-input text-foreground placeholder:text-muted-foreground h-10 flex-1"
              />
              <Button
                onClick={handleSaveSocialCue}
                disabled={isSavingCue || socialCueInput === (appSettings?.social_cue || '')}
                className="h-10 px-4 font-bold btn-neon-blue border-none disabled:opacity-50 text-sm"
              >
                {isSavingCue ? 'Saving...' : 'Save'}
              </Button>
            </div>
            {appSettings?.social_cue && (
              <p className="text-xs text-muted-foreground mt-2">
                Current: <span className="text-foreground/70">{appSettings.social_cue}</span>
              </p>
            )}
          </div>

          {/* Ticker Publisher */}
          <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Ticker Message
              </label>
              <Input
                placeholder="Type your announcement or alert message..."
                value={tickerMessage}
                onChange={e => setTickerMessage(e.target.value)}
                className="border-border bg-input text-foreground placeholder:text-muted-foreground h-10"
                onKeyDown={e => e.key === 'Enter' && handlePublish()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="flex gap-2">
                {CATEGORY_OPTIONS.map(cat => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all h-10"
                      style={{
                        background: selectedCategory === cat.id ? `${cat.color}20` : '#141414',
                        border: `1px solid ${selectedCategory === cat.id ? `${cat.color}50` : '#262626'}`,
                        color: selectedCategory === cat.id ? cat.color : '#888',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePublish}
              disabled={!tickerMessage.trim()}
              className="h-10 px-6 font-bold btn-neon-pink border-none disabled:opacity-50 flex items-center gap-2"
            >
              {published ? (
                <>
                  <span>✓ Published!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish to Dashboard</span>
                </>
              )}
            </Button>
            {tickers.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {tickers.length} active ticker{tickers.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {tickers.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Tickers</p>
              {tickers.map(ticker => {
                const catConfig = CATEGORY_OPTIONS.find(c => c.id === ticker.category)
                const Icon = catConfig?.icon ?? AlertTriangle
                return (
                  <div
                    key={ticker.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: '#141414', border: '1px solid #262626' }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: catConfig?.color ?? '#888' }} />
                    <p className="text-xs text-muted-foreground flex-1 truncate">{ticker.message}</p>
                    <button
                      onClick={() => removeTicker(ticker.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Theme Customizer */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: '#0A0A0A', border: '1px solid rgba(168,85,247,0.2)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--neon-primary), var(--neon-secondary))', opacity: 0.9 }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Theme Customizer</h3>
              <p className="text-xs text-muted-foreground">Choose a preset theme for the entire platform</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {THEME_PRESETS.map(preset => {
              const isActive = themePreset === preset.id
              return (
                <button
                  key={preset.id}
                  onClick={async () => {
                    setAppTheme(preset.id)
                    if (!isDemoMode) {
                      try {
                        await supabase.from('app_settings').update({ theme_preset: preset.id }).eq('id', 1)
                        toast.success(`Theme: ${preset.name}`)
                      } catch { toast.error('Failed to save theme') }
                    } else {
                      toast.success(`Theme: ${preset.name} (demo)`)
                    }
                  }}
                  className="relative rounded-xl p-3 text-center transition-all duration-300 group"
                  style={{
                    background: preset.surface,
                    border: isActive ? `2px solid ${preset.primary}` : '2px solid #262626',
                    boxShadow: isActive ? `0 0 20px ${preset.primary}30` : 'none',
                  }}
                >
                  <div className="flex justify-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ background: preset.primary }} />
                    <div className="w-6 h-6 rounded-full" style={{ background: preset.secondary }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: isActive ? preset.primary : '#888' }}>
                    {preset.name}
                  </p>
                  {isActive && (
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ background: preset.primary, color: preset.surface }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Glow Toggle */}
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ background: '#141414', border: '1px solid #262626' }}
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" style={{ color: glowEnabled ? 'var(--neon-primary)' : '#555' }} />
              <div>
                <p className="text-sm font-medium text-foreground">Neon Glows</p>
                <p className="text-xs text-muted-foreground">Toggle box-shadow effects globally</p>
              </div>
            </div>
            <button
              onClick={async () => {
                const newVal = !glowEnabled
                setAppGlow(newVal)
                if (!isDemoMode) {
                  try {
                    await supabase.from('app_settings').update({ glow_enabled: newVal }).eq('id', 1)
                    toast.success(newVal ? 'Glows enabled' : 'Glows disabled')
                  } catch { toast.error('Failed to save glow setting') }
                } else {
                  toast.success(newVal ? 'Glows enabled (demo)' : 'Glows disabled (demo)')
                }
              }}
              className="relative w-11 h-6 rounded-full transition-colors duration-200"
              style={{
                background: glowEnabled ? 'color-mix(in srgb, var(--neon-primary) 40%, transparent)' : '#262626',
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                style={{
                  background: glowEnabled ? 'var(--neon-primary)' : '#555',
                  transform: glowEnabled ? 'translateX(22px)' : 'translateX(2px)',
                }}
              />
            </button>
          </div>
        </div>

        {/* System Debug Section */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: '#0A0A0A', border: '1px solid rgba(251,191,36,0.2)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}
            >
              <Bug className="w-5 h-5" style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">System Debug</h3>
              <p className="text-xs text-muted-foreground">Test internal systems — toast notifications & browser alerts</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={triggerTestToast}
              className="h-10 px-5 font-bold border-none text-sm"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Test Toast
            </Button>
            <Button
              onClick={triggerTestNotification}
              className="h-10 px-5 font-bold border-none text-sm"
              style={{ background: 'rgba(137,207,240,0.15)', color: '#89CFF0', border: '1px solid rgba(137,207,240,0.3)' }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Test Notification
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Built by <span className="text-neon-pink font-semibold">Divya and Team</span> · Future Me Platform v1.0
        </p>
      </div>
    </div>
  )
}
