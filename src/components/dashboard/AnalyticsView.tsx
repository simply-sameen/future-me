import { Lock, Zap, TrendingUp, Target, CircleCheck as CheckCircle2, ChartBar as BarChart3 } from 'lucide-react'
import { Button } from '../ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { useApp } from '../../contexts/AppContext'
import { ANALYTICS_DATA } from '../../data/mockData'
import type { ChartConfig } from '../ui/chart'

const velocityConfig: ChartConfig = {
  velocity: { label: 'Velocity Score', color: '#FF69B4' },
  goalsCompleted: { label: 'Goals Completed', color: '#89CFF0' },
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-300"
      style={{
        background: '#0A0A0A',
        border: `1px solid ${color}25`,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}15`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
    >
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
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
        style={{ background: 'rgba(255,105,180,0.1)', border: '1px solid rgba(255,105,180,0.3)' }}
      >
        <Lock className="w-8 h-8 text-neon-pink" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Premium Feature</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-5">
        Unlock detailed velocity tracking, ETC charts, and goal insights.
      </p>
      <Button
        onClick={onUnlock}
        className="btn-neon-pink border-none h-10 px-6 font-bold pulse-glow-pink"
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
            {isPremium ? (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,105,180,0.15)', color: '#FF69B4', border: '1px solid rgba(255,105,180,0.3)' }}
              >
                PREMIUM
              </span>
            ) : (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#888', border: '1px solid #262626' }}
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
        <StatCard label="Avg Progress" value={`${avgProgress}%`} sub="across all goals" color="#FF69B4" />
        <StatCard label="Sub-Goals Done" value={`${completedSubGoals}`} sub={`of ${totalSubGoals} total`} color="#89CFF0" />
        <StatCard label="Velocity Score" value="78" sub="+12 this month" color="#86efac" />
        <StatCard label="ETC Accuracy" value="91%" sub="prediction match" color="#f9a8d4" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div
          className="relative rounded-xl p-5 overflow-hidden"
          style={{ background: '#0A0A0A', border: '1px solid #262626' }}
        >
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-neon-pink" />
            <h4 className="text-sm font-bold text-foreground">Velocity Trend</h4>
          </div>
          <ChartContainer config={velocityConfig} className="h-48 w-full">
            <AreaChart data={ANALYTICS_DATA}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF69B4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="velocity"
                stroke="#FF69B4"
                strokeWidth={2}
                fill="url(#velocityGrad)"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div
          className="relative rounded-xl p-5 overflow-hidden"
          style={{ background: '#0A0A0A', border: '1px solid #262626' }}
        >
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-neon-blue" />
            <h4 className="text-sm font-bold text-foreground">Goals Completed / Month</h4>
          </div>
          <ChartContainer config={velocityConfig} className="h-48 w-full">
            <BarChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="goalsCompleted" fill="#89CFF0" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        <div
          className="relative rounded-xl p-5 overflow-hidden lg:col-span-2"
          style={{ background: '#0A0A0A', border: '1px solid #262626' }}
        >
          {!isPremium && <LockedOverlay onUnlock={togglePremium} />}
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-neon-pink" />
            <h4 className="text-sm font-bold text-foreground">Goal Progress Breakdown</h4>
          </div>
          <div className="space-y-4">
            {goals.map(goal => {
              const colors = { pink: '#FF69B4', blue: '#89CFF0', green: '#86efac' }
              const color = colors[goal.color]
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground font-medium truncate pr-4">{goal.title}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">ETC: {goal.etcDays}d</span>
                      <span className="text-sm font-bold" style={{ color }}>{goal.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#1A1A1A' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${goal.progress}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        boxShadow: `0 0 8px ${color}50`,
                        transition: 'width 1s ease-out',
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {goal.subGoals.map(sg => (
                      <div
                        key={sg.id}
                        className="w-2 h-2 rounded-sm"
                        style={{ background: sg.completed ? color : '#262626' }}
                        title={sg.title}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
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
