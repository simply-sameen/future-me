import { useState, useEffect } from 'react'
import { X, ArrowRight, Sparkles, Quote } from 'lucide-react'
import { Button } from '../ui/button'
import { useApp } from '../../contexts/AppContext'
import { MOTIVATIONAL_QUOTES } from '../../data/mockData'

export function MomentumModal() {
  const { showMomentumModal, closeMomentumModal, user } = useApp()
  const [quote] = useState(() =>
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showMomentumModal) {
      setTimeout(() => setVisible(true), 50)
    } else {
      setVisible(false)
    }
  }, [showMomentumModal])

  if (!showMomentumModal) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div
        className="relative max-w-md w-full rounded-2xl p-8 overflow-hidden card-flat"
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Subtle ambient tint — no glow */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, var(--user-accent) 0%, transparent 70%)',
          }}
        />

        <button
          onClick={closeMomentumModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors z-10 card-flat"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center animate-float"
              style={{
                background: 'color-mix(in srgb, var(--user-accent) 15%, transparent)',
                border: '1px solid color-mix(in srgb, var(--user-accent) 30%, transparent)',
              }}
            >
              <Sparkles className="w-6 h-6" style={{ color: 'var(--user-accent)' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Welcome Back</p>
              <h2 className="text-xl font-bold text-foreground">
                Hey, {user?.name?.split(' ')[0]} 👋
              </h2>
            </div>
          </div>

          <div
            className="rounded-xl p-5 mb-6"
            style={{
              background: 'color-mix(in srgb, var(--user-accent) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--user-accent) 15%, transparent)',
            }}
          >
            <Quote className="w-5 h-5 mb-3" style={{ color: 'var(--user-accent)', opacity: 0.6 }} />
            <p className="text-base font-medium leading-relaxed text-foreground/90 italic">
              "{quote}"
            </p>
          </div>

          <div
            className="rounded-lg p-3 mb-6 flex items-center gap-3"
            style={{
              background: 'color-mix(in srgb, var(--user-accent) 6%, transparent)',
              border: '1px solid color-mix(in srgb, var(--user-accent) 15%, transparent)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: 'var(--user-accent)' }}
            />
            <p className="text-xs text-muted-foreground">
              Your future self sent you this reminder. Every step you take today shapes who you become.
            </p>
          </div>

          <Button
            onClick={closeMomentumModal}
            className="w-full h-12 text-base font-bold rounded-xl border-none btn-primary"
          >
            <span>Take the Next Step</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Your goals are waiting. Let's make progress today.
          </p>
        </div>
      </div>
    </div>
  )
}
