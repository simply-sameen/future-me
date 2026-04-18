import { useState } from 'react'
import { Crown, LayoutDashboard, LogOut, ChevronDown, Zap, Settings, User as UserIcon, Mail, Lock, Eye, EyeOff, BellOff, Bell, Sun, Moon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useApp } from '../../contexts/AppContext'

const ACCENT_COLORS = [
  { key: 'lavender', hex: '#e8daf9' },
  { key: 'yellow', hex: '#ffc95e' },
  { key: 'orange', hex: '#f57362' },
  { key: 'sky-blue', hex: '#61adee' },
  { key: 'teal', hex: '#2a9d99' },
  { key: 'brown', hex: '#b18164' },
]

function ProfileSettingsModal({ onClose }: { onClose: () => void }) {
  const { user, updateUserProfile, toggleSocialCues, updateUserTheme } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!user) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates: { name?: string; email?: string; password?: string } = {}
      if (name !== user.name) updates.name = name
      if (email !== user.email) updates.email = email
      if (password.trim()) updates.password = password

      if (Object.keys(updates).length === 0) {
        onClose()
        return
      }

      await updateUserProfile(updates)
      setPassword('')
      onClose()
    } catch {
      // Error already toasted in updateUserProfile
    } finally {
      setIsSaving(false)
    }
  }

  const showSocialCues = user.showSocialCues !== false
  const currentTheme = user.theme || 'dark'
  const currentAccent = user.accentColor || 'sky-blue'

  const handleModeChange = (mode: 'light' | 'dark') => {
    updateUserTheme(mode, currentAccent)
  }

  const handleAccentChange = (accent: string) => {
    updateUserTheme(currentTheme, accent)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-md w-full rounded-2xl p-6 overflow-y-auto card-flat"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, var(--user-accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--user-accent) 25%, transparent)' }}
          >
            <Settings className="w-5 h-5" style={{ color: 'var(--user-accent)' }} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Profile Settings</h3>
            <p className="text-xs text-muted-foreground">Update your account details</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserIcon className="w-3 h-3" />
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-[var(--user-accent)]"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-[var(--user-accent)]"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[var(--user-accent)]"
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ──────────────── THEME SETTINGS ──────────────── */}
          <div className="pt-4 border-t border-border mt-6 mb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-4">
              Theme Settings
            </label>

            {/* Light/Dark Toggle */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Appearance</p>
              <div className="flex gap-2 p-1 rounded-lg border border-border bg-muted">
                <button
                  type="button"
                  onClick={() => handleModeChange('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm rounded-md transition-colors ${currentTheme === 'light' ? 'bg-background shadow font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm rounded-md transition-colors ${currentTheme === 'dark' ? 'bg-background shadow font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Accent Color</p>
              <div className="flex items-center gap-3">
                {ACCENT_COLORS.map(color => {
                  const isActive = currentAccent === color.key
                  return (
                    <button
                      key={color.key}
                      type="button"
                      onClick={() => handleAccentChange(color.key)}
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: isActive ? `0 0 0 2px var(--background), 0 0 0 4px ${color.hex}` : 'none'
                      }}
                      title={color.key.replace('-', ' ')}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Social Cue Toggle */}
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ background: 'color-mix(in srgb, var(--user-accent) 4%, var(--muted))', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              {showSocialCues ? (
                <Bell className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Show Global Social Cues</p>
                <p className="text-xs text-muted-foreground">Display community broadcast banners</p>
              </div>
            </div>
            <button
              onClick={toggleSocialCues}
              className="relative w-11 h-6 rounded-full transition-colors duration-200"
              style={{
                background: showSocialCues ? 'color-mix(in srgb, var(--user-accent) 40%, var(--card))' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="absolute top-[1px] w-5 h-5 rounded-full transition-transform duration-200"
                style={{
                  background: showSocialCues ? 'var(--user-accent)' : '#555',
                  transform: showSocialCues ? 'translateX(20px)' : 'translateX(2px)',
                }}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-border bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-10 rounded-lg text-sm font-bold btn-primary border-none disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserDropdown() {
  const { user, isPremium, togglePremium, navigateTo, logout } = useApp()
  const [showSettings, setShowSettings] = useState(false)

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent transition-all duration-200 focus:outline-none hover:bg-muted"
            style={{ '--tw-hover-border-opacity': '1', borderColor: 'transparent' } as any}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--user-accent) 40%, transparent)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback
                className="text-xs font-bold"
                style={{ background: 'var(--user-accent)', color: 'var(--background)' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-foreground leading-none">{user.name}</p>
              <div className="mt-0.5">
                {isPremium ? (
                  <Badge className="text-[10px] px-1 py-0 h-3.5 border-none" style={{ background: 'color-mix(in srgb, var(--user-accent) 20%, transparent)', color: 'var(--user-accent)' }}>
                    PRO
                  </Badge>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Free Plan</span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 border-border bg-card shadow-lg"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-1">
            <DropdownMenuItem
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground focus:bg-muted transition-colors outline-none"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={togglePremium}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm transition-colors focus:bg-muted outline-none"
              style={{ color: 'var(--user-accent)' }}
            >
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
                  <span>Switch to Free Mode</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" style={{ color: 'var(--user-accent)' }} />
                  <span>Toggle Premium Mode</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground focus:bg-muted transition-colors outline-none"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-border" />

          <div className="p-1">
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSettings && <ProfileSettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
