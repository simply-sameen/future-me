import { useState } from 'react'
import { Button } from '../ui/button'
import { X, Sparkles, Send, CircleAlert as AlertCircle } from 'lucide-react'
import type { Goal } from '../../types'

interface GoalAIModalProps {
  goal: Goal
  isOpen: boolean
  onClose: () => void
  apiKey: string | null
}

export function GoalAIModal({ goal, isOpen, onClose, apiKey }: GoalAIModalProps) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleAsk = async () => {
    if (!query.trim() || !apiKey) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const prompt = `Help me with this goal: "${goal.title}". Context: ${goal.description}.

My specific question: ${query}

Provide a concise, actionable response.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to get response')
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (text) {
        setResponse(text)
      }
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
          {!apiKey && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,105,180,0.08)', border: '1px solid rgba(255,105,180,0.2)' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-neon-pink shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">API Key Required</p>
                  <p>Set up your Google Gemini API key in settings to use the AI Assistant.</p>
                </div>
              </div>
            </div>
          )}

          {response && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(137,207,240,0.08)', border: '1px solid rgba(137,207,240,0.2)' }}>
              <p className="text-sm text-foreground leading-relaxed">{response}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {apiKey && (
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
              className="w-full h-10 btn-neon-pink border-none font-bold disabled:opacity-50 flex items-center justify-center gap-2"
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
        )}
      </div>
    </div>
  )
}
