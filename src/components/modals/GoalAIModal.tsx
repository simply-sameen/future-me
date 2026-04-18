import { useState } from 'react'
import { Button } from '../ui/button'
import { X, Sparkles, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../../contexts/AppContext'
import type { Goal } from '../../types'

interface GoalAIModalProps {
  goal: Goal
  isOpen: boolean
  onClose: () => void
}

export function GoalAIModal({ goal, isOpen, onClose }: GoalAIModalProps) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { incrementAiCalls } = useApp()

  if (!isOpen) return null

  const handleAsk = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const prompt = `Help me with this goal: "${goal.title}".
Description: ${goal.description || 'N/A'}
Target Date: ${goal.targetDate || 'Not set'}
Priority: ${goal.priority === 3 ? 'High' : goal.priority === 2 ? 'Medium' : goal.priority === 1 ? 'Low' : 'Not set'}
Difficulty: ${goal.difficulty || 'Not set'}/5
Obstacles: ${goal.obstacles || 'None specified'}
Motivation: ${goal.motivation || 'Not specified'}

My specific question: ${query}

Provide a concise, actionable response.`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: '',
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || 'Failed to get response');
      }

      const data = await response.json()
      const text = data.response

      if (text) {
        setResponse(text)
        incrementAiCalls()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg)
      toast.error(`AI API Error: ${errorMsg}`)
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
        style={{ background: 'var(--card)', border: '1px solid var(--border)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderBottomColor: '#262626' }}>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--user-accent)' }} />
            <div>
              <h3 className="font-bold text-foreground">AI Assistant</h3>
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


          {response && (
            <div className="rounded-lg p-4" style={{ background: 'color-mix(in srgb, var(--user-accent) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--user-accent) 20%, transparent)' }}>
              <p className="text-sm text-foreground leading-relaxed">{response}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t space-y-3" style={{ borderTopColor: '#262626' }}>
          <textarea
            placeholder="Ask for help breaking down this goal, strategies, or tips..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 rounded-lg text-sm bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
            rows={3}
          />
          <Button
            onClick={handleAsk}
            disabled={!query.trim() || isLoading}
            className="w-full h-10 btn-primary border-none font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask AI</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
