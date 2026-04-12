import { NewsTicker } from './NewsTicker'
import { Sidebar } from './Sidebar'
import { UserDropdown } from './UserDropdown'
import { useApp } from '../../contexts/AppContext'
import { Bell, Menu, X, Bug } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface GlobalLayoutProps {
  children: React.ReactNode
}

function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatWithZero = (n: number) => n.toString().padStart(2, '0')
  
  const hh = formatWithZero(time.getHours())
  const mm = formatWithZero(time.getMinutes())
  const ss = formatWithZero(time.getSeconds())
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = days[time.getDay()]
  
  const DD = formatWithZero(time.getDate())
  const MM = formatWithZero(time.getMonth() + 1)
  const YY = time.getFullYear().toString().slice(-2)

  const timeString = `${hh}:${mm}:${ss} ${dayName}, ${DD}-${MM}-${YY}`

  return (
    <div className="hidden lg:block text-xs font-mono text-muted-foreground tracking-wider">
      {timeString}
    </div>
  )
}

function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const triggerToast = () => {
    toast.success('Test Toast Successful!')
    setIsOpen(false)
  }

  const triggerNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Debug Mode', { body: 'Test Notification Successful!' })
    } else {
      toast.error('Notification permission denied or unavailable.')
    }
    setIsOpen(false)
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        style={{ background: '#1a1a1a', border: '1px solid #262626' }}
        title="Admin/Debug"
      >
        <Bug className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#313338] border border-gray-700 rounded-md shadow-lg z-50 overflow-hidden flex flex-col py-1">
          <button 
            onClick={triggerToast}
            className="px-4 py-2 text-sm text-left text-gray-200 hover:bg-[#2b2d31] transition-colors"
          >
            Test Toast
          </button>
          <button 
            onClick={triggerNotification}
            className="px-4 py-2 text-sm text-left text-gray-200 hover:bg-[#2b2d31] transition-colors"
          >
            Test Notification
          </button>
        </div>
      )}
    </div>
  )
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const { tickers, notifications, setNotifications } = useApp()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  
  const hasTicker = tickers.length > 0
  const hasUnreadNotifications = notifications.some(n => !n.read)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    if (!isNotificationsOpen && hasUnreadNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

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
              <LiveClock />
              <DebugPanel />
              <div ref={notificationsRef} className="relative">
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors relative"
                  style={{ background: '#141414', border: '1px solid #262626' }}
                  onClick={toggleNotifications}
                >
                  <Bell className="w-4 h-4" />
                  {hasUnreadNotifications && (
                    <span
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: '#FF69B4' }}
                    />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#313338] border border-gray-700 rounded-md shadow-lg z-50 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-gray-700 shrink-0">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-400">
                          No new notifications.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="p-3 border-b border-gray-800 hover:bg-[#2b2d31] transition-colors last:border-0"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-200">{notif.title}</span>
                              <span className="text-[10px] text-gray-500 whitespace-nowrap mt-0.5">
                                {formatDistanceToNow(new Date(notif.time), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
