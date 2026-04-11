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
      style={{ background: '#0A0A0A', borderRightColor: '#262626' }}
    >
      <div className="p-5 border-b" style={{ borderBottomColor: '#262626' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF69B4, #89CFF0)' }}
          >
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight shimmer-text">Future Me</h1>
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
                  ? 'text-black'
                  : isLocked
                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#1A1A1A]'
                }
              `}
              style={isActive ? {
                background: 'linear-gradient(135deg, #FF69B4, #ff4da6)',
                boxShadow: '0 0 15px rgba(255,105,180,0.4)',
              } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {isLocked && (
                <Lock className="w-3 h-3 ml-auto" />
              )}
              {item.id === 'goals' && !isActive && activeGoalCount > 0 && (
                <Badge
                  className="ml-auto text-[10px] h-4 px-1.5 border-none"
                  style={{ background: 'rgba(255,105,180,0.15)', color: '#FF69B4' }}
                >
                  {activeGoalCount}
                </Badge>
              )}
              {item.premiumOnly && !isLocked && !isActive && (
                <Zap className="w-3 h-3 ml-auto text-[#89CFF0]" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderTopColor: '#262626' }}>
        {isPremium ? (
          <div
            className="rounded-lg p-3"
            style={{ background: 'linear-gradient(135deg, rgba(255,105,180,0.1), rgba(137,207,240,0.1))', border: '1px solid rgba(255,105,180,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-neon-pink" />
              <span className="text-xs font-bold text-neon-pink">Premium Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground">All features unlocked</p>
          </div>
        ) : (
          <div
            className="rounded-lg p-3 cursor-pointer transition-all hover:border-[rgba(255,105,180,0.3)]"
            style={{ background: '#141414', border: '1px solid #262626' }}
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
