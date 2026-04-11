import { NewsTicker } from './NewsTicker'
import { Sidebar } from './Sidebar'
import { UserDropdown } from './UserDropdown'
import { useApp } from '../../contexts/AppContext'
import { Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface GlobalLayoutProps {
  children: React.ReactNode
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const { tickers } = useApp()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const hasTicker = tickers.length > 0

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#141414' }}>
      {hasTicker && <NewsTicker />}

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar />
        </div>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 flex">
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header
            className="flex items-center justify-between px-4 md:px-6 h-14 border-b shrink-0"
            style={{ background: '#0A0A0A', borderBottomColor: '#262626' }}
          >
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden md:block">
                <span className="text-sm text-muted-foreground">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors relative"
                style={{ background: '#141414', border: '1px solid #262626' }}
              >
                <Bell className="w-4 h-4" />
                <span
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#FF69B4' }}
                />
              </button>
              <UserDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto" style={{ background: '#141414' }}>
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
