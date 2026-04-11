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
        className="relative max-w-md w-full rounded-2xl p-8 overflow-hidden"
        style={{
          background: '#0A0A0A',
          border: '1px solid rgba(137,207,240,0.3)',
          boxShadow: '0 0 60px rgba(137,207,240,0.15), 0 0 120px rgba(137,207,240,0.07)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(137,207,240,0.3) 0%, transparent 70%)',
          }}
        />

        <button
          onClick={closeMomentumModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors z-10"
          style={{ background: '#1A1A1A', border: '1px solid #262626' }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center animate-float"
              style={{ background: 'linear-gradient(135deg, rgba(137,207,240,0.2), rgba(255,105,180,0.2))', border: '1px solid rgba(137,207,240,0.3)' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#89CFF0' }} />
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
            style={{ background: 'rgba(137,207,240,0.05)', border: '1px solid rgba(137,207,240,0.15)' }}
          >
            <Quote className="w-5 h-5 mb-3" style={{ color: '#89CFF0', opacity: 0.6 }} />
            <p className="text-base font-medium leading-relaxed text-foreground/90 italic">
              "{quote}"
            </p>
          </div>

          <div
            className="rounded-lg p-3 mb-6 flex items-center gap-3"
            style={{ background: 'rgba(255,105,180,0.06)', border: '1px solid rgba(255,105,180,0.15)' }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: '#FF69B4', boxShadow: '0 0 8px rgba(255,105,180,0.6)' }}
            />
            <p className="text-xs text-muted-foreground">
              Your future self sent you this reminder. Every step you take today shapes who you become.
            </p>
          </div>

          <Button
            onClick={closeMomentumModal}
            className="w-full h-12 text-base font-bold rounded-xl transition-all duration-300 border-none btn-neon-blue"
            style={{
              boxShadow: '0 0 25px rgba(137,207,240,0.5), 0 0 50px rgba(137,207,240,0.25)',
            }}
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
