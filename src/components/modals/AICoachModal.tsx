import { useState } from 'react'
import { Button } from '../ui/button'
import { X, Sparkles, CircleAlert as AlertCircle } from 'lucide-react'
import type { Goal } from '../../types'

interface AICoachModalProps {
  goal: Goal
  isOpen: boolean
  onClose: () => void
}

export function AICoachModal({ goal, isOpen, onClose }: AICoachModalProps) {
  const [advice, setAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const fetchCoachAdvice = async () => {
    setIsLoading(true)
    setError('')
    setAdvice('')

    try {
      const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goalTitle: goal.title,
            goalDescription: goal.description,
            subGoals: goal.subGoals.map(sg => ({
              title: sg.title,
              estimatedDays: sg.estimatedDays,
            })),
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get coaching advice')
      }

      const data = await response.json()
      setAdvice(data.advice)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-lg w-full rounded-2xl overflow-hidden"
        style={{ background: '#0A0A0A', border: '1px solid rgba(255,105,180,0.3)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderBottomColor: '#262626' }}>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-neon-pink" />
            <div>
              <h3 className="font-bold text-foreground">AI Coach</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!advice && !error && !isLoading && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,105,180,0.08)', border: '1px solid rgba(255,105,180,0.2)' }}>
              <p className="text-sm text-muted-foreground">
                Get personalized coaching advice on how to optimize this goal's execution and timeline.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {advice && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(137,207,240,0.08)', border: '1px solid rgba(137,207,240,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-neon-pink" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coaching Advice</p>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {advice}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t" style={{ borderTopColor: '#262626' }}>
          {!advice ? (
            <Button
              onClick={fetchCoachAdvice}
              disabled={isLoading}
              className="w-full h-10 btn-neon-pink border-none font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Getting Advice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Get Coaching Advice</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={fetchCoachAdvice}
              disabled={isLoading}
              className="w-full h-10 bg-muted text-muted-foreground border-none font-bold"
            >
              {isLoading ? 'Refreshing...' : 'Get New Advice'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
