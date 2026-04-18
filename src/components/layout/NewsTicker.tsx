import { Megaphone } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export function NewsTicker() {
  const { tickers } = useApp()

  if (tickers.length === 0) return null

  const tickerText = tickers.map(t => `  •  ${t.message}`).join('')

  return (
    <div
      className="relative overflow-hidden border-b border-transparent"
      style={{
        backgroundColor: 'var(--user-accent)',
        height: '36px',
      }}
    >
      <div className="flex items-center h-full">
        <div
          className="flex items-center gap-1.5 px-3 shrink-0 h-full z-10"
          style={{
            backgroundColor: 'rgba(0,0,0,0.12)',
            borderRight: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Megaphone className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-bold tracking-widest text-white">
            ANNOUNCEMENT
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker inline-block text-xs text-white/90 font-medium py-0.5">
            {tickerText}{tickerText}
          </div>
        </div>
      </div>
    </div>
  )
}
