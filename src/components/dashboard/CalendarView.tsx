import { useState } from 'react'
import { ChevronLeft, ChevronRight, Bell, Target } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function CalendarView() {
  const { reminders } = useApp()
  const today = new Date()
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const { year, month } = viewDate
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setViewDate(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayReminders = reminders.filter(r => r.scheduledDate === dateStr)
    return dayReminders
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null
  const selectedReminders = selectedDay ? reminders.filter(r => r.scheduledDate === selectedDateStr) : []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {reminders.filter(r => r.isActive).length} active reminders scheduled
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-foreground">
              {MONTH_NAMES[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />
              }

              const events = getEventsForDay(day)
              const hasEvents = events.length > 0
              const todayFlag = isToday(day)
              const isSelected = selectedDay === day

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                  className="relative aspect-square flex flex-col items-center justify-start rounded-lg p-1 text-sm transition-all duration-150"
                  style={{
                    background: isSelected
                      ? 'color-mix(in srgb, var(--user-accent) 20%, transparent)'
                      : todayFlag
                        ? 'color-mix(in srgb, var(--user-accent) 8%, transparent)'
                        : 'transparent',
                    border: isSelected
                      ? '1px solid color-mix(in srgb, var(--user-accent) 50%, transparent)'
                      : todayFlag
                        ? '1px solid color-mix(in srgb, var(--user-accent) 30%, transparent)'
                        : '1px solid transparent',
                    color: todayFlag ? 'var(--user-accent)' : 'var(--foreground)',
                    fontWeight: todayFlag ? 700 : 400,
                  }}
                >
                  <span className="text-xs leading-tight">{day}</span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {events.slice(0, 3).map(e => (
                        <div
                          key={e.id}
                          className="w-1 h-1 rounded-full"
                          style={{ background: e.isActive ? 'var(--user-accent)' : 'var(--muted-foreground)' }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
              {selectedDay
                ? `${MONTH_NAMES[month]} ${selectedDay}`
                : 'Select a day'}
            </h4>

            {selectedDay ? (
              selectedReminders.length > 0 ? (
                <div className="space-y-2">
                  {selectedReminders.map(r => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg"
                      style={{
                        background: r.isActive ? 'color-mix(in srgb, var(--user-accent) 6%, transparent)' : 'var(--muted)',
                        border: `1px solid ${r.isActive ? 'color-mix(in srgb, var(--user-accent) 20%, transparent)' : 'var(--border)'}`,
                      }}
                    >
                      <p className="text-xs font-semibold text-foreground">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{r.scheduledTime}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No reminders on this day</p>
              )
            ) : (
              <p className="text-xs text-muted-foreground">Click on a date to see events</p>
            )}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
              Upcoming
            </h4>
            <div className="space-y-2">
              {reminders
                .filter(r => r.isActive && new Date(r.scheduledDate) >= today)
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .slice(0, 4)
                .map(r => {
                  const d = new Date(r.scheduledDate)
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--user-accent)' }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              {reminders.filter(r => r.isActive && new Date(r.scheduledDate) >= today).length === 0 && (
                <p className="text-xs text-muted-foreground">No upcoming reminders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
