import { useState } from 'react'
import { Crown, LayoutDashboard, LogOut, ChevronDown, Zap, Settings, User as UserIcon, Mail, Lock, Eye, EyeOff, BellOff, Bell } from 'lucide-react'
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

function ProfileSettingsModal({ onClose }: { onClose: () => void }) {
  const { user, updateUserProfile, toggleSocialCues } = useApp()
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-md w-full rounded-2xl p-6 overflow-y-auto"
        style={{ background: '#0A0A0A', border: '1px solid rgba(255,105,180,0.3)', maxHeight: '90vh' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,105,180,0.15)', border: '1px solid rgba(255,105,180,0.3)' }}
          >
            <Settings className="w-5 h-5 text-neon-pink" />
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
              className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-ring"
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
              className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-ring"
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
                className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-ring"
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

          {/* Social Cue Toggle */}
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ background: '#141414', border: '1px solid #262626' }}
          >
            <div className="flex items-center gap-3">
              {showSocialCues ? (
                <Bell className="w-4 h-4 text-neon-blue" />
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
                background: showSocialCues ? 'rgba(137,207,240,0.4)' : '#262626',
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                style={{
                  background: showSocialCues ? '#89CFF0' : '#555',
                  transform: showSocialCues ? 'translateX(22px)' : 'translateX(2px)',
                }}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: '#262626', background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-10 rounded-lg text-sm font-bold btn-neon-pink border-none disabled:opacity-50"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:border-[rgba(255,105,180,0.4)] focus:outline-none"
            style={{ borderColor: '#262626', background: '#0A0A0A' }}
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback
                className="text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #FF69B4, #89CFF0)', color: '#0A0A0A' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-foreground leading-none">{user.name}</p>
              <div className="mt-0.5">
                {isPremium ? (
                  <Badge className="text-[10px] px-1 py-0 h-3.5" style={{ background: 'linear-gradient(135deg, #FF69B4, #89CFF0)', color: '#0A0A0A', border: 'none' }}>
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
          className="w-52 border"
          style={{ background: '#0A0A0A', borderColor: '#262626' }}
        >
          <div className="px-3 py-2 border-b" style={{ borderBottomColor: '#262626' }}>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-1">
            <DropdownMenuItem
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={togglePremium}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm transition-colors"
              style={{ color: isPremium ? '#FF69B4' : '#89CFF0' }}
            >
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4" style={{ color: '#FF69B4' }} />
                  <span>Switch to Free Mode</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" style={{ color: '#89CFF0' }} />
                  <span>Toggle Premium Mode</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator style={{ background: '#262626' }} />

          <div className="p-1">
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm text-destructive hover:text-destructive transition-colors"
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
