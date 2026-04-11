import { useState } from 'react'
import { Bell, Plus, Calendar, Clock, Repeat, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { useApp } from '../../contexts/AppContext'
import type { Reminder } from '../../types'

const REPEAT_LABELS: Record<Reminder['repeat'], string> = {
  none: 'Once',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const REPEAT_COLORS: Record<Reminder['repeat'], string> = {
  none: 'rgba(255,255,255,0.1)',
  daily: 'rgba(255,105,180,0.15)',
  weekly: 'rgba(137,207,240,0.15)',
  monthly: 'rgba(134,239,172,0.15)',
}

function ReminderCard({ reminder, onToggle, onDelete }: { reminder: Reminder; onToggle: () => void; onDelete: () => void }) {
  const scheduledDate = new Date(reminder.scheduledDate)
  const formattedDate = scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 group"
      style={{
        background: reminder.isActive ? 'rgba(255,105,180,0.05)' : '#0A0A0A',
        border: `1px solid ${reminder.isActive ? 'rgba(255,105,180,0.2)' : '#262626'}`,
      }}
      onMouseEnter={e => {
        if (reminder.isActive) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,105,180,0.1)'
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: reminder.isActive ? 'rgba(255,105,180,0.15)' : '#1A1A1A',
              border: `1px solid ${reminder.isActive ? 'rgba(255,105,180,0.3)' : '#262626'}`,
            }}
          >
            <Bell className="w-4 h-4" style={{ color: reminder.isActive ? '#FF69B4' : '#666' }} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-foreground leading-snug">{reminder.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{reminder.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button
            onClick={onDelete}
            className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 rounded-lg"
            title="Delete reminder"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
          <button
            onClick={onToggle}
            className="transition-colors"
          >
            {reminder.isActive ? (
              <ToggleRight className="w-6 h-6" style={{ color: '#FF69B4' }} />
            ) : (
              <ToggleLeft className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{reminder.scheduledTime}</span>
        </div>
        <Badge
          className="text-[10px] border-none px-2"
          style={{
            background: REPEAT_COLORS[reminder.repeat],
            color: reminder.repeat === 'none' ? '#888' : reminder.repeat === 'daily' ? '#FF69B4' : reminder.repeat === 'weekly' ? '#89CFF0' : '#86efac',
          }}
        >
          <Repeat className="w-2.5 h-2.5 mr-1" />
          {REPEAT_LABELS[reminder.repeat]}
        </Badge>
      </div>
    </div>
  )
}

function AddReminderModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: Reminder) => void }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [repeat, setRepeat] = useState<Reminder['repeat']>('none')

  const handleAdd = () => {
    if (!title.trim() || !date) return
    onAdd({
      title,
      message: message || `Reminder: ${title}`,
      scheduledDate: date,
      scheduledTime: time,
      repeat,
      isActive: true,
    } as any)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-md w-full rounded-2xl p-6"
        style={{ background: '#0A0A0A', border: '1px solid rgba(137,207,240,0.3)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(137,207,240,0.15)', border: '1px solid rgba(137,207,240,0.3)' }}
          >
            <Bell className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Schedule Reminder</h3>
            <p className="text-xs text-muted-foreground">Send a message to your future self</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Reminder Title
            </label>
            <Input
              placeholder="e.g. 6-Month Check In"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border-border bg-input"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Message to Future Self
            </label>
            <textarea
              placeholder="What do you want to remind yourself of?"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border-border bg-input"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="border-border bg-input"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Repeat
            </label>
            <div className="flex gap-2">
              {(['none', 'daily', 'weekly', 'monthly'] as Reminder['repeat'][]).map(r => (
                <button
                  key={r}
                  onClick={() => setRepeat(r)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: repeat === r ? 'rgba(137,207,240,0.2)' : '#141414',
                    border: `1px solid ${repeat === r ? 'rgba(137,207,240,0.4)' : '#262626'}`,
                    color: repeat === r ? '#89CFF0' : '#888',
                  }}
                >
                  {REPEAT_LABELS[r]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-border text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!title.trim() || !date}
            className="flex-1 h-10 btn-neon-blue border-none font-bold disabled:opacity-50"
          >
            Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}

export function RemindersView() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useApp()
  const [showModal, setShowModal] = useState(false)

  const activeCount = reminders.filter(r => r.isActive).length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reminders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeCount} active · {reminders.length} total
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-9 text-sm font-bold border-none rounded-lg btn-neon-blue flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New Reminder
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
            style={{ background: 'rgba(137,207,240,0.08)', border: '1px solid rgba(137,207,240,0.2)' }}
          >
            <Bell className="w-10 h-10 text-neon-blue" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Reminders Yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Schedule messages to your future self. You'll thank yourself later.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="btn-neon-blue border-none h-10 px-6 font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule First Reminder
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggle={() => toggleReminder(reminder.id)}
              onDelete={() => deleteReminder(reminder.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddReminderModal
          onClose={() => setShowModal(false)}
          onAdd={addReminder}
        />
      )}
    </div>
  )
}
