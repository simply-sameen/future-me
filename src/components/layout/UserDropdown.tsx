import { Crown, LayoutDashboard, LogOut, ChevronDown, Zap } from 'lucide-react'
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

export function UserDropdown() {
  const { user, isPremium, togglePremium, navigateTo, logout } = useApp()

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
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
  )
}
