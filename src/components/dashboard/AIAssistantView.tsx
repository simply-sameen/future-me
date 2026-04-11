import { useState } from 'react'
import { Sparkles, Send, MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useApp } from '../../contexts/AppContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistantView() {
  const { goals } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant here to help you break down goals, create strategies, and stay motivated. For specific goal coaching, use the "Coach" button on each goal card. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = goals.length > 0
        ? `\n\nUser's current goals: ${goals.map(g => `"${g.title}"`).join(', ')}`
        : ''

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            goalTitle: 'General Assistance',
            goalDescription: input + context,
            subGoals: goals.slice(0, 3).map(g => ({
              title: g.title,
              estimatedDays: g.etcDays,
            })),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.advice || 'No response generated',
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,105,180,0.15), rgba(137,207,240,0.15))' }}
          >
            <Sparkles className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">General guidance and strategy</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 rounded-lg p-4" style={{ background: '#0A0A0A', border: '1px solid #262626' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">Start a conversation about your goals</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs px-4 py-3 rounded-lg text-sm"
                style={
                  message.role === 'user'
                    ? {
                        background: 'rgba(255,105,180,0.15)',
                        border: '1px solid rgba(255,105,180,0.2)',
                        color: '#fff',
                      }
                    : {
                        background: 'rgba(137,207,240,0.08)',
                        border: '1px solid rgba(137,207,240,0.2)',
                        color: '#fff',
                      }
                }
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              style={{
                background: 'rgba(137,207,240,0.08)',
                border: '1px solid rgba(137,207,240,0.2)',
              }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything about your goals..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg text-sm bg-input border border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="btn-neon-pink border-none font-bold disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
