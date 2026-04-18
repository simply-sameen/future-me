import { Target, Bell, Calendar, ChartBar as BarChart3, Lock, Zap, Sparkles, Wand as Wand2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useApp } from '../../contexts/AppContext'
import type { DashboardTab } from '../../types'

interface NavItem {
  id: DashboardTab
  label: string
  icon: typeof Target
  premiumOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, premiumOnly: true },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Wand2 },
]

export function Sidebar() {
  const { dashboardTab, setDashboardTab, isPremium, goals } = useApp()

  const activeGoalCount = goals.length

  return (
    <aside
      className="flex flex-col w-64 h-full border-r shrink-0"
      style={{ background: 'var(--card)', borderRightColor: 'var(--border)' }}
    >
      <div className="p-5 border-b" style={{ borderBottomColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--user-accent)' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Future Me</h1>
            <p className="text-[10px] text-muted-foreground">Remind</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 tracking-widest uppercase">
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = dashboardTab === item.id
          const isLocked = item.premiumOnly && !isPremium

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isLocked) setDashboardTab(item.id)
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 relative group
                ${isActive
                  ? 'text-primary-foreground font-bold'
                  : isLocked
                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              style={isActive ? { background: 'var(--user-accent)', color: 'var(--primary-foreground)' } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {isLocked && (
                <Lock className="w-3 h-3 ml-auto" />
              )}
              {item.id === 'goals' && !isActive && activeGoalCount > 0 && (
                <Badge
                  className="ml-auto text-[10px] h-4 px-1.5 border-none"
                  style={{ background: 'color-mix(in srgb, var(--user-accent) 15%, transparent)', color: 'var(--user-accent)' }}
                >
                  {activeGoalCount}
                </Badge>
              )}
              {item.premiumOnly && !isLocked && !isActive && (
                <Zap className="w-3 h-3 ml-auto" style={{ color: 'var(--user-accent)' }} />
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderTopColor: 'var(--border)' }}>
        {isPremium ? (
          <div
            className="rounded-lg p-3"
            style={{ background: 'color-mix(in srgb, var(--user-accent) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--user-accent) 20%, transparent)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--user-accent)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--user-accent)' }}>Premium Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground">All features unlocked</p>
          </div>
        ) : (
          <div
            className="rounded-lg p-3 cursor-pointer transition-all hover:bg-muted"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Free Plan</span>
            </div>
            <p className="text-[10px] text-muted-foreground">3 goals max · Analytics locked</p>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Built by Divya and Team
        </p>
      </div>
    </aside>
  )
}
