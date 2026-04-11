import { TriangleAlert as AlertTriangle, Heart, Users } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import type { TickerCategory } from '../../types'

const categoryConfig: Record<TickerCategory, { icon: typeof AlertTriangle; color: string; label: string }> = {
  'missing-person': { icon: AlertTriangle, color: '#FF69B4', label: 'ALERT' },
  'help-a-life': { icon: Heart, color: '#89CFF0', label: 'HELP' },
  'community': { icon: Users, color: '#a8e6a3', label: 'COMMUNITY' },
}

export function NewsTicker() {
  const { tickers } = useApp()

  if (tickers.length === 0) return null

  const tickerText = tickers.map(t => `  •  ${t.message}`).join('')

  const firstTicker = tickers[0]
  const config = categoryConfig[firstTicker.category]
  const Icon = config.icon

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        backgroundColor: 'rgba(10,10,10,0.95)',
        borderBottomColor: config.color + '40',
        height: '36px',
      }}
    >
      <div className="flex items-center h-full">
        <div
          className="flex items-center gap-1.5 px-3 shrink-0 h-full z-10"
          style={{
            backgroundColor: config.color + '20',
            borderRight: `1px solid ${config.color}40`,
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
          <span
            className="text-xs font-bold tracking-widest"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker inline-block text-xs text-muted-foreground py-0.5">
            {tickerText}{tickerText}
          </div>
        </div>
      </div>
    </div>
  )
}
