import { useState } from 'react'
import { Bell, Plus, Calendar, Clock, Repeat, ToggleLeft, ToggleRight, Trash2, Pencil } from 'lucide-react'
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

function ReminderCard({ reminder, onToggle, onDelete, onEdit }: { reminder: Reminder; onToggle: () => void; onDelete: () => void; onEdit: () => void }) {
  const scheduledDate = new Date(reminder.scheduledDate)
  const formattedDate = scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 group"
      style={{
        background: reminder.isActive ? 'color-mix(in srgb, var(--user-accent) 5%, transparent)' : 'var(--card)',
        border: `1px solid ${reminder.isActive ? 'color-mix(in srgb, var(--user-accent) 20%, transparent)' : 'var(--border-color, #333)'}`
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: reminder.isActive ? 'color-mix(in srgb, var(--user-accent) 15%, transparent)' : 'var(--muted)',
              border: `1px solid ${reminder.isActive ? 'color-mix(in srgb, var(--user-accent) 30%, transparent)' : 'var(--border)'}`,
            }}
          >
            <Bell className="w-4 h-4" style={{ color: reminder.isActive ? 'var(--user-accent)' : '#666' }} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-foreground leading-snug">{reminder.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{reminder.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button
            onClick={onEdit}
            className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/20 rounded-lg"
            title="Edit reminder"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-400" />
          </button>
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
              <ToggleRight className="w-6 h-6" style={{ color: 'var(--user-accent)' }} />
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
    </div >
  )
}

function ReminderModal({ onClose, onAdd, onUpdate, editingReminder }: { onClose: () => void; onAdd: (r: Reminder) => void; onUpdate?: (id: string, updates: Partial<Reminder>) => void; editingReminder?: Reminder | null }) {
  const [title, setTitle] = useState(editingReminder?.title || '')
  const [message, setMessage] = useState(editingReminder?.message || '')
  const [date, setDate] = useState(editingReminder?.scheduledDate || '')
  const [time, setTime] = useState(editingReminder?.scheduledTime?.substring(0, 5) || '09:00')
  const [repeat, setRepeat] = useState<Reminder['repeat']>(editingReminder?.repeat || 'none')

  const isEditing = !!editingReminder

  const handleSubmit = () => {
    if (!title.trim() || !date) return
    if (isEditing && onUpdate) {
      onUpdate(editingReminder.id, {
        title,
        message: message || `Reminder: ${title}`,
        scheduledDate: date,
        scheduledTime: time,
        repeat,
      })
    } else {
      onAdd({
        title,
        message: message || `Reminder: ${title}`,
        scheduledDate: date,
        scheduledTime: time,
        repeat,
        isActive: true,
      } as any)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-md w-full rounded-2xl p-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(137,207,240,0.15)', border: '1px solid rgba(137,207,240,0.3)' }}
          >
            <Bell className="w-5 h-5" style={{ color: 'var(--user-accent)' }} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{isEditing ? 'Edit Reminder' : 'Schedule Reminder'}</h3>
            <p className="text-xs text-muted-foreground">{isEditing ? 'Update your reminder details' : 'Send a message to your future self'}</p>
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
                    background: repeat === r ? 'color-mix(in srgb, var(--user-accent) 20%, transparent)' : 'var(--muted)',
                    border: `1px solid ${repeat === r ? 'color-mix(in srgb, var(--user-accent) 40%, transparent)' : 'var(--border)'}`,
                    color: repeat === r ? 'var(--user-accent)' : 'var(--muted-foreground)',
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
            onClick={handleSubmit}
            disabled={!title.trim() || !date}
            className="flex-1 h-10 btn-primary border-none font-bold disabled:opacity-50"
          >
            {isEditing ? 'Update' : 'Schedule'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function RemindersView() {
  const { reminders, addReminder, toggleReminder, deleteReminder, updateReminder } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  const activeCount = reminders.filter(r => r.isActive).length

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingReminder(null)
  }

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
          className="h-9 text-sm font-bold border-none rounded-lg btn-primary flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New Reminder
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
            style={{ background: 'color-mix(in srgb, var(--user-accent) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--user-accent) 20%, transparent)' }}
          >
            <Bell className="w-10 h-10" style={{ color: 'var(--user-accent)' }} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Reminders Yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Schedule messages to your future self. You'll thank yourself later.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="btn-primary border-none h-10 px-6 font-bold"
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
              onEdit={() => setEditingReminder(reminder)}
            />
          ))}
        </div>
      )}

      {(showModal || editingReminder) && (
        <ReminderModal
          onClose={handleCloseModal}
          onAdd={addReminder}
          onUpdate={updateReminder}
          editingReminder={editingReminder}
        />
      )}
    </div>
  )
}
