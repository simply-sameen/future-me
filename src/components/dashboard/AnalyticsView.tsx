import { useMemo } from 'react'
import { Lock, Zap, TrendingUp, Target, CircleCheck as CheckCircle2, ChartBar as BarChart3 } from 'lucide-react'
import { Button } from '../ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { useApp } from '../../contexts/AppContext'
import type { ChartConfig } from '../ui/chart'

const velocityConfig: ChartConfig = {
  velocity:       { label: 'Velocity Score',   color: 'var(--user-accent)' },
  goalsCompleted: { label: 'Goals Completed',  color: 'var(--user-accent)' },
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl p-5 card-flat">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: 'var(--user-accent)' }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  )
}

function LockedOverlay({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl"
      style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
        style={{
          background: 'color-mix(in srgb, var(--user-accent) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--user-accent) 30%, transparent)',
        }}
      >
        <Lock className="w-8 h-8" style={{ color: 'var(--user-accent)' }} />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Premium Feature</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-5">
        Unlock detailed velocity tracking, ETC charts, and goal insights.
      </p>
      <Button
        onClick={onUnlock}
        className="btn-primary border-none h-10 px-6 font-bold"
      >
        <Zap className="w-4 h-4 mr-1.5" />
        Activate Premium
      </Button>
    </div>
  )
}

export function AnalyticsView() {
  const { isPremium, togglePremium, goals } = useApp()

  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0

  const completedSubGoals = goals.reduce((sum, g) => sum + g.subGoals.filter(sg => sg.completed).length, 0)
  const totalSubGoals = goals.reduce((sum, g) => sum + g.subGoals.length, 0)

  const velocityScore = useMemo(() => {
    if (goals.length === 0) return 0
    const totalWeightedProgress = goals.reduce((sum, g) => {
      const difficultyWeight = g.difficulty || 3
      return sum + (g.progress * difficultyWeight)
    }, 0)
    const totalWeight = goals.reduce((sum, g) => sum + (g.difficulty || 3), 0)
    return Math.round(totalWeightedProgress / totalWeight)
  }, [goals])

  const etcAccuracy = useMemo(() => {
    if (goals.length === 0) return 0
    const onTrack = goals.filter(g => {
      if (!g.createdAt || g.etcDays <= 0) return false
      const created = new Date(g.createdAt).getTime()
      const elapsed = (Date.now() - created) / (1000 * 60 * 60 * 24)
      const expectedProgress = Math.min(100, (elapsed / g.etcDays) * 100)
      return g.progress >= expectedProgress * 0.7
    }).length
    return Math.round((onTrack / goals.length) * 100)
  }, [goals])

  const chartData = useMemo(() => {
    if (goals.length === 0) {
      const data = []
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        data.push({ month: MONTH_NAMES[d.getMonth()], velocity: 0, goalsCompleted: 0 })
      }
      return data
    }

    const monthMap: Record<string, { totalProgress: number; count: number; completed: number }> = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      monthMap[key] = { totalProgress: 0, count: 0, completed: 0 }
    }

    goals.forEach(g => {
      const created = new Date(g.createdAt)
      const key = `${created.getFullYear()}-${created.getMonth()}`
      if (!monthMap[key]) {
        monthMap[key] = { totalProgress: 0, count: 0, completed: 0 }
      }
      monthMap[key].totalProgress += g.progress
      monthMap[key].count += 1
      if (g.progress === 100) {
        monthMap[key].completed += 1
      }
    })

    return Object.entries(monthMap)
      .sort(([a], [b]) => {
        const [ay, am] = a.split('-').map(Number)
        const [by, bm] = b.split('-').map(Number)
        return ay !== by ? ay - by : am - bm
      })
      .slice(-6)
      .map(([key, val]) => {
        const [, m] = key.split('-').map(Number)
        return {
          month: MONTH_NAMES[m],
          velocity: val.count > 0 ? Math.round(val.totalProgress / val.count) : 0,
          goalsCompleted: val.completed,
        }
      })
  }, [goals])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
            {isPremium ? (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--user-accent) 15%, transparent)',
                  color: 'var(--user-accent)',
                  border: '1px solid color-mix(in srgb, var(--user-accent) 30%, transparent)',
                }}
              >
                PREMIUM
              </span>
            ) : (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
              >
                LOCKED
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Velocity tracking · ETC analysis · Goal insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg Progress"   value={`${avgProgress}%`}       sub="across all goals" />
        <StatCard label="Sub-Goals Done" value={`${completedSubGoals}`}   sub={`of ${totalSubGoals} total`} />
        <StatCard label="Velocity Score" value={`${velocityScore}`}        sub={goals.length > 0 ? 'difficulty-weighted' : 'no goals yet'} />
        <StatCard label="ETC Accuracy"   value={`${etcAccuracy}%`}        sub={goals.length > 0 ? 'on-track rate' : 'no goals yet'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="relative rounded-xl p-5 overflow-hidden card-flat">
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
            <h4 className="text-sm font-bold text-foreground">Velocity Trend</h4>
          </div>
          <ChartContainer config={velocityConfig} className="h-48 w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--user-accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--user-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="velocity" stroke="var(--user-accent)" strokeWidth={2} fill="url(#velocityGrad)" />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="relative rounded-xl p-5 overflow-hidden card-flat">
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
            <h4 className="text-sm font-bold text-foreground">Goals Completed / Month</h4>
          </div>
          <ChartContainer config={velocityConfig} className="h-48 w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="goalsCompleted" fill="var(--user-accent)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="relative rounded-xl p-5 overflow-hidden lg:col-span-2 card-flat">
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
            <h4 className="text-sm font-bold text-foreground">Goal Progress Breakdown</h4>
          </div>
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground font-medium truncate pr-4">{goal.title}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">ETC: {goal.etcDays}d</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--user-accent)' }}>{goal.progress}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${goal.progress}%`,
                      background: 'var(--user-accent)',
                      transition: 'width 1s ease-out',
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {goal.subGoals.map(sg => (
                    <div
                      key={sg.id}
                      className="w-2 h-2 rounded-sm"
                      style={{ background: sg.completed ? 'var(--user-accent)' : 'var(--border)' }}
                      title={sg.title}
                    />
                  ))}
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">No goals to analyze yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
