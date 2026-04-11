import { useState } from 'react'
import { Users, DollarSign, Server, Target, Bell, ArrowLeft, Send, TriangleAlert as AlertTriangle, Heart, Users as Users2, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useApp } from '../contexts/AppContext'
import { ADMIN_METRICS } from '../data/mockData'
import type { TickerCategory, NewsTicker } from '../types'
import type { ChartConfig } from '../components/ui/chart'

const growthData = [
  { month: 'Jul', users: 320 },
  { month: 'Aug', users: 580 },
  { month: 'Sep', users: 740 },
  { month: 'Oct', users: 890 },
  { month: 'Nov', users: 1050 },
  { month: 'Dec', users: 1247 },
]

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
  const { navigateTo, isDemoMode, goals, reminders, tickers, addTicker, removeTicker } = useApp()
  const [tickerMessage, setTickerMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TickerCategory>('community')
  const [published, setPublished] = useState(false)

  const metrics = isDemoMode ? ADMIN_METRICS : {
    totalUsers: 1,
    mrr: 0,
    serverCosts: 50,
    activeGoals: goals.length,
    remindersScheduled: reminders.length,
  }

  const aiTokenUsageThisMonth = 0

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

  const profit = metrics.mrr - metrics.serverCosts

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
          <MetricCard icon={Users} label="Total Users" value={metrics.totalUsers} sub="+12% this month" color="#FF69B4" />
          <MetricCard icon={DollarSign} label="Monthly Revenue" value={metrics.mrr} sub="$1/user/mo" color="#89CFF0" prefix="$" />
          <MetricCard icon={Server} label="Server Costs" value={metrics.serverCosts} sub="AWS + hosting" color="#f97316" prefix="$" />
          <MetricCard icon={Target} label="Active Goals" value={metrics.activeGoals} sub="across all users" color="#86efac" />
          <MetricCard icon={Bell} label="Reminders" value={metrics.remindersScheduled} sub="scheduled total" color="#c084fc" />
          <MetricCard
            icon={Zap}
            label="AI Tokens Used"
            value={Math.floor((aiTokenUsageThisMonth / 1500000) * 100)}
            sub="of 1.5M free/month"
            color="#fbbf24"
            prefix=""
          />
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
                +289% YoY
              </Badge>
            </div>
            <ChartContainer config={growthConfig} className="h-52 w-full">
              <AreaChart data={growthData}>
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
              { label: 'AI Token Usage', value: `${Math.floor((aiTokenUsageThisMonth / 1500000) * 100)}%`, color: '#fbbf24' },
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
                {Math.round((profit / metrics.mrr) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6"
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
              <p className="text-xs text-muted-foreground">Publish news tickers to the user dashboard</p>
            </div>
          </div>

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

        <p className="text-center text-xs text-muted-foreground mt-8">
          Built by <span className="text-neon-pink font-semibold">Divya and Team</span> · Future Me Platform v1.0
        </p>
      </div>
    </div>
  )
}
